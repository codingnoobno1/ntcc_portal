'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'results'>('overview');
    const [stages, setStages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('ntcc_user');
        if (!savedUser) {
            router.push('/login');
        } else {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            fetchStages(parsedUser.program_id);
        }
    }, [router]);

    const fetchStages = async (programId: string) => {
        try {
            const res = await fetch(`/api/stages?program_id=${programId}`);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || errorData.message || "Failed to fetch");
            }
            const data = await res.json();
            setStages(data);
        } catch (err: any) {
            console.error("Failed to fetch stages:", err);
            // Optionally set an error state to show in UI
        } finally {
            setLoading(false);
        }
    };

    if (!user || loading) return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '40px', height: '40px', border: '4px solid #00FFFF', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
    );

    // Simplified Semester Logic
    const admissionYear = (() => {
        const yearRegex = /\d{4}/;
        if (user.batch_name) {
            const match = user.batch_name.match(yearRegex);
            if (match) return parseInt(match[0]);
        }
        if (user.enrollment_year) {
            const parsed = parseInt(user.enrollment_year);
            if (!isNaN(parsed)) return parsed;
        }
        return new Date().getFullYear();
    })();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const yearsDiff = currentYear - admissionYear;
    const displaySemester = Math.max(1, (yearsDiff * 2) + (currentMonth > 6 ? 1 : 0));

    return (
        <div style={containerStyle}>
            {/* Sidebar */}
            <aside style={sidebarStyle}>
                <div style={{ padding: '32px' }}>
                    <div style={logoStyle}>NTCC<span style={{ color: '#00FFFF' }}>.</span>PORTAL</div>
                </div>

                <nav style={{ padding: '0 16px', flex: 1 }}>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 16px 12px' }}>Workspace</div>
                    <NavItem icon="📊" label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <NavItem icon="📤" label="Submissions" active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')} />
                    <NavItem icon="📜" label="Results" active={activeTab === 'results'} onClick={() => setActiveTab('results')} />
                </nav>

                <div style={{ padding: '32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={() => { localStorage.removeItem('ntcc_user'); router.push('/login'); }} style={logoutBtnStyle}>
                        <span>Sign Out</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={mainContentStyle}>
                <header style={headerStyle}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.5px' }}>Good morning, {user.name.split(' ')[0]}!</h1>
                        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                            ID: {user.university_id} • Roll: {user.enrollment_number} • Sec {user.section}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: '#000', textTransform: 'uppercase' }}>Semester {displaySemester}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>Batch: {user.batch_name || 'Academic Year'}</div>
                        </div>
                        <div style={profileCircleStyle}>{user.name[0]}</div>
                    </div>
                </header>

                <div style={{ padding: '40px', overflowY: 'auto', flex: 1 }}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                    <h3 style={sectionTitleStyle}>Academic Roadmap</h3>
                                    <div style={programBadgeStyle}>{user.program_id || 'B.Tech CS'}</div>
                                </div>
                                <div style={statsGridStyle}>
                                    {stages.length > 0 ? (
                                        stages.map((stage, i) => (
                                            <CourseCard key={stage.id} stage={stage} index={i} currentSem={displaySemester} />
                                        ))
                                    ) : (
                                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '24px' }}>
                                            <p style={{ color: '#64748b' }}>No academic stages mapped for your program yet.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'submissions' && <SubmissionPlaceholder />}
                        {activeTab === 'results' && <ResultPlaceholder />}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) {
    return (
        <button onClick={onClick} style={active ? activeNavItemStyle : navItemStyle}>
            <span style={{ fontSize: '18px' }}>{icon}</span>
            <span style={{ fontWeight: active ? '700' : '500' }}>{label}</span>
            {active && <motion.div layoutId="activeNav" style={activeNavIndicatorStyle as any} />}
        </button>
    );
}

function CourseCard({ stage, index, currentSem }: { stage: any, index: number, currentSem: number }) {
    const isOngoing = stage.status === 'ongoing';
    const isCurrent = stage.semester_number === currentSem;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            style={{ ...courseCardStyle, borderTop: isCurrent ? '4px solid #00FFFF' : '1px solid #e2e8f0' } as any}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={semesterBadgeStyle}>SEM {stage.semester_number}</span>
                <span style={{ ...statusBadgeStyle, color: isOngoing ? '#0ea5e9' : '#64748b', backgroundColor: isOngoing ? '#f0f9ff' : '#f1f5f9' }}>
                    {stage.status.toUpperCase()}
                </span>
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>{stage.stage_name}</h4>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                {stage.description || "Project-based learning module focusing on research, industry standards, and technical implementation."}
            </p>
            <button style={{ ...actionBtnStyle, opacity: isOngoing ? 1 : 0.6 }}>
                {isOngoing ? 'Enter Module' : 'Access Closed'}
            </button>
        </motion.div>
    );
}

function SubmissionPlaceholder() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '100px 0' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b' }}>Submissions Dashboard</h2>
            <p style={{ color: '#64748b', marginTop: '12px' }}>Select an ongoing module from overview to start submitting reports.</p>
        </motion.div>
    );
}

function ResultPlaceholder() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '100px 0' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b' }}>Evaluation History</h2>
            <p style={{ color: '#64748b', marginTop: '12px' }}>Your graded projects and faculty feedback will appear here.</p>
        </motion.div>
    );
}

// --- Styles ---
const containerStyle: React.CSSProperties = { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' };
const sidebarStyle: React.CSSProperties = { width: '280px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' };
const logoStyle: React.CSSProperties = { fontSize: '20px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' };
const navItemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', color: 'rgba(255,255,255,0.6)', border: 'none', background: 'none', cursor: 'pointer', width: '100%', borderRadius: '12px', transition: 'all 0.2s', position: 'relative', fontSize: '14px' };
const activeNavItemStyle: React.CSSProperties = { ...navItemStyle, color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)' };
const activeNavIndicatorStyle: React.CSSProperties = { position: 'absolute', left: 0, top: '25%', bottom: '25%', width: '4px', backgroundColor: '#00FFFF', borderRadius: '0 4px 4px 0' };
const logoutBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' };
const mainContentStyle: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' };
const headerStyle: React.CSSProperties = { backgroundColor: '#fff', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' };
const profileCircleStyle: React.CSSProperties = { width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #00FFFF 0%, #0ea5e9 100%)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px' };
const sectionTitleStyle: React.CSSProperties = { fontSize: '18px', fontWeight: '900', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 };
const statsGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' };
const courseCardStyle: React.CSSProperties = { backgroundColor: '#fff', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', height: '100%' };
const semesterBadgeStyle: React.CSSProperties = { padding: '4px 8px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '6px', fontSize: '10px', fontWeight: '800' };
const statusBadgeStyle: React.CSSProperties = { padding: '4px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: '900' };
const actionBtnStyle: React.CSSProperties = { marginTop: 'auto', padding: '12px', backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' };
const programBadgeStyle: React.CSSProperties = { padding: '6px 12px', backgroundColor: 'rgba(0, 255, 255, 0.1)', color: '#008b8b', borderRadius: '8px', fontSize: '11px', fontWeight: '800', border: '1px solid rgba(0, 255, 255, 0.2)' };
