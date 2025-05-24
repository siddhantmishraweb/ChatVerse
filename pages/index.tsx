import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Login() {
  const router = useRouter();
  useEffect(() => { supabase.auth.getSession().then(({ data }) => data.session && router.push('/chats')); }, []);
  const login = () => supabase.auth.signInWithOAuth({ provider: 'google' });
  return (
    <main className="h-screen flex items-center justify-center bg-gray-100">
      <button onClick={login} className="px-6 py-3 bg-green-500 text-white rounded-lg shadow">Login with Google</button>
    </main>
  );
}















// import { useEffect, useState } from 'react';
// import { supabase } from '../utils/supabaseClient';
// import ChatSidebar from '../components/ChatSidebar';
// import ChatWindow from '../components/ChatWindow';
// import type { User } from '../types';

// export default function ChatsPage() {
//   const [user, setUser] = useState<User | null>({name: 'Sidd', id:'123'});
//   useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser({name: 'Sidd', id:'123'} as User)); }, []);
//   //if (!user) return <div>Loading...</div>;
//   return (<div className="flex h-screen"><ChatSidebar user={user} /><ChatWindow user={user} /></div>);
// }