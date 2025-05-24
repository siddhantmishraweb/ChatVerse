export interface User { id: string; username: string; avatar_url: string; }
export interface Chat { id: string; title: string; is_group: boolean; members: string[]; }
export interface Message { id: string; chat_id: string; sender_id: string; content: string; type: 'text' | 'image' | 'video'; created_at: string; }
export interface Label { id: string; name: string; }
