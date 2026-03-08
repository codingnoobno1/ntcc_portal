'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Profile {
    id: string;
    full_name: string;
    enrollment_number: string;
    university_id: string;
    email: string;
    course: string;
    batch: string;
    school: string;
    role: string;
    created_at: string;
}

export default function AdminPortal() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfiles();
    }, []);

    async function fetchProfiles() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProfiles(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', padding: '40px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '1px' }}>
                        NTCC <span style={{ color: '#00FFFF' }}>ADMIN PORTAL</span>
                    </h1>
                    <button
                        onClick={fetchProfiles}
                        style={{ padding: '10px 20px', backgroundColor: 'rgba(0,255,255,0.1)', color: '#00FFFF', border: '1px solid #00FFFF', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Refresh Data
                    </button>
                </header>

                {error && <div style={{ padding: '20px', backgroundColor: 'rgba(255,68,68,0.1)', color: '#ff4444', borderRadius: '8px', marginBottom: '2rem' }}>{error}</div>}

                {loading ? (
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading student records...</p>
                ) : (
                    <div style={{ backgroundColor: '#121212', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#00FFFF', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                                    <th style={thStyle}>Name</th>
                                    <th style={thStyle}>Enrollment</th>
                                    <th style={thStyle}>University ID</th>
                                    <th style={thStyle}>Course</th>
                                    <th style={thStyle}>Batch</th>
                                    <th style={thStyle}>School</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.map((profile) => (
                                    <tr key={profile.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: '600' }}>{profile.full_name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{profile.email}</div>
                                        </td>
                                        <td style={tdStyle}>{profile.enrollment_number}</td>
                                        <td style={tdStyle}>{profile.university_id}</td>
                                        <td style={tdStyle}><span style={{ padding: '4px 10px', backgroundColor: 'rgba(0,255,255,0.1)', borderRadius: '4px', fontSize: '0.85rem' }}>{profile.course}</span></td>
                                        <td style={tdStyle}>{profile.batch}</td>
                                        <td style={tdStyle}>{profile.school}</td>
                                    </tr>
                                ))}
                                {profiles.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No student records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}

const thStyle: React.CSSProperties = {
    padding: '20px 24px',
    fontWeight: '700'
};

const tdStyle: React.CSSProperties = {
    padding: '20px 24px'
};
