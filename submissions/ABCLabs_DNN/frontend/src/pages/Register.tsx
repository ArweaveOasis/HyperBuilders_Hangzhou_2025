import React, { useState } from 'react';
import { genBioHash } from '../utils/crypto';
// FaceCapture enrollment removed for simple biosample fallback
import api from '../lib/id_api';

const Register: React.FC = () => {
  const [bioSample, setBioSample] = useState('');
  const [descriptor, setDescriptor] = useState<number[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [showEnroll, setShowEnroll] = useState(false);
  const [dnnId, setDnnId] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
  // send biosample string to backend to generate dnnId
  const payload: any = { bioSample: bioSample  };
  console.log('Register submit payload', { hasDescriptor: !!descriptor, bioSamplePreview: String(payload.bioSample).slice(0, 8) });
    try {
      const j = await api.register(payload as any);
      if (j && j.success) {
        setDnnId(j.data?.dnnId || null);
        try { if (j.data?.dnnId) localStorage.setItem('dnnId', j.data.dnnId); } catch (e) {}
        setMsg('Registered — dnnId received');
      } else {
        setMsg(`Error: ${j && j.error}`);
      }
    } catch (err: any) {
      setMsg('Error: ' + (err.message || String(err)));
    }
  }

  return (
    <>
      <div className="page">
        <div className="card form-card">
          <h2 style={{ marginTop: 0 }}>Create your DNN account</h2>
          <p className="muted">Store a BioHash for passwordless authentication.</p>
          <form onSubmit={submit} style={{ marginTop: 12 }} className="space-y-3">
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexDirection: 'column' }}>
              <input placeholder="Enter bioSample (string)" value={bioSample} onChange={e => setBioSample(e.target.value)} className="input" />
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn-ghost">Register</button>
              </div>
              {dnnId && <div className="muted">DNN-ID: <code style={{ background:'rgba(255,255,255,0.02)', padding:6, borderRadius:6 }}>{dnnId}</code></div>}
            </div>
            {msg && <div className="muted">{msg}</div>}
          </form>
        </div>
      </div>

  {/* Face enrollment UI removed - using biosample text input instead */}
    </>
  );
}

export default Register;
