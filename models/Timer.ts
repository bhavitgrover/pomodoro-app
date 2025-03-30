export default interface Timer {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  duration: number;
  isCompleted: boolean;
  completedDuration: number;
  completedAt: Date;
  uid: string;
}