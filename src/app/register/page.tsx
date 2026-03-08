'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        university_id: '',
        enrollment_number: '',
        email: '',
        password: '',
        batch: '',
        course: 'B.Tech CSE',
        school: 'Amity School of Engineering and Technology'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

            alert('Registration successful! Please login.');
            router.push('/login');
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
                maxWidth: '450px',
                width: '100%',
                backgroundColor: '#121212',
                padding: '40px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center', letterSpacing: '1px' }}>
                    CREATE <span style={{ color: '#00FFFF' }}>ACCOUNT</span>
                </h2>

                {error && <p style={{ color: '#ff4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text" placeholder="Full Name" required
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={inputStyle}
                    />
                    <input
                        type="text" placeholder="University ID" required
                        onChange={(e) => setFormData({ ...formData, university_id: e.target.value })}
                        style={inputStyle}
                    />
                    <input
                        type="text" placeholder="Enrollment Number" required
                        onChange={(e) => setFormData({ ...formData, enrollment_number: e.target.value })}
                        style={inputStyle}
                    />
                    <input
                        type="email" placeholder="Email Address" required
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={inputStyle}
                    />
                    <input
                        type="password" placeholder="Password" required
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={inputStyle}
                    />
                    <input
                        type="text" placeholder="Batch (e.g., 2023)" required
                        onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                        style={inputStyle}
                    />
                    <select
                        required
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        style={inputStyle}
                    >
                        <option value="B.Tech CSE">B.Tech CSE</option>
                        <option value="B.Sc Animation & Game Design">B.Sc Animation & Game Design</option>
                        <option value="B.Sc IT">B.Sc IT</option>
                        <option value="BCA">BCA</option>
                        <option value="MCA">MCA</option>
                        <option value="M.Tech">M.Tech</option>
                    </select>

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
                        {loading ? 'Processing...' : 'Register Now'}
                    </button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                    Already have an account? <Link href="/login" style={{ color: '#00FFFF', textDecoration: 'none' }}>Login</Link>
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
