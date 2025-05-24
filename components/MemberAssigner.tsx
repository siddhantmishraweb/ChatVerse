// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { User, Chat } from '../types';

interface Props { chat: Chat; onClose: () => void; }

export default function MemberAssigner({ chat, onClose }: Props) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string[]>(chat.members);

  useEffect(() => {
    supabase.from<User>('users').select('*').then(({ data }) => data && setAllUsers(data));
  }, []);

  const toggle = (id: string) =>
    setSelected(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);

  const save = async () => {
    await supabase.from('chats').update({ members: selected }).eq('id', chat.id);
    onClose();
  };

  return (
    <aside className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <section className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Assign Members</h3>
        <ul className="max-h-60 overflow-y-auto mb-4">
          {allUsers.map(u => (
            <li key={u.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selected.includes(u.id)}
                onChange={() => toggle(u.id)}
                className="mr-2"
              />
              <span>{u.username}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 mr-2">Cancel</button>
          <button onClick={save} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
        </div>
      </section>
    </aside>
  );
}
