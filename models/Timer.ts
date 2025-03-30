export default interface Timer {
  id: string;
  createdAt: Date;
  duration: number;
  isCompleted: boolean;
  completedDuration: number;
  completedAt: Date | null;
  userId: string;
}
