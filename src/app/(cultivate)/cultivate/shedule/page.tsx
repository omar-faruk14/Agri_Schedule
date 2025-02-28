"use client";
import { useState } from "react";

interface Schedule {
  title: string;
  task: string;
  startTime: string;
  endTime: string;
  code: string;
  status: string;
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const schedules: Schedule[] = [
    {
      title: "りんご普通木",
      task: "剪定",
      startTime: "2025-02-26 9:00",
      endTime: "2025-02-26 18:00",
      code: "f111-c",
      status: "途中",
    },
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-lg font-bold">スケジュール</h1>
      <div className="flex items-center gap-2 my-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <button className="w-full mb-2 p-2 border rounded">予定</button>
      <div className="border p-2 rounded mb-4">
        1. ...........................................
      </div>
      <button className="w-full mb-2 p-2 border rounded">やったこと</button>
      {schedules.map((schedule, index) => (
        <div key={index} className="border p-4 mb-4 rounded">
          <h2 className="text-lg font-semibold">{schedule.title}</h2>
          <p>タイトル: {schedule.task}</p>
          <p>開始時間: {schedule.startTime}</p>
          <p>終了時間: {schedule.endTime}</p>
          <p>コード: {schedule.code}</p>
          <p>作業状況: {schedule.status}</p>
        </div>
      ))}
    </div>
  );
}
