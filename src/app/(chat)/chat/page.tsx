import { ChatWindow } from "@/components/chat/ChatWindow";

export default function ChatPage() {
  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Gaspy Chat</h1>
      <ChatWindow />
    </div>
  );
}
