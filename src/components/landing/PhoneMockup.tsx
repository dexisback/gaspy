"use client";

import { motion } from "framer-motion";

function DashboardMockup() {
  return (
    <div className="flex h-full flex-col rounded-[36px] bg-gray-50 p-4 pt-5">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-900">Dashboard</h3>
        <div className="h-5 w-5 rounded-full bg-[#C5F80A]" />
      </div>

      {/* Stats */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-white p-2.5 shadow-sm">
          <p className="text-[9px] text-gray-500">Total Calls</p>
          <p className="text-base font-bold text-gray-900">1,284</p>
        </div>
        <div className="rounded-xl bg-white p-2.5 shadow-sm">
          <p className="text-[9px] text-gray-500">Scheduled</p>
          <p className="text-base font-bold text-gray-900">892</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-3 rounded-xl bg-white p-2.5 shadow-sm">
        <p className="mb-1.5 text-[9px] font-medium text-gray-500">
          Weekly Activity
        </p>
        <div className="flex h-12 items-end gap-[3px]">
          {[35, 55, 40, 70, 50, 85, 65].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-[#C5F80A]"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 space-y-1.5">
        <p className="text-[9px] font-medium text-gray-500">Recent</p>
        {[
          { title: "Team Standup", time: "Today, 10:00 AM", color: "bg-blue-100" },
          { title: "Client Review", time: "Today, 2:00 PM", color: "bg-orange-100" },
          { title: "Design Sync", time: "Tomorrow, 11:00 AM", color: "bg-purple-100" },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm"
          >
            <div className={`h-5 w-5 rounded-full ${item.color}`} />
            <div>
              <p className="text-[10px] font-medium text-gray-900">
                {item.title}
              </p>
              <p className="text-[9px] text-gray-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PhoneMockup() {
  return (
    <div
      className="fixed bottom-0 left-1/2 z-10 -translate-x-1/2"
      style={{ height: "440px" }}
    >
      <motion.div
        className="relative cursor-pointer"
        initial={{ y: 390 }}
        animate={{ y: 390 }}
        whileHover={{ y: 170 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.6,
        }}
      >
        {/* Phone Frame */}
        <div
          className="relative flex h-[640px] w-[320px] flex-col overflow-hidden rounded-[48px] border-[8px] border-gray-900 bg-white"
          style={{
            boxShadow: `
              0 0 0 1px rgba(0,0,0,0.08),
              0 4px 12px rgba(0,0,0,0.06),
              0 16px 40px rgba(0,0,0,0.1),
              0 0 60px rgba(197,248,10,0.06)
            `,
          }}
        >
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-3 z-20 h-7 w-24 -translate-x-1/2 rounded-full bg-black" />

          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 pt-2 text-xs font-medium text-gray-900">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
              </svg>
              <div className="h-2 w-5 rounded-sm bg-gray-900" />
            </div>
          </div>

          {/* Dashboard Screen Content */}
          <div className="mt-5 flex-1 overflow-hidden px-2 pb-2">
            <DashboardMockup />
          </div>
        </div>

        {/* Side Buttons (decorative) */}
        <div className="absolute -left-[10px] top-24 h-8 w-[2px] rounded-l bg-gray-800" />
        <div className="absolute -left-[10px] top-36 h-14 w-[2px] rounded-l bg-gray-800" />
        <div className="absolute -left-[10px] top-52 h-14 w-[2px] rounded-l bg-gray-800" />
        <div className="absolute -right-[10px] top-40 h-20 w-[2px] rounded-r bg-gray-800" />
      </motion.div>
    </div>
  );
}
