declare global {
  interface Window {
    wanderWallet?: any;
  }
}

export {};
// Global type declarations for non-TS imports used in the frontend
// This lets TypeScript accept imports like `import './styles.css'` and static assets.

declare module '*.css';
declare module '*.scss';
declare module '*.less';

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
