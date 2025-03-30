import React from "react";
import TimerCard from "@/components/TimerCard";

function Timer() {
  return (
    <div className="flex flex-col justify-center p-10">
      <h1 className="font-semibold text-3xl mb-5">TRACK YOUR TIME</h1>
      <div className="flex flex-wrap gap-1 w-[100%]">
        <TimerCard time={5} />
        <TimerCard time={10} />
        <TimerCard time={15} />
        <TimerCard time={20} />
        <TimerCard time={25} />
        <TimerCard time={30} />
        <TimerCard time={45} />
        <TimerCard time={60} />
        <TimerCard time={90} />
        <TimerCard time={120} />
        <div className="w-50 h-40 flex items-center justify-center">
          <img src="/plus.svg" alt="plus" />
        </div>
      </div>
    </div>
  );
}

export default Timer;
