'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'progress' | 'submissions' | 'results'>('progress');

    useEffect(() => {
        const savedUser = localStorage.getItem('ntcc_user');
        if (!savedUser) {
            router.push('/login');
        } else {
            setUser(JSON.parse(savedUser));
        }
    }, [router]);

    if (!user) return <div style={{ color: '#fff', textAlign: 'center', padding: '100px' }}>Loading Portal...</div>;

    return (
        <div style={containerStyle}>
            {/* Sidebar */}
            <nav style={sidebarStyle}>
                <h2 style={logoStyle}>NTCC PORTAL</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '40px' }}>
                    <button onClick={() => setActiveTab('progress')} style={activeTab === 'progress' ? activeBtnStyle : btnStyle}>My Progress</button>
                    <button onClick={() => setActiveTab('submissions')} style={activeTab === 'submissions' ? activeBtnStyle : btnStyle}>Submissions</button>
                    <button onClick={() => setActiveTab('results')} style={activeTab === 'results' ? activeBtnStyle : btnStyle}>Results</button>
                </div>
                <button
                    onClick={() => { localStorage.removeItem('ntcc_user'); router.push('/login'); }}
                    style={{ ...btnStyle, marginTop: 'auto', color: '#ff4444' }}
                >
                    Logout
                </button>
            </nav>

            {/* Main Content */}
            <main style={mainStyle}>
                <header style={headerStyle}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Welcome, {user.name}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{user.department} | Batch: {user.batch}</p>
                    </div>
                    <div style={profileCircleStyle}>{user.name[0]}</div>
                </header>

                <section style={contentStyle}>
                    {activeTab === 'progress' && <ProgressSection />}
                    {activeTab === 'submissions' && <SubmissionsSection studentId={user.university_id} />}
                    {activeTab === 'results' && <ResultsSection studentId={user.university_id} />}
                </section>
            </main>
        </div>
    );
}

// --- Sections ---

function ProgressSection() {
    const steps = [
        { name: 'Sem 5 Internship', status: 'COMPLETED', color: '#00FF00' },
        { name: 'Minor Project', status: 'COMPLETED', color: '#00FF00' },
        { name: 'Major Project', status: 'IN_PROGRESS', color: '#FFFF00' },
        { name: 'Final Internship', status: 'PENDING', color: 'rgba(255,255,255,0.2)' }
    ];

    return (
        <div>
            <h3 style={sectionTitleStyle}>Academic Stage</h3>
            <div style={cardGridStyle}>
                {steps.map((step, i) => (
                    <div key={i} style={cardStyle}>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Step {i + 1}</p>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>{step.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: step.status === 'COMPLETED' ? '1.2rem' : '1rem' }}>{step.status === 'COMPLETED' ? '✔' : '⏳'}</span>
                            <span style={{ color: step.color, fontWeight: 'bold', fontSize: '0.8rem' }}>{step.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SubmissionsSection({ studentId }: { studentId: string }) {
    return (
        <div style={{ maxWidth: '600px' }}>
            <h3 style={sectionTitleStyle}>Upload Project Report</h3>
            <form style={formStyle} onSubmit={(e) => { e.preventDefault(); alert('File upload simulated successfully!'); }}>
                <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Project Title</label>
                    <input type="text" placeholder="Enter project title" style={inputDashboardStyle} required />
                </div>
                <div style={fieldGroupStyle}>
                    <label style={labelStyle}>Type</label>
                    <select style={inputDashboardStyle} required>
                        <option value="internship">Internship Report</option>
                        <option value="minor">Minor Project</option>
                        <option value="major">Major Project</option>
                    </select>
                </div>
                <div style={fieldGroupStyle}>
                    <label style={labelStyle}>File (PDF/DOCX)</label>
                    <input type="file" style={fileInputStyle} required />
                </div>
                <button type="submit" style={submitBtnStyle}>Submit for Evaluation</button>
            </form>
        </div>
    );
}

function ResultsSection({ studentId }: { studentId: string }) {
    const results = [
        { title: 'Minor Project', score: 82, evaluator: 'Prof. Sharma', comment: 'Good implementation and documentation.' },
        { title: 'Sem 5 Internship', score: 90, evaluator: 'Dr. Verma', comment: 'Excellent industry exposure report.' }
    ];

    return (
        <div>
            <h3 style={sectionTitleStyle}>Evaluation Results</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {results.map((res, i) => (
                    <div key={i} style={resultCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <h4 style={{ color: '#00FFFF' }}>{res.title}</h4>
                            <span style={scoreBadgeStyle}>{res.score}/100</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>"{res.comment}"</p>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Evaluator: {res.evaluator}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Styles ---

const containerStyle: any = { display: 'flex', minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: "'Inter', sans-serif" };
const sidebarStyle: any = { width: '260px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '30px', display: 'flex', flexDirection: 'column' };
const mainStyle: any = { flex: 1, padding: '40px', overflowY: 'auto' };
const logoStyle: any = { fontSize: '1.2rem', fontWeight: '900', letterSpacing: '2px', color: '#00FFFF' };
const btnStyle: any = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', padding: '12px 15px', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s', fontSize: '0.95rem' };
const activeBtnStyle: any = { ...btnStyle, backgroundColor: 'rgba(0, 255, 255, 0.1)', color: '#00FFFF', fontWeight: 'bold' };
const headerStyle: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const profileCircleStyle: any = { width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#00FFFF', color: '#000', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold', fontSize: '1.2rem', justifyContent: 'center' };
const contentStyle: any = {};
const sectionTitleStyle: any = { fontSize: '1.4rem', fontWeight: '800', marginBottom: '25px', color: '#fff' };
const cardGridStyle: any = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' };
const cardStyle: any = { padding: '25px', backgroundColor: '#121212', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' };
const resultCardStyle: any = { padding: '20px', backgroundColor: '#121212', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' };
const scoreBadgeStyle: any = { padding: '4px 10px', backgroundColor: 'rgba(0, 255, 0, 0.1)', color: '#00FF00', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' };
const formStyle: any = { backgroundColor: '#121212', padding: '30px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' };
const fieldGroupStyle: any = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle: any = { fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' };
const inputDashboardStyle: any = { padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', outline: 'none' };
const fileInputStyle: any = { ...inputDashboardStyle, padding: '10px' };
const submitBtnStyle: any = { padding: '14px', backgroundColor: '#00FFFF', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' };
