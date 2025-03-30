"use client";
import React from "react";
import { getSpecificTimer, updateTimer } from "@/collections/timerFirestore";
import User from "@/models/User";
import Timer from "@/models/Timer";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/utils/AuthContext";
import { useParams } from "next/navigation";

function Focus() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [timer, setTimer] = useState<Timer | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);
  const [completed, setCompleted] = useState<boolean>(false);
  const params = useParams();
  const timerId = params.id as string;

  useEffect(() => {
    const fetchTimer = async () => {
      if (user) {
        try {
          const timerData = await getSpecificTimer(user.uid, timerId);
          setTimer(timerData);
          if (timerData.completedDuration > 0) {
            setTimeLeft(timerData.duration - timerData.completedDuration);
            setProgress(
              ((timerData.duration - timerData.completedDuration) /
                timerData.duration) *
                100
            );
          } else {
            setTimeLeft(timerData.duration);
          }
          if (timerData.isCompleted) {
            setTimeLeft(0);
            setProgress(0);
          }
        } catch (error) {
          console.error("Error fetching timer:", error);
        }
      }
    };
    fetchTimer();
  }, [user, timerId]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleTimerComplete = useCallback(async () => {
    if (user && timer) {
      const updatedTimer = {
        ...timer,
        completedDuration: timer.duration,
        isCompleted: true,
        completedAt: new Date(),
      };
      await updateTimer(user.uid, timerId, updatedTimer);
      setCompleted(true);
      console.log("updated timer");
    }
  }, [user, timer, timerId]);

  const handleTimerPause = useCallback(async () => {
    if (user && timer) {
      const updatedTimer = {
        ...timer,
        completedDuration: timer.duration - timeLeft,
      };
      await updateTimer(user.uid, timerId, updatedTimer);
      console.log("updated timer");
    }
  }, [user, timer, timeLeft, timerId]);

  const handleTimerReset = useCallback(async () => {
    if (user && timer) {
      const updatedTimer = {
        ...timer,
        completedDuration: 0,
        isCompleted: false,
        completedAt: null,
      };
      await updateTimer(user.uid, timerId, updatedTimer);
      console.log("updated timer");
    }
  }, [user, timer, timerId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          const newProgress = (newTime / (timer?.duration || 1)) * 100;
          setProgress(newProgress);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && timer && !timer.isCompleted) {
      setIsActive(false);
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, timer, handleTimerComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleTimer = () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);

    if (!newActiveState && timeLeft > 0) {
      handleTimerPause();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(timer?.duration || 0);
    setProgress(100);
    handleTimerReset();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-[#F0EFF4] w-min-screen h-screen flex flex-col items-center justify-center">
      <div className="rounded-full aspect-square w-60 relative z-10 flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(#D5CDFF 0%, #D5CDFF ${progress}%, transparent ${progress}%)`,
            transform: "rotate(-90deg)",
          }}
        ></div>

        <div className="bg-[#FEFEFE] rounded-full aspect-square w-[90%] z-20 flex flex-col items-center justify-center">
          <h1 className="font-bold text-4xl">{formatTime(timeLeft)}</h1>
          <p className="text-gray-500">
            {isActive ? "focusing..." : "ready to focus"}
          </p>
        </div>
      </div>
      {!completed && (
        <div className="flex flex-row gap-4 mt-10">
          <button
            onClick={toggleTimer}
            className="w-10 aspect-square bg-[#0a0a0a] rounded-lg flex items-center justify-center"
            aria-label={isActive ? "Pause" : "Play"}
          >
            {isActive ? (
              <div className="flex flex-row items-center justify-baseline gap-1">
                <div className="w-1.5 h-5 bg-white rounded-sm" />
                <div className="w-1.5 h-5 bg-white rounded-sm" />
              </div>
            ) : (
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
            )}
          </button>
          <button
            onClick={resetTimer}
            className="w-10 aspect-square bg-[#0a0a0a] rounded-lg flex items-center justify-center"
            aria-label="Reset"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.7 2.3C12.1 0.7 10.1 0 8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C11.7 16 14.8 13.4 15.7 10H13.7C12.8 12.3 10.6 14 8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C9.7 2 11.1 2.7 12.1 3.9L9 7H16V0L13.7 2.3Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      )}
      {completed && (
        <div className="mt-5 flex flex-col items-center justify-center">
          <p className="m-0">Yay! You completed your focus session!</p>
          <button
            onClick={() => router.push("/timer")}
            className="mt-5 py-3 px-4 bg-[#D5CDFF] rounded-lg "
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

export default Focus;
