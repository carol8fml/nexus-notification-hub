import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { SendNotificationDto } from "@nexus/shared-dtos";

export function App() {
  const [formData, setFormData] = useState<Omit<SendNotificationDto, "type">>({
    destination: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.focus();
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload: SendNotificationDto = {
        type: "email",
        ...formData,
      };
      await axios.post("http://localhost:3000/api/notifications", payload);
      setMessage({
        type: "success",
        text: "Email notification sent successfully!",
      });
      setFormData({ destination: "", content: "" });
      formRef.current?.querySelector<HTMLInputElement>("#destination")?.focus();
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error sending email notification. Please try again.",
      });
      formRef.current?.querySelector<HTMLInputElement>("#destination")?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-6">
      <div className="bg-white rounded-lg p-10 w-full max-w-md">
        <header className="mb-8">
          <h1 className="text-base font-normal text-[#1a1a1a] mb-0.5">
            Nexus Notification Hub
          </h1>
          <p className="text-xs text-[#6b6b6b] font-light">
            Send email notifications
          </p>
        </header>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >
          <div>
            <label
              htmlFor="destination"
              className="block text-xs font-normal text-[#6b6b6b] mb-1.5"
            >
              Email Address
            </label>
            <input
              id="destination"
              type="email"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              placeholder="email@example.com"
              required
              aria-required="true"
              aria-invalid={message?.type === "error" ? "true" : "false"}
              aria-describedby={message ? "message" : undefined}
              className="w-full px-3 py-2.5 border border-[#e0e0e0] rounded bg-white text-[#1a1a1a] placeholder:text-[#9b9b9b] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-2 focus:border-[#1a1a1a] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-xs font-normal text-[#6b6b6b] mb-1.5"
            >
              Message
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Type your message here..."
              required
              aria-required="true"
              aria-invalid={message?.type === "error" ? "true" : "false"}
              aria-describedby={message ? "message" : undefined}
              rows={5}
              className="w-full px-3 py-2.5 border border-[#e0e0e0] rounded bg-white text-[#1a1a1a] placeholder:text-[#9b9b9b] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-2 focus:border-[#1a1a1a] transition-colors resize-none"
            />
          </div>

          {message && (
            <div
              ref={messageRef}
              id="message"
              role="alert"
              aria-live="polite"
              aria-atomic="true"
              tabIndex={-1}
              className={`px-3 py-2 rounded text-xs ${
                message.type === "success"
                  ? "bg-[#f0f0f0] text-[#4a4a4a]"
                  : "bg-[#f0f0f0] text-[#4a4a4a]"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            aria-label={
              loading
                ? "Sending notification, please wait"
                : "Send email notification"
            }
            className="w-full bg-[#1a1a1a] text-white py-2.5 px-4 rounded text-sm font-normal hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default App;
