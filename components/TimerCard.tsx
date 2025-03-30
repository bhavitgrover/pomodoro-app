"use client";

import React from "react";
import { useAuth } from "@/utils/AuthContext";
import { handleTimerSchedule } from "@/utils/HandleTimerFunction";
import { useRouter } from "next/navigation";

interface TimerCardProps {
  time: number;
}

function TimerCard({ time }: TimerCardProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleClick = async (time: number) => {
    if (!user) return;
    await handleTimerSchedule(time, user.uid).then((res) => {
      if (res.success) {
        router.push("/timer/" + res.id);
      }
    });
  };

  if (!user) {
    return <p>You must be logged in to view this page.</p>;
  }

  return (
    <div
      onClick={() => handleClick(time)}
      className="bg-[#F0EFF4] rounded-xl flex flex-col items-center justify-center w-50 h-40 cursor-pointer"
    >
      <h1 className="text-4xl font-semibold">{time}</h1>
      <p className="text-sm text-gray-500 m-0">min</p>
    </div>
  );
}

export default TimerCard;
