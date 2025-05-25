// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-nocheck
// import React, { useEffect, useState, useRef } from "react";
// import { useRealtimeMessages } from "../hooks/useRealtimeMessages";
// import { loadMessagesFromDB, saveMessageToDB } from "../hooks/useIndexedDB";
// import { supabase } from "../utils/supabaseClient";
// import { Message, User, Chat } from "../types";
// import MessageBubble from "./MessageBubble";
// import InputBox from "./InputBox";

// interface Props {
//   user: User;
//   activeChat?: Chat;
//   onSelectChat: (chat: Chat) => void;
// }

// export default function ChatWindow({
//   user,
//   activeChat,
//   senderList,
//   onSelectChat,
// }: Props) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   console.log("Sender list:: ", senderList);
// console.log("onSelectChat" , onSelectChat)

//   useEffect(() => {
//     if (!activeChat) return;

//     // Load from IndexedDB
//     loadMessagesFromDB(activeChat.id).then((local) => setMessages(local));

//     // Load from Supabase
//     supabase
//       .from<Message>("messages")
//       .select("*")
//       .eq("chat_id", activeChat.id)
//       .order("created_at", { ascending: true })
//       .then(({ data }) => {
//         if (data) setMessages(data);
//       });
//   }, [activeChat]);

//   useRealtimeMessages(activeChat?.id || "", (newMsg) => {
//     setMessages((prev) => [...prev, newMsg]);
//     saveMessageToDB(newMsg);
//   });

//   useEffect(() => {
//     scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
//   }, [messages]);

//   if (!activeChat) {
//     return (
//       <main className="flex-1 flex items-center justify-center">
//         Select a chat
//       </main>
//     );
//   }

//   return (
//     <main className="flex-1 flex flex-col">
//       <header className="p-4 border-b flex items-center bg-white shadow-sm">
//         <h2 className="text-lg font-semibold flex-1">{activeChat.title}</h2>
//       </header>

//       {/* WhatsApp-style background */}
//       <section
//         ref={scrollRef}
//         className="flex-1 p-4 overflow-y-auto"
//         style={{
//           backgroundImage:
//             "url(https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg)",
//           backgroundRepeat: "repeat",
//           backgroundSize: "contain",
//         }}
//       >
//         {messages.map((msg) => {
//           const sender = senderList.find((u) => u.id === msg.sender_id);
//           const avatar = sender?.avatar_url || user.user_metadata.picture;

//           return (
//             <MessageBubble
//               key={msg.id}
//               message={msg}
//               isOwn={msg.sender_id === user.id}
//               senderAvatar={avatar}
//             />
//           );
//         })}
//       </section>

//       <InputBox chatId={activeChat.id} userId={user.id} />
//     </main>
//   );
// }














// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import { useRealtimeMessages } from "../hooks/useRealtimeMessages";
import { loadMessagesFromDB, saveMessageToDB } from "../hooks/useIndexedDB";
import { supabase } from "../utils/supabaseClient";
import { Message, User, Chat } from "../types";
import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";

// interface Props {
//   user: User;
//   activeChat?: Chat;
//   onSelectChat: (chat: Chat) => void;
// }

interface Props {
  user: User;
  activeChat?: Chat;
  onSelectChat: (chat: Chat) => void;
  senderList: User[];
}

export default function ChatWindow({
  user,
  activeChat,
  senderList,
  onSelectChat,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  console.log("Sender list:: ", senderList);
console.log("onSelectChat" , onSelectChat)

  useEffect(() => {
    if (!activeChat) return;

    // Load from IndexedDB
    loadMessagesFromDB(activeChat.id).then((local) => setMessages(local));

    // Load from Supabase
    supabase
      .from<Message>("messages")
      .select("*")
      .eq("chat_id", activeChat.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data);
      });
      loadMessagesFromDB(activeChat.id).then((local) => setMessages(local));

  }, [activeChat]);

  // useRealtimeMessages(activeChat?.id || "", (newMsg) => {
  //   setMessages((prev) => [...prev, newMsg]);
  //   saveMessageToDB(newMsg);
  // });

useRealtimeMessages(activeChat?.id || "", (newMsg) => {
  setMessages((prev) => {
    const existingIndex = prev.findIndex(
      (m) =>
        m.id === newMsg.id ||
        (m.sender_id === newMsg.sender_id &&
         m.created_at === newMsg.created_at &&
         m.type === newMsg.type &&
         m.chat_id === newMsg.chat_id)
    );

    if (existingIndex !== -1) {
      const updated = [...prev];
      updated[existingIndex] = newMsg;
      return updated;
    }

    return [...prev, newMsg];
  });

  saveMessageToDB(newMsg);
});

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  if (!activeChat) {
    return (
      <main className="flex-1 flex items-center justify-center">
        Select a chat
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      <header className="p-4 border-b flex items-center bg-white shadow-sm">
        <h2 className="text-lg font-semibold flex-1">{activeChat.title}</h2>
      </header>

      {/* WhatsApp-style background */}
      <section
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto"
        style={{
          backgroundImage:
            "url(https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg)",
          backgroundRepeat: "repeat",
          backgroundSize: "contain",
        }}
      >
        {messages.map((msg) => {
          const sender = senderList.find((u) => u.id === msg.sender_id);
          const avatar = sender?.avatar_url || user?.user_metadata?.picture || "";

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === user.id}
              senderAvatar={avatar}
            />
          );
        })}
      </section>

      {/* <InputBox chatId={activeChat.id} userId={user.id} /> */}
      <InputBox
        chatId={activeChat.id}
        userId={user.id}
        onSend={(msg) => {
          setMessages((prev) => [...prev, msg]);
          saveMessageToDB(msg);
        }}
      />
    </main>
  );
}
