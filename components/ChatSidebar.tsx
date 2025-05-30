// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import type { User, Chat } from "../types";
import ChatListItem from "./ChatListItem";
import Filters from "./Filters";

interface Props {
  user: User;
  chats: Chat[];
  allUsers: User[];
  onSelect: (chatId: string) => void;
  onStartChat: (otherUser: User) => void;
}

export default function ChatSidebar({
  user,
  chats,
  allUsers,
  senderList,
  onSelect,
  onStartChat,
}: Props) {
  const [search, setSearch] = useState("");
  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  console.log("senderList------", senderList);

  const handleLogout = async () => {
    localStorage.clear();

    window.location.href = "/";
    await supabase.auth.signOut();
  };

  return (
    <aside className="w-80 bg-white border-r flex flex-col">
      {/* User Header */}
      <header className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <img
            src={user?.user_metadata?.avatar_url || "https://img.freepik.com/free-psd/3d-illustration-business-man-with-glasses_23-2149436194.jpg?t=st=1748164973~exp=1748168573~hmac=7d7161b95647cf4ef8eea1ad5a8b408565fd3b185a3501e5374cb14ca2c84377"}
            alt="Your avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="font-semibold">{user.username}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600"
          style={{ cursor: "pointer" }}
        >
          Logout
        </button>
      </header>

      {/* Search Chats */}
      <Filters onSearch={setSearch} />

      {/* Chats List */}
      <nav className="flex-1 overflow-y-auto divide-y">
        {filteredChats.map((chat) => {
          const otherUserId = chat.members.find(
            (id: string) => id !== user?.id
          );
          const otherUser = senderList.find((u) => u.id === otherUserId);

          return (
            <ChatListItem
              key={chat.id}
              chat={chat}
              currentUser={user}
              senderUser={otherUser}
              onSelect={onSelect}
            />
          );
        })}
      </nav>

      <hr className="my-2" />

      {/* People */}
      <div className="px-4 py-2 font-semibold">People</div>
      <nav className="flex-1 overflow-y-auto">
        {allUsers.map((u) => (
          <button
            key={u.id}
            onClick={() => onStartChat(u)}
            className="w-full text-left p-3 hover:bg-gray-100 flex items-center"
          >
            <img
              src={u?.avatar_url || "https://img.freepik.com/premium-psd/3d-cartoon-character-isolated-3d-rendering_235528-536.jpg"}
              alt={u.username}
              className="w-8 h-8 rounded-full mr-3"
            />
            <span>{u.username}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
