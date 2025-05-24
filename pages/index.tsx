// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { supabase } from '../utils/supabaseClient';

// export default function Login() {
//   const router = useRouter();
//   useEffect(() => { supabase.auth.getSession().then(({ data }) => data.session && router.push('/chats')); }, []);
//   const login = () => supabase.auth.signInWithOAuth({ provider: 'google' });
//   return (
//     <main className="h-screen flex items-center justify-center bg-gray-100">
//       <button onClick={login} className="px-6 py-3 bg-green-500 text-white rounded-lg shadow">Login with Google</button>
//     </main>
//   );
// }















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







// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { supabase } from '../utils/supabaseClient';

// export default function Login() {
//   const router = useRouter();

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => {
//       if (data && data.session) {
//         router.push('/chats');
//       }
//     });
//   }, []);

//   const login = () => {
//     supabase.auth.signInWithOAuth({ provider: 'google' });
//   };

//   return (
//     <main className="h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
//       <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
//         <h1 className="text-3xl font-bold text-center mb-8">Welcome to Your Chat App</h1>
//         <button onClick={login} className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors duration-300 ease-in-out">
//           <div className="flex items-center justify-center">
//             <span className="mr-2">Login with Google</span>
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//           </div>
//         </button>
//       </div>
//     </main>
//   );
// }








import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      // if (data?.session) {
      //   router.push('/chats');
      // }
      console.log("Session:: ", data)
      if (data?.session) {
        localStorage.setItem('supabaseSession', JSON.stringify(data));
        return router.push('/chats');
      } else {
        localStorage.removeItem('supabaseSession');
      }
    });
  }, []);

  const login = () => supabase.auth.signInWithOAuth({ provider: 'google' });

  return (
    <main className="relative h-screen w-screen overflow-hidden font-sans">
      {/* Background Video */}
      {/* <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/public/futuristic-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

      {/* Login Card */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
          <h1 className="text-black text-4xl font-extrabold text-center mb-6 tracking-wide">
            🚀 ChatVerse
          </h1>
          <p className="text-black-200 text-center mb-8">
            Connect. Chat. Explore the future of messaging.
          </p>
          <button
            onClick={login}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M533.5 278.4c0-17.5-1.5-34.3-4.3-50.4H272v95.2h147.3c-6.3 34.2-25 63.2-53.4 82.6v68.2h86.2c50.4-46.5 81.4-115.2 81.4-195.6z"
                fill="#4285F4"
              />
              <path
                d="M272 544.3c72.7 0 133.8-24 178.3-64.7l-86.2-68.2c-24 16.2-54.5 25.6-92.1 25.6-70.7 0-130.6-47.7-152-111.4H32.4v69.7C76.2 482.5 167.6 544.3 272 544.3z"
                fill="#34A853"
              />
              <path
                d="M120 325.6c-10.2-30.4-10.2-63.2 0-93.6V162.3H32.4C11.6 205.1 0 246.7 0 278.4s11.6 73.3 32.4 116.1l87.6-68.9z"
                fill="#FBBC05"
              />
              <path
                d="M272 107.3c39.5 0 75 13.6 103.1 40.4l77.1-77.1C405.8 25 344.7 0 272 0 167.6 0 76.2 61.8 32.4 162.3l87.6 69.7C141.4 155 201.3 107.3 272 107.3z"
                fill="#EA4335"
              />
            </svg>
            Login with Google
          </button>
        </div>
      </div>
    </main>
  );
}
