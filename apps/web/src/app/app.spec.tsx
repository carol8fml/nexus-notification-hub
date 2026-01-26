import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { App } from './app';

vi.mock('axios');
const mockedAxiosPost = vi.fn();
(axios.post as any) = mockedAxiosPost;

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form with all fields', () => {
    render(<App />);

    expect(screen.getByText('Nexus Notification Hub')).toBeInTheDocument();
    expect(screen.getByText('Send email notifications')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Send Notification')).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    mockedAxiosPost.mockResolvedValue({ data: { success: true } });

    render(<App />);

    const emailInput = screen.getByLabelText(/Email Address/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button');

    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'Test message');
    await user.click(submitButton);

    expect(mockedAxiosPost).toHaveBeenCalledWith(
      'http://localhost:3000/api/notifications',
      {
        type: 'email',
        destination: 'test@example.com',
        content: 'Test message',
      }
    );

    await waitFor(() => {
      expect(
        screen.getByText('Email notification sent successfully!')
      ).toBeInTheDocument();
    });
  });

  it('should show error message on API failure', async () => {
    const user = userEvent.setup();
    mockedAxiosPost.mockRejectedValue(new Error('Network error'));

    render(<App />);

    const emailInput = screen.getByLabelText(/Email Address/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button');

    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'Test message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Error sending email notification. Please try again.')
      ).toBeInTheDocument();
    });
  });

  it('should clear form after successful submission', async () => {
    const user = userEvent.setup();
    mockedAxiosPost.mockResolvedValue({ data: { success: true } });

    render(<App />);

    const emailInput = screen.getByLabelText(/Email Address/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button');

    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'Test message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });
  });

  it('should disable submit button while loading', async () => {
    const user = userEvent.setup();
    mockedAxiosPost.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<App />);

    const emailInput = screen.getByLabelText(/Email Address/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole('button');

    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'Test message');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Sending...')).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
