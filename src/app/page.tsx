import Link from 'next/link';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#050505',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '50%',
        height: '50%',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
        zIndex: 0
      }} />

      <div style={{
        zIndex: 1,
        textAlign: 'center',
        maxWidth: '800px'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '900',
          letterSpacing: '-2px',
          marginBottom: '1rem',
          background: 'linear-gradient(90deg, #00FFFF, #A855F7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          NTCC Portal
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '2.5rem',
          lineHeight: '1.6'
        }}>
          Manage your academic journey. Submit internships, minor projects, and major projects for evaluation with ease.
        </p>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '4rem'
        }}>
          <Link href="/login" style={{
            padding: '12px 36px',
            backgroundColor: '#00FFFF',
            color: '#000',
            fontWeight: 'bold',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
          }}>
            Login
          </Link>
          <Link href="/register" style={{
            padding: '12px 36px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}>
            Register
          </Link>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          textAlign: 'left'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#00FFFF' }}>About NTCC</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', marginBottom: '1rem' }}>
            The Non-Teaching Credit Course (NTCC) portal is designed for students to streamline their project submissions.
          </p>
          <ul style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '2' }}>
            <li>✔ Secure submission tracking</li>
            <li>✔ Real-time evaluation feedback</li>
            <li>✔ Historical project access</li>
            <li>✔ Direct communication with evaluators</li>
          </ul>
        </div>
      </div>

      <footer style={{
        position: 'absolute',
        bottom: '20px',
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: '0.8rem'
      }}>
        © 2026 PIXEL NTCC Student Portal. Precision in Evaluation.
      </footer>
    </main>
  );
}
