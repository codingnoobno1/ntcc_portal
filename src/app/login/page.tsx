'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '400px',
                width: '100%',
                backgroundColor: '#121212',
                padding: '40px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center', letterSpacing: '1px' }}>
                    STUDENT <span style={{ color: '#00FFFF' }}>LOGIN</span>
                </h2>

                {error && <p style={{ color: '#ff4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input
                        type="text" placeholder="University ID" required
                        onChange={(e) => setFormData({ ...formData, university_id: e.target.value })}
                        style={inputStyle}
                    />
                    <input
                        type="password" placeholder="Password" required
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={inputStyle}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '10px',
                            padding: '14px',
                            backgroundColor: '#00FFFF',
                            color: '#000',
                            fontWeight: 'bold',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            transition: 'transform 0.2s',
                            boxShadow: '0 0 15px rgba(0,255,255,0.2)'
                        }}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                    Don't have an account? <Link href="/register" style={{ color: '#00FFFF', textDecoration: 'none' }}>Register</Link>
                </p>
            </div>
        </main>
    );
}

const inputStyle = {
    padding: '12px 16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none'
};
