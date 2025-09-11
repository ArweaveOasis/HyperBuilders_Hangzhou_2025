import React, { useState } from 'react';
import { Button } from './ui/button';
import { useAOClient } from '../hooks/useAOClient';

export const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useAOClient();

  const accent = '#F4E97A';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-auto">
      {open ? (
        <div className="w-[340px] h-[520px] rounded-xl shadow-xl border overflow-hidden flex flex-col"
             style={{ backgroundColor: 'white' }}>
          <div className="flex items-center justify-between px-3 py-2 border-b"
               style={{ backgroundColor: accent }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#f8c38a' }} />
              <span className="text-sm font-medium text-black">AO Chat</span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-black" onClick={() => setOpen(false)}>
              ✕
            </Button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-white space-y-2">
            {messages.length === 0 && (
              <div className="text-sm text-black rounded-xl px-3 py-2 inline-block"
                   style={{ backgroundColor: accent }}>
                How can we help?
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span
                  className={`inline-block px-3 py-2 rounded-xl text-sm ${m.role === 'user' ? 'bg-black text-white' : 'text-black'}`}
                  style={m.role === 'assistant' ? { backgroundColor: accent } : undefined}
                >
                  {m.content}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 border-t bg-white">
            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <input
                className="flex-1 text-sm px-3 py-2 border rounded-md focus:outline-none"
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <Button style={{ backgroundColor: accent, color: '#000' }} type="submit" className="px-4">
                Send
              </Button>
            </form>
            <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
              <span>Powered by</span>
              <span className="font-semibold">AO</span>
            </div>
          </div>
        </div>
      ) : (
        <Button
          className="rounded-full shadow-lg flex items-center gap-2"
          style={{ backgroundColor: accent, color: '#000' }}
          onClick={() => setOpen(true)}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-black" />
          Chat
        </Button>
      )}
    </div>
  );
};
