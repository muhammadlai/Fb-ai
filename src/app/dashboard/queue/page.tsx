"use client";

import React, { useEffect, useState } from "react";
import { Clock, Plus, Trash2, Sparkles, CheckCircle2 } from "lucide-react";

export default function QueueAutomationPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [newDay, setNewDay] = useState("1");
  const [newTime, setNewTime] = useState("09:00");

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccountId) {
      fetchSlots();
    }
  }, [selectedAccountId]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      if (data.accounts && data.accounts.length > 0) {
        setAccounts(data.accounts);
        setSelectedAccountId(data.accounts[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await fetch(`/api/queue?accountId=${selectedAccountId}`);
      const data = await res.json();
      if (data.schedules) {
        setSlots(data.schedules);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSlot = async () => {
    if (!selectedAccountId || !newTime) return;
    try {
      await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectedAccountId: selectedAccountId,
          dayOfWeek: Number(newDay),
          timeSlot: newTime,
        }),
      });
      fetchSlots();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await fetch(`/api/queue?id=${id}`, { method: "DELETE" });
      setSlots(slots.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-indigo-600" /> Queue Slot Automation
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure posting time slots for each social account so posts queue automatically without manual scheduling.
        </p>
      </div>

      {/* Social Account Selector */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Account</label>
        <div className="flex flex-wrap gap-3">
          {accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                selectedAccountId === acc.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <span>{acc.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Slot Form */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Posting Schedule Slot</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Day of Week</label>
            <select
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {daysOfWeek.map((day, idx) => (
                <option key={idx} value={idx}>{day}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Posting Time</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <button
            onClick={handleAddSlot}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
          >
            <Plus className="w-4 h-4" /> Add Slot
          </button>
        </div>
      </div>

      {/* Slots Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOfWeek.map((dayName, dayIdx) => {
          const daySlots = slots.filter((s) => s.dayOfWeek === dayIdx);

          return (
            <div
              key={dayIdx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {dayName}
              </h4>

              {daySlots.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No slots defined for this day</p>
              ) : (
                <div className="space-y-2">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs font-bold"
                    >
                      <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        {slot.timeSlot}
                      </span>
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
