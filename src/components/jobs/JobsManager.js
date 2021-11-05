import { useState, useEffect } from 'react'
import moment from 'moment';
import { supabase } from '../../supabaseClient'

export default function JobsManager({ session }) {
    const [loading, setLoading] = useState(true)
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        getJobs();
    }, [session]);

    async function getJobs() {
        try {
            setLoading(true);
            const user = supabase.auth.user();

            let { data, error, status } = await supabase
                .from('jobs')
                .select(`created_at, title, followed_up, notes, link`)
                .eq('ownerId', user.id);

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setJobs(data);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="form-widget">
            <h3>Jobs searched</h3>
            {!loading && jobs.map(job => {
                return (
                    <li key={job}>
                        <span>{job.title} | {moment(job.created_at).format('YYYY-MM-DD')} | {job.notes} | {job.link}</span>
                    </li>
                )
            })}
        </div>
    )
}