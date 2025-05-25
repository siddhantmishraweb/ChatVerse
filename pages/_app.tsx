// import "@/styles/globals.css";
// import type { AppProps } from "next/app";

// export default function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />;
// }









// import '../styles/globals.css';
// import { SessionContextProvider } from '@supabase/auth-helpers-react';
// import { supabase } from '../utils/supabaseClient';
// import type { AppProps } from 'next/app';

// export default function App({ Component, pageProps }: AppProps) {
//   return (
//     <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
//       <Component {...pageProps} />
//     </SessionContextProvider>
//   );
// }












// // pages/_app.tsx
// import '../styles/globals.css'
// import type { AppProps } from 'next/app'
// import { useEffect } from 'react'
// import { supabase } from '../utils/supabaseClient'

// export default function App({ Component, pageProps }: AppProps) {
//   useEffect(() => {
//     // onAuthStateChange also runs once immediately with current session
//     const { data: listener } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (session?.user) {
//           const u = session.user
//           console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", u)
//           // Upsert into your users table
//           await supabase.from('users').upsert({
//             id: u.id,
//             username: u.user_metadata.full_name || u.email || u.id,
//             avatar_url: u.user_metadata.avatar_url || null,
//           })
//         }
//       }
//     )

//     return () => {
//       listener.subscription.unsubscribe()
//     }
//   }, [])

//   return <Component {...pageProps} />
// }

// pages/_app.tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Listen for login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const u = session.user
          // Upsert into your users table
          const { error } = await supabase
            .from('users')
            .upsert({
              id: u.id,
              username: u.user_metadata.full_name || u.email || u.id,
              avatar_url: u.user_metadata.avatar_url || "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses-half-shaved-head_23-2149436187.jpg?ga=GA1.1.1768913789.1737261835&w=740",
            })
          if (error) console.error('User upsert error:', error)
        }
      }
    )
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <Component {...pageProps} />
}
