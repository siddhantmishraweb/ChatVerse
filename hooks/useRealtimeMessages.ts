import { useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
export function useRealtimeMessages(chatId: string, onNew: (m: any) => void) {
  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, payload => onNew(payload.new))
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [chatId, onNew]);
}