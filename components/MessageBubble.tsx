// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useRef, useState, useEffect } from "react";
import { Message } from "../types";
import { Play, Pause } from "lucide-react";

interface Props {
  message: Message;
  isOwn: boolean;
  senderAvatar?: string;
}

export default function MessageBubble({ message, isOwn, senderAvatar }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleEnded = () => setIsPlaying(false);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(formatTime(audio.duration));
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const renderContent = () => {
    if (message.type === "audio" && message.content) {
      return (
        <div className="flex items-center gap-3">
          <audio ref={audioRef} src={message.content} preload="metadata" />
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-white border shadow-sm text-gray-800"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <div className="flex-1 flex items-center gap-1">
            {/* Fake waveform bars */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-[2px] rounded bg-gray-500"
                style={{
                  height: `${Math.random() * (12 - 4) + 4}px`,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        </div>
      );
    }

    if (message.type === "image" && message.content) {
      return (
        <img
          src={message.content}
          alt="Sent image"
          className="max-w-full max-h-64 rounded cursor-pointer"
          onClick={() => window.open(message.content, "_blank")}
        />
      );
    }

    // Default: render text
    return message.content ? (
      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
    ) : null;
  };

  return (
    <article
      className={`flex items-end gap-2 mb-3 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwn && senderAvatar && (
        <img
          src={senderAvatar}
          alt="Sender Avatar"
          className="w-8 h-8 rounded-full shadow-md"
        />
      )}
      <div
        className={`relative max-w-[75%] px-3 py-2 rounded-lg text-sm shadow-sm transition-all ${
          isOwn
            ? "bg-green-100 text-gray-800 rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        {renderContent()}
        <time className="block text-[10px] text-gray-500 mt-1 text-right">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
      {isOwn && senderAvatar && (
        <img
          src={senderAvatar}
          alt="My Avatar"
          className="w-8 h-8 rounded-full shadow-md"
        />
      )}
    </article>
  );
}
