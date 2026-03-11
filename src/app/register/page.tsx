'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function Register() {
    const router = useRouter();
    const [batches, setBatches] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        university_id: '',
        enrollment_number: '',
        email: '',
        password: '',
        batch_id: '',
        section: '',
        current_semester: 1 as number,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBatches = async () => {
            const { data, error } = await supabase.from('batches').select('*');
            if (data) setBatches(data);
        };
        fetchBatches();
    }, []);

    useEffect(() => {
        if (formData.batch_id) {
            const batch = batches.find(b => b.id === formData.batch_id);
            if (batch) {
                const admissionYear = Number(batch.start_year);
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth() + 1; // 1-12

                // Simple Logic: 
                // yearsDifference = currentYear - admissionYear
                // July-Dec (Month > 6) -> Odd Semester: (yearsDiff * 2) + 1
                // Jan-June (Month <= 6) -> Even Semester: (yearsDiff * 2)

                const yearsDiff = currentYear - admissionYear;
                let sem = (yearsDiff * 2);

                if (currentMonth > 6) {
                    sem += 1;
                }

                const finalSem = Math.max(1, sem);

                console.log(`[Semester Calc] Batch: ${batch.name}, Admit: ${admissionYear}, Now: ${currentMonth}/${currentYear}, Calculated: ${finalSem}`);
                setFormData(prev => ({ ...prev, current_semester: finalSem }));
            }
        }
    }, [formData.batch_id, batches]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');

            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            minHeight: '100vh',
            backgroundColor: '#050505',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: "'Inter', sans-serif",
            background: 'radial-gradient(circle at center, #111 0%, #050505 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative Orbs */}
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'rgba(0, 255, 255, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'rgba(168, 85, 247, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    maxWidth: '550px',
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(24px)',
                    padding: '48px',
                    borderRadius: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(0, 255, 255, 0.08)', border: '1px solid rgba(0, 255, 255, 0.15)', borderRadius: '100px', marginBottom: '16px' }}>
                        <span style={{ color: '#00FFFF', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Academic Session 2024-25</span>
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1.5px', textTransform: 'uppercase', fontStyle: 'italic', margin: 0, lineHeight: 1 }}>
                        Student <span style={{ color: '#00FFFF', filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.3))' }}>Registration</span>
                    </h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px', marginTop: '12px', fontWeight: '500' }}>Create your secure workspace account</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '16px', borderRadius: '16px', fontSize: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%' }} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <input type="text" placeholder="Full Name" required style={inputStyle} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <input type="email" placeholder="Email" required style={inputStyle} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <input type="text" placeholder="University ID" required style={inputStyle} onChange={(e) => setFormData({ ...formData, university_id: e.target.value })} />
                        <input type="text" placeholder="Enrollment No" required style={inputStyle} onChange={(e) => setFormData({ ...formData, enrollment_number: e.target.value })} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <select
                                required
                                style={{ ...inputStyle, width: '100%', cursor: 'pointer', appearance: 'none' }}
                                value={formData.batch_id}
                                onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
                            >
                                <option value="" style={{ background: '#121212' }}>Select Batch</option>
                                {batches.map(b => (
                                    <option key={b.id} value={b.id} style={{ background: '#121212' }}>{b.name}</option>
                                ))}
                            </select>
                            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(255, 255, 255, 0.2)' }}>
                                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                        <input type="text" placeholder="Section (e.g. A)" required style={inputStyle} onChange={(e) => setFormData({ ...formData, section: e.target.value })} />
                    </div>

                    <input type="password" placeholder="Choose a Secure Password" required style={inputStyle} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

                    {formData.batch_id && (
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ padding: '8px', background: 'rgba(0, 255, 255, 0.08)', borderRadius: '8px' }}>
                                    <svg style={{ width: '14px', height: '14px', color: '#00FFFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                </div>
                                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>Detected Semester</span>
                            </div>
                            <span style={{ color: '#00FFFF', fontWeight: '900', fontStyle: 'italic', fontSize: '18px' }}>SEM {formData.current_semester}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '24px',
                            padding: '18px',
                            backgroundColor: '#00FFFF',
                            color: '#000',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '-0.5px',
                            border: 'none',
                            borderRadius: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.2s ease',
                            boxShadow: '0 15px 30px -10px rgba(0, 255, 255, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        {loading && <svg style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24"><circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {loading ? 'Processing...' : 'Complete Registration'}
                    </button>
                </form>

                <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '12px', fontWeight: '500' }}>
                        Already registered? <Link href="/login" style={{ color: '#00FFFF', fontWeight: '700', marginLeft: '6px' }}>Sign in here</Link>
                    </p>
                </div>
            </motion.div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                input::placeholder { color: rgba(255, 255, 255, 0.15); }
                input:focus { border-color: rgba(0, 255, 255, 0.5) !important; background: rgba(255, 255, 255, 0.06) !important; outline: none; }
            `}</style>
        </main>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
};
