import { openDB } from 'idb';
import { DB_NAME, STORE_MESSAGES, STORE_CHATS } from '../config/constants';
export async function openChatDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_MESSAGES)) db.createObjectStore(STORE_MESSAGES, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(STORE_CHATS)) db.createObjectStore(STORE_CHATS, { keyPath: 'id' });
    }
  });
}
export async function saveMessageToDB(msg: any) {
  const db = await openChatDB();
  await db.put(STORE_MESSAGES, msg);
}
export async function loadMessagesFromDB(chatId: string) {
  const db = await openChatDB();
  const all = await db.getAll(STORE_MESSAGES);
  return all.filter(m => m.chat_id === chatId);
}