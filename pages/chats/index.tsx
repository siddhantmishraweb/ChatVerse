// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-nocheck
// import { useEffect, useState } from "react";
// import { supabase } from "../../utils/supabaseClient";
// import ChatSidebar from "../../components/ChatSidebar";
// import ChatWindow from "../../components/ChatWindow";
// import type { User, Chat } from "../../types";
// import Loader from "../../components/Loader";

// export default function ChatsPage() {
//   const [user, setUser] = useState<User | null>(null);

//   // useEffect(() => {
//   //   // localStorage is safe to use here (browser only)
//   //   const savedSession = localStorage.getItem('supabaseSession');
//   //   if (savedSession) {
//   //     try {
//   //       const parsed = JSON.parse(savedSession);
//   //       console.log("parsed::: ", parsed);
//   //       setUser(parsed?.user || null);
//   //     } catch (err) {
//   //       console.error('Failed to parse session from localStorage:', err);
//   //     }
//   //   }
//   // }, []);

// useEffect(() => {
//   const fetchUserData = async () => {
//     try {
//       const savedSession = localStorage.getItem('supabaseSession');
//       if (savedSession) {
//         const parsed = JSON.parse(savedSession);
//         console.log("parsed::: ", parsed);
//         setUser(parsed?.session?.user || null);
//       }
//     } catch (err) {
//       console.error('Failed to parse session from localStorage:', err);
//     }
//   };

//   fetchUserData();
// }, []);



//   const [chats, setChats] = useState<Chat[]>([]);
//   const [allUsers, setAllUsers] = useState<User[]>([]);
//   const [activeChat, setActiveChat] = useState<Chat | null>(null);
//   const [senderList, setSenderList] = useState<User[]>([]);

// const addToSenderList = (otherUser: User) => {
//   setSenderList((prev) => {
//     const exists = prev.some(user => user.id === otherUser.id);
//     if (!exists) {
//       return [...prev, otherUser];
//     }
//     return prev;
//   });
// };

// console.log("user ======================= ", user)
//   // 1. Get current user
//   // useEffect(() => {
//   //   supabase.auth.getUser().then(({ data }) => {
//   //     if (data.user) setUser(data.user as User);
//   //   });
//   // }, []);

//   useEffect(() => {
//     if (!user) return;

//     const fetchChats = async () => {
//       const { data: chatsData, error } = await supabase
//         .from("chats")
//         .select("*")
//         .contains("members", [user.id])
//         .order("last_updated", { ascending: false });

//       if (error) {
//         console.error("Error fetching chats:", error);
//         return;
//       }

//       if (!chatsData) {
//         setChats([]);
//         return;
//       }

//       // Remove self-chats (both members are the same)
//       const filteredChats = chatsData.filter((chat) => {
//         const uniqueMembers = [...new Set(chat.members)];
//         return uniqueMembers.length > 1;
//       });

//       // For each chat, fetch the other member's info to update the title
//       const updatedChats = await Promise.all(
//         filteredChats.map(async (chat) => {
//           const otherMemberId = chat.members.find((m) => m !== user.id);
//           if (!otherMemberId) return chat;

//           const { data: otherUser, error } = await supabase
//             .from("users")
//             .select("id, username, avatar_url")
//             .eq("id", otherMemberId)
//             .single();

//             addToSenderList(otherUser);


//           console.log("otherUser", otherUser);

//           if (error) {
//             console.warn("Could not fetch user for chat title", error);
//             return chat;
//           }

//           return {
//             ...chat,
//             title: otherUser?.username || "Unknown User",
//             avatar: otherUser?.avatar_url || "",
//           };
//         })
//       );

//       setChats(updatedChats);

//       if (!activeChat && updatedChats.length) {
//         setActiveChat(updatedChats[0]);
//       }
//     };

//     fetchChats();
//   }, [user]);

//   useEffect(() => {
//     if (!user) return;
//     supabase
//       .from<User>("users")
//       .select("*")
//       .then(({ data, error }) => {
//         console.log("Fetched allUsers:", data, "error:", error);
//         if (error) return console.error(error);
//         setAllUsers(data ?? []);
//       });
//   }, [user]);

//   const handleStartChat = async (other: User) => {
//     if (!user) return;
//     // find existing 1:1
//     const existing = chats.find(
//       (c) =>
//         c.members.length === 2 &&
//         c.members.includes(user.id) &&
//         c.members.includes(other.id)
//     );
//     if (existing) {
//       setActiveChat(existing);
//       return;
//     }
//     // create new
//     const { data, error } = await supabase
//       .from<Chat>("chats")
//       .insert([
//         {
//           title: other.username,
//           is_group: false,
//           members: [user.id, other.id],
//         },
//       ])
//       .select()
//       .single();
//     if (error) return console.error(error);
//     setChats((prev) => [data, ...prev]);
//     setActiveChat(data);
//   };

//   if (!user) {
//     return (
//       <Loader/>
//     );
//   }

//   return (
//     <div className="flex h-screen">
//       <ChatSidebar
//         user={user}
//         chats={chats}
//         allUsers={allUsers}
//         senderList={senderList}
//         onSelect={(chatId) => {
//           const c = chats.find((c) => c.id === chatId) || null;
//           setActiveChat(c);
//         }}
//         onStartChat={handleStartChat}
//       />
//       <ChatWindow
//         user={user}
//         activeChat={activeChat}
//         senderList={senderList}
//         onSelectChat={(c) => setActiveChat(c)}
//       />
//     </div>
//   );
// }











import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import ChatSidebar from "../../components/ChatSidebar";
import ChatWindow from "../../components/ChatWindow";
import type { User, Chat } from "../../types";
import Loader from "../../components/Loader";

export default function ChatsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [senderList, setSenderList] = useState<User[]>([]);

  const saveToStorage = (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  const loadFromStorage = (key: string) => {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(`Error parsing ${key} from localStorage`, e);
      return null;
    }
  };

  useEffect(() => {
    const savedUser = loadFromStorage("user");
    const savedChats = loadFromStorage("chats");
    const savedSenders = loadFromStorage("senderList");

    if (savedUser) setUser(savedUser);
    if (savedChats) setChats(savedChats);
    if (savedSenders) setSenderList(savedSenders);
  }, []);

  useEffect(() => {
    if (chats.length) saveToStorage("chats", chats);
  }, [chats]);

  useEffect(() => {
    if (senderList.length) saveToStorage("senderList", senderList);
  }, [senderList]);

  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        setUser(userData);
        return userData;
      }
      return null;
    };

    const getUser = async () => {
      const localUser = fetchUserFromLocalStorage();
      if (localUser) return;

      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    };

    getUser();
  }, []);

  const addToSenderList = (otherUser: User) => {
    setSenderList((prev) => {
      const exists = prev.some((user) => user.id === otherUser.id);
      if (!exists) {
        return [...prev, otherUser];
      }
      return prev;
    });
  };

  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      const { data: chatsData, error } = await supabase
        .from("chats")
        .select("*")
        .contains("members", [user.id])
        .order("last_updated", { ascending: false });

      if (error) {
        console.error("Error fetching chats:", error);
        return;
      }

      if (!chatsData) {
        setChats([]);
        return;
      }

      const filteredChats = chatsData.filter((chat) => {
        const uniqueMembers = [...new Set(chat.members)];
        return uniqueMembers.length > 1;
      });

      const updatedChats = await Promise.all(
        filteredChats.map(async (chat) => {
          const otherMemberId = chat.members.find((m) => m !== user.id);
          if (!otherMemberId) return chat;

          const { data: otherUser, error } = await supabase
            .from("users")
            .select("id, username, avatar_url")
            .eq("id", otherMemberId)
            .single();

          if (otherUser) addToSenderList(otherUser);

          if (error) {
            console.warn("Could not fetch user for chat title", error);
            return chat;
          }

          return {
            ...chat,
            title: otherUser?.username || "Unknown User",
            avatar: otherUser?.avatar_url || "",
          };
        })
      );

      setChats(updatedChats);
      if (!activeChat && updatedChats.length) {
        setActiveChat(updatedChats[0]);
      }
    };

    fetchChats();
  }, [user]);

  // useEffect(() => {
  //   if (!user) return;
  //   supabase
  //     .from<User>("users")
  //     .select("*")
  //     .then(({ data, error }) => {
  //       if (error) return console.error(error);
  //       setAllUsers(data ?? []);
  //     });
  // }, [user]);

useEffect(() => {
  if (!user) return;

  const localAllUsers = localStorage.getItem("allUsers");
  if (localAllUsers) {
    try {
      const parsedUsers = JSON.parse(localAllUsers);
      setAllUsers(parsedUsers);
      return;
    } catch (err) {
      console.error("Failed to parse allUsers from localStorage:", err);
    }
  }


  supabase
    .from<User>("users")
    .select("*")
    .then(({ data, error }) => {
      if (error) return console.error("Error fetching users from Supabase:", error);
      setAllUsers(data ?? []);
      localStorage.setItem("allUsers", JSON.stringify(data ?? []));
    });
}, [user]);

  const handleStartChat = async (other: User) => {
    if (!user) return;

    const existing = chats.find(
      (c) =>
        c.members.length === 2 &&
        c.members.includes(user.id) &&
        c.members.includes(other.id)
    );
    if (existing) {
      setActiveChat(existing);
      return;
    }

    const { data, error } = await supabase
      .from<Chat>("chats")
      .insert([
        {
          title: other.username,
          is_group: false,
          members: [user.id, other.id],
        },
      ])
      .select()
      .single();

    if (error) return console.error(error);

    setChats((prev) => [data, ...prev]);
    setActiveChat(data);
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen">
      <ChatSidebar
        user={user}
        chats={chats}
        allUsers={allUsers}
        senderList={senderList}
        onSelect={(chatId) => {
          const c = chats.find((c) => c.id === chatId) || null;
          setActiveChat(c);
        }}
        onStartChat={handleStartChat}
      />
      <ChatWindow
        user={user}
        activeChat={activeChat}
        senderList={senderList}
        onSelectChat={(c) => setActiveChat(c)}
      />
    </div>
  );
}
