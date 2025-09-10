import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/id_api';

const Login: React.FC = () => {
  const [bioSample, setBioSample] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [dnnId, setDnnId] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!bioSample) {
      setMsg('Please enter your bio sample');
      return;
    }
    setMsg('Processing...');
    try {
      // Try login first
      const j = await api.login(bioSample);
      if (j && j.success && j.data?.dnnId) {
  setDnnId(j.data.dnnId);
  try { localStorage.setItem('dnnId', j.data.dnnId); } catch (e) {}
  setMsg('Login successful — DNN-ID found');
  navigate('/');
  return;
      }

      // Not found — auto-register using same bioSample
      const r = await api.register({ bioSample });
      if (r && r.success) {
  setDnnId(r.data?.dnnId || null);
  try { if (r.data?.dnnId) localStorage.setItem('dnnId', r.data.dnnId); } catch (e) {}
  setMsg('Registered and logged in — DNN-ID received');
  navigate('/');
      } else {
        setMsg(`Error: ${r && r.error}`);
      }
    } catch (err: any) {
      setMsg('Error: ' + (err.message || String(err)));
    }
  }

  return (
    <div className="page">
      <div className="card form-card">
        <h2 style={{ marginTop: 0 }}>Login / Register</h2>
        <p className="muted">Enter your bio sample string to login or register.</p>
        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <input placeholder="Enter bioSample (string)" value={bioSample} onChange={e => setBioSample(e.target.value)} className="input" />
          <div style={{ marginTop: 12 }}>
            <button className="btn">Submit</button>
          </div>
          {dnnId && <div style={{ marginTop: 8 }} className="muted">DNN-ID: <code style={{ background:'rgba(255,255,255,0.02)', padding:6, borderRadius:6 }}>{dnnId}</code></div>}
          {msg && <div style={{ marginTop: 8 }} className="muted">{msg}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;
