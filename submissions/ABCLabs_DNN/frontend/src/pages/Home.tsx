import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../lib/id_api';
import node_api from '../lib/node_api';
import AddNodeModal from '../components/AddNodeModal';

type Product = {
  id: string;
  title: string;
  tagline?: string;
  votes?: number;
  tags?: string[];
  image?: string;
  description?: string;
};

// NOTE: In production these items should be loaded from AO / Arweave-backed indexing
// (e.g. AO events + Arweave metadata). The backend should expose `/api/products`
// which queries indexed AO/Arweave entries and returns an array of items with the
// shape used below. For now we provide richer sample data for UI demonstration.

const Home: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [dnnId, setDnnId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await node_api.getProducts();
        let payload = res.data;
        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
          if (Array.isArray((payload as any).data)) payload = (payload as any).data;
          else if (Array.isArray((payload as any).items)) payload = (payload as any).items;
          else payload = [];
        }
        setItems(Array.isArray(payload) ? payload : []);
      } catch (e) {
        // fallback demo dataset
        setItems([
          { id: 'p1', title: 'Chiang Mai Node', tagline: 'Lively digital nomad hub', votes: 124, tags: ['node','chiangmai','community'], description: 'Popular node with coworking spaces, events and local guides', image: 'https://resizeapi.com/resize-cgi/image/format=auto…ets/img/places/chiang-mai-thailand.jpg?1705449622' },
          { id: 'p2', title: 'Bangkok Node', tagline: 'City life + fast internet', votes: 98, tags: ['node','bangkok'], description: 'Centralized hub with many meetups and project collaborations', image: 'https://source.unsplash.com/800x600/?bangkok' },
          { id: 'p3', title: 'Sustainable Co-Living', tagline: 'Green living for nomads', votes: 64, tags: ['coliving','sustainability'], description: 'Eco-friendly co-living spaces integrated with local communities', image: 'https://source.unsplash.com/800x600/?coliving,cohousing' },
          { id: 'p4', title: 'Remote Work Workshop', tagline: 'Weekly skills and networking', votes: 47, tags: ['events','workshop'], description: 'Weekly workshop focused on remote collaboration tools and project pitching', image: 'https://source.unsplash.com/800x600/?workshop,meeting' },
          { id: 'p5', title: 'Arweave Storage Services', tagline: 'Permanent storage for events', votes: 22, tags: ['arweave','storage'], description: 'Services that help projects store metadata permanently on Arweave', image: 'https://source.unsplash.com/800x600/?blockchain,storage' },
        ]);
      }
    }
    load();
  }, []);

  useEffect(() => {
    try {
      const id = localStorage.getItem('dnnId');
      if (id) setDnnId(id);
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="page">
      <section className="hero">
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h1 style={{ fontSize: 28, margin: 0 }}>Recommended Nodes</h1>
    <div style={{ display: 'flex', gap: 8 }}>
      <button className="btn" onClick={() => setShowAdd(true)}>Add Node</button>
    </div>
  </div>
  {dnnId && <div style={{ marginTop: 8 }} className="muted">Logged in as: <code style={{ background:'rgba(255,255,255,0.02)', padding:6, borderRadius:6 }}>{dnnId}</code></div>}
        <p className="muted">Discover nodes, events and projects from the DNN network.</p>
      </section>

      <section className="grid-3">
  {items.map(p => <ProductCard key={p.id} product={p} />)}
      </section>
  {showAdd && <AddNodeModal onClose={() => setShowAdd(false)} onCreated={(n) => { setItems(prev => [n, ...prev]); }} />}
    </div>
  );
}

export default Home;