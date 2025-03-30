import Timer from "./Timer";

export default interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date;
  timers: Timer[];
}