import React, { useState } from 'react';
import { genBioHash } from '../utils/crypto';

const Verify: React.FC = () => {
  const [name, setName] = useState('');
  const [bioSample, setBioSample] = useState('');
  const [challenge, setChallenge] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const bioHash = await genBioHash(bioSample || name || String(Date.now()));
    const res = await fetch('/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({bioHash, challenge }) });
    const j = await res.json();
    if (j.success) {
      localStorage.setItem('dnn_token', j.data.token);
      setMsg('Verified and token stored');
    } else setMsg('Error: ' + (j.error || 'unknown'));
  }

  return (
    <div className="page">
      <div className="card form-card">
        <h2 style={{ marginTop: 0 }}>Verify your identity</h2>
        <p className="muted">Provide your challenge and bio sample to receive a session token.</p>
        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <input placeholder="Display name" value={name} onChange={e => setName(e.target.value)} className="input" />
          <input placeholder="Challenge (from login)" value={challenge} onChange={e => setChallenge(e.target.value)} className="input" style={{ marginTop: 8 }} />
          <textarea placeholder="Bio sample" value={bioSample} onChange={e => setBioSample(e.target.value)} className="textarea" style={{ marginTop: 8 }} />
          <div style={{ marginTop: 12 }}>
            <button className="btn">Verify</button>
          </div>
          {msg && <div style={{ marginTop: 8 }} className="muted">{msg}</div>}
        </form>
      </div>
    </div>
  );
}

export default Verify;
