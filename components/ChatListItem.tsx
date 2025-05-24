// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from "react";
import { Chat, User } from "../types";
import { formatDistanceToNow } from "date-fns";

interface Props {
  chat: Chat & { last_message?: { content: string; created_at: string } };
  currentUser: User;
  onSelect: (chatId: string) => void;
}

export default function ChatListItem({
  chat,
  currentUser,
  senderUser,
  onSelect,
}: Props) {
  console.info("current user:", currentUser)
  console.info("senderUser ChatListItem ", senderUser)
  const { title, last_message } = chat;
  return (
    <article
      className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
      onClick={() => onSelect(chat.id)}
      aria-label={`Open chat ${title}`}
    >
      <img
        src={senderUser?.avatar_url || "/avatar.png"}
        alt="avatar"
        className="w-12 h-12 rounded-full mr-4"
      />
      <div className="flex-1">
        <header className="flex justify-between">
          <h2 className="font-semibold">{title}</h2>
          {last_message && (
            <time className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(last_message.created_at), {
                addSuffix: true,
              })}
            </time>
          )}
        </header>
        {last_message && (
          <p className="text-sm text-gray-600 truncate">
            {last_message.content}
          </p>
        )}
      </div>
    </article>
  );
}
