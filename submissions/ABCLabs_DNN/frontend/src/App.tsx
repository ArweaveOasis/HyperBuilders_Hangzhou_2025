import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home, Register, Login, Verify } from './pages';
import './styles.css';

const App: React.FC = () => {
  const [dnnId, setDnnId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const id = localStorage.getItem('dnnId');
      if (id) setDnnId(id);
    } catch (e) {}
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="header-hero">
          <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="brand">
                <div className="brand-logo" />
                <Link to="/" style={{ color: 'var(--text)', textDecoration: 'none' }}>DNN</Link>
              </div>
              <nav>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/register" className="nav-link">Register</Link>
                <Link to="/login" className="nav-link">Login</Link>
              </nav>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {dnnId && (
                <>
                  <div className="muted">Logged in: <code style={{ background:'rgba(255,255,255,0.02)', padding:6, borderRadius:6 }}>{dnnId}</code></div>
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      try { localStorage.removeItem('dnnId'); } catch (e) {}
                      setDnnId(null);
                      // navigate back to home
                      window.location.href = '/';
                    }}
                  >Logout</button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<Verify />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;