import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/auth/Auth';
import Account from './components/auth/Account';
import JobsManager from './components/jobs/JobsManager';

export default function Home() {
    const [session, setSession] = useState(null)

    useEffect(() => {
        setSession(supabase.auth.session());

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        });
    }, [])

    return (
        <div className="container" style={{ padding: '50px 0 100px 0' }}>
            {!session ? <Auth /> : <Account session={session} />}
            {session && <JobsManager session={session} />}
        </div>
    )
}