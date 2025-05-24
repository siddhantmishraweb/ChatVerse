"use client";
import { useState, useRef } from "react";
import {
  PaperClipIcon,
  FaceSmileIcon,
  ClockIcon,
  StarIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { supabase } from "../utils/supabaseClient";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface Props {
  chatId: string;
  userId: string;
}

export default function MessageInput({ chatId, userId }: Props) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [important, setImportant] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleFileIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const sendMessage = async () => {
    if (audioBlob) {
      const audioPath = `${chatId}/${Date.now()}.webm`;
      const { data, error } = await supabase.storage
        .from("attachments")
        .upload(audioPath, audioBlob);

      if (error || !data) {
        console.error("Audio upload failed:", error);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(data.path);

      await supabase.from("messages").insert([
        {
          chat_id: chatId,
          sender_id: userId,
          content: urlData.publicUrl,
          type: "audio",
          important: false,
        },
      ]);

      setAudioBlob(null);
      setAudioUrl(null);
      setIsRecording(false);
      return;
    }

    if (imageFile) {
      const filePath = `${chatId}/${Date.now()}_${imageFile.name}`;
      const { data, error } = await supabase.storage
        .from("attachments")
        .upload(filePath, imageFile);

      if (error || !data) {
        console.error("Image upload failed:", error);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(data.path);

      await supabase.from("messages").insert([
        {
          chat_id: chatId,
          sender_id: userId,
          content: urlData.publicUrl,
          type: "image",
          important: false,
        },
      ]);

      setImageFile(null);
      setImagePreviewUrl(null);
      return;
    }

    if (!text.trim()) return;

    await supabase.from("messages").insert([
      {
        chat_id: chatId,
        sender_id: userId,
        content: text.trim(),
        type: "text",
        important,
      },
    ]);

    setText("");
    setImportant(false);
    setShowEmojiPicker(false);
  };

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const uploadAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    if (file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      // Handle video or other types directly
      const filePath = `${chatId}/${Date.now()}_${file.name}`;
      supabase.storage
        .from("attachments")
        .upload(filePath, file)
        .then(({ data, error }) => {
          if (error || !data) {
            console.error("File upload failed:", error);
            return;
          }

          const { data: urlData } = supabase.storage
            .from("attachments")
            .getPublicUrl(data.path);

          supabase.from("messages").insert([
            {
              chat_id: chatId,
              sender_id: userId,
              content: urlData.publicUrl,
              type: "video",
              important: false,
            },
          ]);
        });
    }
  };

  const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

  const onEmojiClick = (emojiData: { emoji: string }) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const insertCurrentTime = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setText((prev) => prev + ` [${timeStr}]`);
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Audio recording not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const newBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(newBlob);
        setAudioUrl(URL.createObjectURL(newBlob));
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
  };

  const clearAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
      className="flex items-center p-4 border-t bg-white relative"
    >
      <PaperClipIcon
        className="w-6 h-6 text-gray-500 mr-3 cursor-pointer"
        onClick={handleFileIconClick}
        title="Attach files"
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={uploadAttachment}
        className="hidden"
        ref={fileInputRef}
      />

      <div className="relative">
        <FaceSmileIcon
          className="w-6 h-6 text-gray-500 mr-3 cursor-pointer"
          onClick={toggleEmojiPicker}
          title="Emoji picker"
        />
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-50 shadow-md rounded bg-white">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>

      <ClockIcon
        className="w-6 h-6 text-gray-500 mr-3 cursor-pointer"
        title="Insert time"
        onClick={insertCurrentTime}
      />

      <StarIcon
        className={`w-6 h-6 mr-3 cursor-pointer ${
          important ? "text-yellow-500" : "text-gray-500"
        }`}
        onClick={() => setImportant((prev) => !prev)}
        title={important ? "Unmark important" : "Mark important"}
      />

      <MicrophoneIcon
        className={`w-6 h-6 mr-3 cursor-pointer ${
          isRecording ? "text-red-600 animate-pulse" : "text-gray-500"
        }`}
        onClick={toggleRecording}
        title={isRecording ? "Stop recording" : "Start recording"}
      />

      {audioUrl ? (
        <div className="flex items-center flex-grow mx-3 border rounded-full px-4 py-2">
          <audio controls src={audioUrl} className="flex-grow" />
          <button type="button" onClick={clearAudio} className="ml-2 text-red-600 font-bold">
            ✕
          </button>
        </div>
      ) : imagePreviewUrl ? (
        <div className="flex items-center flex-grow mx-3 border rounded px-4 py-2">
          <img src={imagePreviewUrl} alt="preview" className="w-12 h-12 rounded object-cover" />
          <button type="button" onClick={clearImage} className="ml-2 text-red-600 font-bold">
            ✕
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..."
          onKeyDown={handleEnter}
          className="flex-grow px-4 py-2 mx-3 border rounded-full focus:outline-none"
        />
      )}

      <button
        type="submit"
        className="ml-auto"
        disabled={!text.trim() && !audioBlob && !imageFile}
        title="Send message"
      >
        <PaperAirplaneIcon className="w-6 h-6 text-green-600" />
      </button>
    </form>
  );
}
