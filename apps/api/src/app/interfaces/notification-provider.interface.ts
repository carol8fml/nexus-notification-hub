export interface NotificationProvider {
  send(to: string, content: string): Promise<void>;
}
