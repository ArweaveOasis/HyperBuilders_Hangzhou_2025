import React, { useRef, useState, useEffect } from 'react';

type Props = {
  onDescriptor: (desc: number[] | null) => void;
};

export default function FaceCapture({ onDescriptor }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loadingModels, setLoadingModels] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [capturing, setCapturing] = useState(false);
  const [count, setCount] = useState(0);
  const capturesRef = useRef<number[][]>([]);

  useEffect(() => {
    return () => {
      // stop camera on unmount
      const v = videoRef.current;
      if (v && v.srcObject) {
        const s = v.srcObject as MediaStream;
        s.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  async function startCamera() {
    setStatus(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('Camera API not available');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (!videoRef.current) throw new Error('Video element not available');
      videoRef.current.srcObject = stream;
    } catch (err) {
      const msg = 'Camera access denied or not available: ' + String((err as any)?.message || err);
      setStatus(msg);
      // 弹窗提示用户
      alert(msg);
    }
  }
  async function loadModels() {
    setLoadingModels(true);
    setProgress(5);
    try {
      const faceapi = await import('face-api.js');
      const MODEL_URL = '/models';
      try {
        setProgress(10);
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setProgress(30);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        setProgress(50);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setProgress(70);
        setStatus(null);
      } catch (err) {
        // common failure: server returned HTML (index.html) instead of model JSON (Unexpected token '<')
        // try CDN fallback
        const CDN = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
        try {
          setProgress(20);
          await faceapi.nets.tinyFaceDetector.loadFromUri(CDN);
          setProgress(40);
          await faceapi.nets.faceLandmark68Net.loadFromUri(CDN);
          setProgress(60);
          await faceapi.nets.faceRecognitionNet.loadFromUri(CDN);
          setProgress(75);
          setStatus('Loaded models from CDN fallback');
        } catch (err2: any) {
          const msg = 'Failed to load models from /models and CDN: ' + String(err2?.message || err2);
          setStatus(msg);
          alert(msg);
        }
      }
    } catch (err: any) {
      const msg = 'Failed to load face-api library or models: ' + String(err.message || err);
      setStatus(msg);
      alert(msg);
    } finally {
      setLoadingModels(false);
      // if progress wasn't set to nearly complete, reset after short delay
      if (progress < 70) setProgress(0);
    }
  }

  async function detectOnce(): Promise<number[] | null> {
    try {
      const faceapi = await import('face-api.js');
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        const msg = 'Video or canvas element missing for detection';
        setStatus(msg);
        alert(msg);
        return null;
      }
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        const msg = 'Failed to get canvas context';
        setStatus(msg);
        alert(msg);
        return null;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setStatus('Detecting face...');
      setProgress(p => Math.max(p, 80));
      const det = await faceapi.detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      if (!det) {
        setStatus('No face detected in this frame');
        return null;
      }
      setStatus(null);
      return Array.from(det.descriptor as Float32Array);
    } catch (err) {
      const msg = 'Face detection failed: ' + String((err as any)?.message || err);
      setStatus(msg);
      alert(msg);
      return null;
    }
  }

  async function startEnrollment() {
    setCapturing(true);
    capturesRef.current = [];
    setCount(3);
    setProgress(5);
    await loadModels();
    for (let i = 3; i > 0; i--) {
      setCount(i);
      await new Promise(r => setTimeout(r, 800));
      setProgress(p => Math.min(90, (p || 30) + 10));
      const desc = await detectOnce();
      if (desc) capturesRef.current.push(desc);
    }
    // average descriptors
    if (capturesRef.current.length === 0) {
      setStatus('No face captured. Try again.');
      alert('No face captured. Try again.');
      onDescriptor(null);
      setProgress(0);
    } else {
      const len = capturesRef.current[0].length;
      const avg = new Array<number>(len).fill(0);
      capturesRef.current.forEach(arr => { for (let k = 0; k < len; k++) avg[k] += arr[k]; });
      for (let k = 0; k < len; k++) avg[k] = avg[k] / capturesRef.current.length;
      onDescriptor(avg);
      setStatus('Capture complete');
      setProgress(100);
    }
    setCapturing(false);
    setCount(0);
    // Reset progress after short delay to let UI reflect completion
    setTimeout(() => setProgress(0), 800);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <video ref={videoRef} autoPlay muted playsInline className="fc-video" />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={startCamera} disabled={capturing || progress > 0}>Enable Camera</button>
          <button className="btn-ghost" onClick={startEnrollment} disabled={capturing || loadingModels || progress > 0}>{capturing ? `Capturing ${count}` : 'Start Enrollment'}</button>
        </div>
        {/* simple progress bar */}
        {(loadingModels || capturing || progress > 0) && (
          <div style={{ width: '100%', marginTop: 8 }}>
            <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 6 }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#4ade80,#06b6d4)', borderRadius: 6, transition: 'width 200ms' }} />
            </div>
            <div className="muted" style={{ marginTop: 6 }}>{status || (progress > 0 ? `Progress: ${progress}%` : '')}</div>
          </div>
        )}
        {status && !(loadingModels || capturing) && <div className="muted" style={{ marginTop: 8 }}>{status}</div>}
      </div>
    </div>
  );
}
