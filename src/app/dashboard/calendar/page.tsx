"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function CalendarPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600" /> Interactive Content Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual schedule of all upcoming Facebook, Instagram, and social publications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
            <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold px-3">
              {monthNames[month]} {year}
            </span>
            <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/dashboard/composer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </Link>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty_${idx}`} className="min-h-24 p-2 bg-slate-50/30 dark:bg-slate-800/10 rounded-xl" />;
            }

            // Find posts scheduled for this day
            const cellDateStr = new Date(year, month, day).toDateString();
            const dayPosts = posts.filter((item) => {
              const pDate = item.post.scheduledAt ? new Date(item.post.scheduledAt) : item.post.publishedAt ? new Date(item.post.publishedAt) : null;
              return pDate && pDate.toDateString() === cellDateStr;
            });

            return (
              <div
                key={day}
                className="min-h-28 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between hover:border-indigo-500/50 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{day}</span>
                  <Link
                    href={`/dashboard/composer?date=${year}-${month + 1}-${day}`}
                    className="opacity-0 group-hover:opacity-100 p-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded transition"
                    title="Add post for this date"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-1 my-1">
                  {dayPosts.map((item) => (
                    <div
                      key={item.post.id}
                      className={`p-1.5 rounded text-[10px] font-bold line-clamp-1 truncate ${
                        item.post.status === "published"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200"
                          : "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200"
                      }`}
                      title={item.post.content}
                    >
                      {item.post.content}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
