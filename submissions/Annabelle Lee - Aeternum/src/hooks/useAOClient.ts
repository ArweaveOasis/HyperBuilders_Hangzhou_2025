import { useCallback, useRef, useState } from 'react';
import { config } from '../config';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function useAOClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const pending = useRef<boolean>(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || pending.current) return;
    pending.current = true;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Minimal example: POST to APUS node which forwards to AO process
      const res = await fetch(`${config.apusHyperbeamNodeUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processId: config.aoProcessId, input: content })
      });

      if (!res.ok) throw new Error(`AO error ${res.status}`);
      const data = await res.json();
      const replyText = data?.reply ?? JSON.stringify(data);

      const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: replyText };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: `Error: ${err.message}` };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      pending.current = false;
    }
  }, []);

  return { messages, sendMessage };
}
