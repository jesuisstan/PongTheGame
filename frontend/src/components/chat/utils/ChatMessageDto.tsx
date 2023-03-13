export default class ChatMessageDto {
  user: string;
  message: string;
  timestamp: Date;

  constructor(user: string, message: string) {
    this.user = user;
    this.message = message;
    this.timestamp = new Date();
  }
}
