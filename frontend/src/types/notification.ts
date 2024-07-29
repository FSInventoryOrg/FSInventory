export interface NotificationType {
  _id: string;
  date: Date;
  uniqueLabel: string;
  openTab: boolean;
  url: string;
  message: string;
  message_html: string;
  read: boolean;
}