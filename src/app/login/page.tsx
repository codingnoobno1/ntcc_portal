'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        university_id: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            localStorage.setItem('ntcc_user', JSON.stringify(data.user));
            router.push('/dashboard');
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
                    maxWidth: '450px',
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
                        <span style={{ color: '#00FFFF', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Registered Students Only</span>
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1.5px', textTransform: 'uppercase', fontStyle: 'italic', margin: 0, lineHeight: 1 }}>
                        Student <span style={{ color: '#00FFFF', filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.3))' }}>Login</span>
                    </h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px', marginTop: '12px', fontWeight: '500' }}>Enter your University credentials</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '16px', borderRadius: '16px', fontSize: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%' }} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text" placeholder="University ID" required
                            onChange={(e) => setFormData({ ...formData, university_id: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="password" placeholder="Password" required
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={inputStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '10px',
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
                        {loading ? 'Authenticating...' : 'Sign In To Workspace'}
                    </button>
                </form>

                <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '12px', fontWeight: '500' }}>
                        Don't have an account? <Link href="/register" style={{ color: '#00FFFF', fontWeight: '700', marginLeft: '6px' }}>Register space</Link>
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
    boxSizing: 'border-box'
};
