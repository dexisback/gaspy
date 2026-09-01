"use client";

import { motion } from "framer-motion";
import { Message } from "./ChatWindow";

interface MessageBubbleProps {
  message: Message;
  index: number;
}

function formatAssistantText(content: string) {
  return content
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*\*/g, "");
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const displayContent = isUser ? message.content : formatAssistantText(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 22,
        delay: index * 0.04,
      }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[82%] px-4 py-2.5 text-[13px] leading-relaxed ${
          isUser
            ? "rounded-2xl rounded-br-md bg-[#171916] text-white dark:bg-[#C5F80A] dark:text-[#171717]"
            : "rounded-2xl rounded-bl-md bg-[#F2F4F5] text-[#171916] dark:bg-[#282522] dark:text-[#f0efee]"
        }`}
      >
        <p className="whitespace-pre-wrap">{displayContent}</p>
      </div>
    </motion.div>
  );
}
