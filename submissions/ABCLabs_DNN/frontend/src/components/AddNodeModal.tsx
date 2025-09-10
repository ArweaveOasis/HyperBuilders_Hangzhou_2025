import React, { useState, useCallback } from 'react';
import Modal from './Modal';
import node_api, { DNN_Node } from '../lib/node_api';

export default function AddNodeModal({ onClose, onCreated }: { onClose: () => void; onCreated: (n: any) => void }) {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [votes, setVotes] = useState<number>(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFile = useCallback((file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setImagePreview(data);
      // strip prefix and keep raw base64 to send to backend
      const idx = data.indexOf('base64,');
      const raw = idx >= 0 ? data.substring(idx + 7) : data;
      setBase64Image(raw);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
  };

  const handleChoose = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) onFile(f);
  };

  const submit = async () => {
    if (!title) return alert('Title required');
    setLoading(true);
    try {
      const node: DNN_Node = {
        id: id || `node-${Date.now()}`,
        title,
        tagline,
        votes: Number.isFinite(votes) ? votes : 0,
        // send raw base64 string to backend (without data: prefix)
        image: base64Image || imagePreview || '',
      };
      const created = await node_api.createNode(node as any);
      // prefer server-returned payload, but fallback to our local node with data-url for preview
      const out = created || { ...node, image: imagePreview || (base64Image ? `data:image/png;base64,${base64Image}` : '') };
      onCreated(out);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to create node');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ width: 640 }}>
        <div style={{ height: 6, borderRadius: 6, marginBottom: 12, background: 'linear-gradient(90deg, var(--accent-gradient-start), var(--accent-gradient-end))' }} />
        <h3 style={{ marginTop: 0 }}>Add Node</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <label>
            ID (optional)
            <input className="input" value={id} onChange={e => setId(e.target.value)} placeholder="auto-generated if empty" />
          </label>
          <label>
            Title
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Chiang Mai Node" />
          </label>
          <label>
            Tagline
            <input className="input" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Short tagline" />
          </label>
          <label>
            Votes
            <input className="input" type="number" value={votes} onChange={e => setVotes(Number(e.target.value))} />
          </label>

          <div>
            <div style={{ marginBottom: 6 }}>Image (drag & drop or choose file). Will be encoded and sent to backend.</div>
            <div className="dropzone" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
              {imagePreview ? (
                <img src={imagePreview} alt="preview" />
              ) : (
                <div style={{ color: 'var(--muted)' }}>Drop image here or <label style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}><input type="file" accept="image/*" onChange={handleChoose} style={{ display: 'none' }} />choose file</label></div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button className="btn" onClick={submit} disabled={loading}>{loading ? 'Saving...' : 'Create Node'}</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
