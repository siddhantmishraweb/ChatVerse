// import { useEffect } from 'react';
// import { supabase } from '../utils/supabaseClient';
// export function useRealtimeMessages(chatId: string, onNew: (m: any) => void) {
//   useEffect(() => {
//     const channel = supabase
//       .channel('messages')
//       .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, payload => onNew(payload.new))
//       .subscribe();
//     return () => supabase.removeChannel(channel);
//   }, [chatId, onNew]);
// }





// import { useEffect } from "react";
// import { supabase } from "../utils/supabaseClient";
// import { Message } from "../types";

// export function useRealtimeMessages(
//   chatId: string,
//   onNewMessage: (msg: Message) => void
// ) {
//   console.log("🚀 chatId:: ", chatId);
//   // useEffect(() => {
//   //   if (!chatId) return;

//   //   const channel = supabase
//   //     .channel(`messages:chat:${chatId}`)
//   //     .on(
//   //       "postgres_changes",
//   //       {
//   //         event: "INSERT",
//   //         schema: "public",
//   //         table: "messages",
//   //       },
//   //       (payload) => {
//   //         console.log("🚀 Received message:", payload.new);
//   //         onNewMessage(payload.new as Message);
//   //       }
//   //     )
//   //     .subscribe();

//   //   return () => {
//   //     supabase.removeChannel(channel);
//   //   };
//   // }, [chatId, onNewMessage]);

// useEffect(() => {
//   if (!chatId) return;

//   console.log("🟡 Subscribing to chat:", chatId);

//   const channel = supabase
//     .channel(`messages:chat:${chatId}`)
//     .on(
//       "postgres_changes",
//       {
//         event: "INSERT",
//         schema: "public",
//         table: "messages",
//         filter: `chat_id=eq.${chatId}`, // Optional but useful
//       },
//       (payload) => {
//         console.log("🚀 Received message:", payload.new);
//         onNewMessage(payload.new as Message);
//       }
//     );

//   channel.subscribe((status) => {
//     console.log("📡 Realtime subscription status:", status);
//   });

//   return () => {
//     console.log("🔴 Unsubscribing from chat:", chatId);
//     supabase.removeChannel(channel);
//   };
// }, [chatId, onNewMessage]);


// }







// import { useEffect, useRef } from "react";
// import { supabase } from "../utils/supabaseClient";
// import { Message } from "../types";

// export function useRealtimeMessages(
//   chatId: string,
//   onNewMessage: (msg: Message) => void
// ) {
//   const channelRef = useRef<any>(null);

//   useEffect(() => {
//     if (!chatId) return;

//     console.log("📡 Subscribing to realtime for chatId:", chatId);

//     // Remove any previous channel first
//     if (channelRef.current) {
//       supabase.removeChannel(channelRef.current);
//     }

//     const channel = supabase
//       .channel(`messages:chat:${chatId}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "messages",
//           filter: `chat_id=eq.${chatId}`,
//         },
//         (payload) => {
//           console.log("🚀 Received message:", payload.new);
//           onNewMessage(payload.new as Message);
//         }
//       );

//     channel.subscribe((status) => {
//       console.log("🔌 Subscription status:", status);
//     });

//     channelRef.current = channel;

//     return () => {
//       console.log("🛑 Unsubscribing from chat:", chatId);
//       supabase.removeChannel(channel);
//     };
//   }, [chatId]);
// }
















// import { useEffect, useRef } from "react";
// import { supabase } from "../utils/supabaseClient";
// import { Message } from "../types";

// export function useRealtimeMessages(
//   chatId: string,
//   onNewMessage: (msg: Message) => void
// ) {
//   const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

//   useEffect(() => {
//     if (!chatId) return;

//     console.log("📡 Subscribing to chatId:", chatId);

//     // Clean up previous subscription
//     if (channelRef.current) {
//       supabase.removeChannel(channelRef.current);
//       channelRef.current = null;
//     }

//     // Setup new channel
//     const channel = supabase
//       .channel(`messages:chat:${chatId}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "messages",
//           filter: `chat_id=eq.${chatId}`,
//         },
//         (payload) => {
//           console.log("🚀 Received message:", payload.new);
//           onNewMessage(payload.new as Message);
//         }
//       );

//     // Subscribe and monitor status
//     channel.subscribe((status) => {
//       console.log("🟢 Channel status:", status);
//     });

//     channelRef.current = channel;

//     return () => {
//       console.log("🛑 Unsubscribing from chat:", chatId);
//       if (channelRef.current) {
//         supabase.removeChannel(channelRef.current);
//         channelRef.current = null;
//       }
//     };
//   }, [chatId, onNewMessage]);
// }




import { useEffect, useRef } from "react";
import { supabase } from "../utils/supabaseClient";
import { Message } from "../types";

export function useRealtimeMessages(
  chatId: string,
  onNewMessage: (msg: Message) => void
) {
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!chatId) {
      console.warn("❌ No chatId provided. Skipping subscription.");
      return;
    }

    console.log("📡 Subscribing to chatId:", chatId);

    // Clean up any existing channel first
    if (channelRef.current) {
      console.log("🧹 Cleaning up previous channel");
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create a new channel for this chat
    const channel = supabase
      .channel(`messages:chat:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          console.log("🚀 Received message:", payload.new);
          onNewMessage(payload.new as Message);
        }
      );

    channel.subscribe((status) => {
      console.log("🟢 Channel status:", status);
    });

    channelRef.current = channel;

    // Cleanup on unmount or chatId change
    return () => {
      console.log("🛑 Unsubscribing from chat:", chatId);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [chatId]);
}
