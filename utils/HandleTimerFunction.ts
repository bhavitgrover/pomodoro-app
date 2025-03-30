import Timer from "@/models/Timer";
import { v4 as uuvidv4 } from "uuid";
import { addTimer } from "@/collections/timerFirestore";

export const handleTimerSchedule = async (
  time: number,
  id: string
): Promise<{
  timerData: Timer;
  message: string;
  success: boolean;
  id: string;
}> => {
  const timerData: Timer = {
    id: uuvidv4(),
    createdAt: new Date(),
    duration: time * 60,
    isCompleted: false,
    completedDuration: 0,
    completedAt: null,
    userId: id,
  };

  const res = await addTimer(timerData, id);

  if (res.success) {
    return { timerData, message: res.message, success: true, id: res.id };
  } else {
    throw new Error(res.message || "Failed to add timer");
  }
};
