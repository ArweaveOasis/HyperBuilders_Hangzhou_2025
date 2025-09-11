import React, { useEffect, useRef, useState } from 'react';
import { message as aoMessage, dryrun, createDataItemSigner } from '@permaweb/aoconnect';
import { useWallet } from "../hooks/WalletContext";
import { config } from "../config";

const THEME_YELLOW = '#F4E97A';
const THEME_WHITE = '#fff';

interface ChatItem {
    role: "user" | "assistant" | "tip";
    message: string;
    timestamp: number;
}

const DEFAULT_CHAT: ChatItem[] = [
    {
        role: "tip",
        message: "Hi, I'm Apus Assistant! Ask me anything below — let's get started!",
        timestamp: Date.now(),
    },
];

const pollForResult = async (reference: string): Promise<{ data: string; attestation?: any; reference?: string; status?: string }> => {
    try {
        const res = await dryrun({
            process: config.aoProcessId,
            tags: [
                { name: 'Action', value: 'GetInferResponse' },
                { name: 'X-Reference', value: reference },
            ],
        });

        const raw = res?.Messages?.[0]?.Data;
        let parsed: any;
        try {
            parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        } catch {
            parsed = raw;
        }

        // handle different structures: parse status and response first (response is a JSON string)
        const status = parsed?.status ?? 'success';
        if (status === 'processing') {
            await new Promise(resolve => setTimeout(resolve, 20000));
            return pollForResult(reference);
        }
        if (status === 'failed') {
            const msg = parsed?.error_message || 'Task failed';
            throw new Error(msg);
        }

        // parse inner response
        let inner: any = undefined;
        try {
            inner = parsed?.response
                ? (typeof parsed.response === 'string' ? JSON.parse(parsed.response) : parsed.response)
                : undefined;
        } catch {
            inner = undefined;
        }

        const resultText = (inner?.result ?? inner?.data ?? inner)
            ?? (parsed?.result ?? parsed?.data)
            ?? (typeof parsed === 'string' ? parsed : JSON.stringify(parsed));

        const attestation = inner?.attestation ?? parsed?.attestation;
        const resolvedRef = parsed?.reference ?? reference;

        return {
            data: typeof resultText === 'string' ? resultText : JSON.stringify(resultText),
            attestation,
            reference: resolvedRef,
            status: 'success',
        };
    } catch (error) {
        throw new Error('Failed to get result: ' + (error instanceof Error ? error.message : String(error)));
    }
};

export const ChatbotWidget: React.FC = () => {
    const [open, setOpen] = useState(false);

    const { checkLogin } = useWallet();
    const [chatHistory, setChatHistory] = useState<ChatItem[]>(DEFAULT_CHAT);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [requestReference, setRequestReference] = useState<string>('');
    const chatListRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if (!checkLogin()) return;
        if (!prompt.trim()) {
            return;
        }

        setLoading(true);
        try {

            // Unique reference for UX display (not required for aoconnect)
            const ref = Date.now().toString();
            setRequestReference(ref);

            setChatHistory((prev) => [
                ...prev,
                { role: "user", message: prompt, timestamp: Date.now() },
                { role: "tip", message: "Your question is sent. Please wait for the answer...", timestamp: Date.now() },
            ]);

            const currentPrompt = prompt;
            setPrompt("");

            // use browser wallet signer
            const signer = createDataItemSigner((window as any).arweaveWallet);

            // send request to AO process via aoconnect.message
            const mid = await aoMessage({
                process: config.aoProcessId,
                tags: [
                    { name: 'Action', value: 'Infer' },
                    { name: 'X-Reference', value: ref },
                ],
                data: currentPrompt,
                signer,
            });

            // use dryrun to query inference result by reference
            const aiReply = await pollForResult(ref);

            // Update chat history with AI response
            setChatHistory((prev) => [
                ...prev.slice(0, -1),
                { role: "assistant", message: aiReply.data || String(aiReply), timestamp: Date.now() }
            ]);

            // Update attestation if available
            if (aiReply.attestation) {
                // handle complex attestation structure
                let attestationData = aiReply.attestation;
                let attestationJWT = '';

                if (Array.isArray(attestationData) && attestationData.length > 0) {
                    for (const item of attestationData) {
                        if (Array.isArray(item) && item.length === 2 && item[0] === 'JWT') {
                            attestationJWT = item[1];
                            break;
                        }
                    }
                }

                const newAttestation = {
                    runtimeMeasurement: attestationJWT || JSON.stringify(attestationData),
                    tlsFingerprint: aiReply.reference || "N/A",
                    attestedBy: [...config.defaultAttestedBy]
                };
            }
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : "Failed to send message";
            setChatHistory((prev) => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (chatListRef.current) {
            chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                zIndex: 1000,
                fontFamily: 'Chalix, sans-serif',
            }}
        >
            {open ? (
                <div
                    style={{
                        width: 340,
                        height: 420,
                        background: THEME_WHITE,
                        borderRadius: 20,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        color: THEME_YELLOW,
                        border: `2px solid ${THEME_YELLOW}`,
                    }}
                >
                    <div
                        style={{
                            padding: '16px 20px',
                            borderBottom: `1px solid ${THEME_YELLOW}33`,
                            fontWeight: 700,
                            fontSize: 20,
                            letterSpacing: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: '#222',
                        }}
                    >
                        聊天机器人
                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: THEME_YELLOW,
                                fontSize: 22,
                                cursor: 'pointer',
                                marginLeft: 8,
                            }}
                            aria-label="关闭"
                        >
                            ×
                        </button>
                    </div>
                    <div style={{ flex: 1, padding: 20, overflowY: 'auto' }} ref={chatListRef}>
                        {chatHistory.map((item, idx) => (
                            <div key={idx} style={{
                                textAlign: item.role === "user" ? "right" : "left",
                                margin: "12px 0",
                                padding: "8px 0"
                            }}>
                                <div style={{
                                    display: "inline-block",
                                    maxWidth: "70%",
                                    padding: "12px 16px",
                                    borderRadius: item.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                    background: item.role === "user"
                                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                        : item.role === "tip"
                                            ? "#f0f0f0"
                                            : "#f8f9fa",
                                    color: item.role === "user" ? "white" : "#333",
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                    boxShadow: item.role === "user" ? "0 2px 8px rgba(102, 126, 234, 0.3)" : "0 1px 3px rgba(0,0,0,0.1)"
                                }}>
                                    {item.message}
                                </div>
                            </div>
                        ))}

                    </div>
                    <div style={{ padding: 16, borderTop: `1px solid ${THEME_YELLOW}33` }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                            <input
                                type="text"
                                placeholder="输入你的问题…"
                                style={{
                                    flex: 1,
                                    padding: '10px 12px',
                                    borderRadius: 8,
                                    border: `1.5px solid ${THEME_YELLOW}`,
                                    outline: 'none',
                                    fontSize: 15,
                                    background: '#fff',
                                    color: '#222',
                                    fontFamily: 'Chalix, sans-serif',
                                    transition: 'border 0.2s',
                                }}
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                onFocus={e => e.currentTarget.style.border = `2px solid ${THEME_YELLOW}`}
                                onBlur={e => e.currentTarget.style.border = `1.5px solid ${THEME_YELLOW}`}
                            />
                            <button
                                onClick={handleSend}
                                style={{
                                    background: THEME_YELLOW,
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 8,
                                    padding: '8px 16px',
                                    fontWeight: 600,
                                    fontSize: 15,
                                    cursor: 'pointer',
                                    fontFamily: 'Chalix, sans-serif',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                    transition: 'background 0.2s',
                                }}
                            >发送</button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    style={{
                        background: THEME_YELLOW,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: 64,
                        height: 64,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                        fontSize: 32,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    aria-label="打开聊天机器人"
                >
                    💬
                </button>
            )}
        </div>
    );
};
