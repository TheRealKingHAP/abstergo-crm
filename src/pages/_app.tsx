import NavBar from '@/components/navigation/NavBar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient'
export default function App({ Component, pageProps }: AppProps<{
  initialSession: Session
}>) {
  const [supabaseClient] = useState<SupabaseClient>(() => createBrowserSupabaseClient({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  }));
  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <div className='flex flex-col items-center'>
        <NavBar />
        <Component {...pageProps} />
      </div>
    </SessionContextProvider>
  )
  
}
