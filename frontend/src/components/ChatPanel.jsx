import { useState, useRef, useEffect } from 'react';
import VoiceButton from './VoiceButton';

const SUGGESTED_QUERIES = [
  'Monthly revenue trend',
  'Sales by category',
  'Most profitable region',
  'Q4 performance spike',
  'Profit vs Sales by state',
  'Top 10 sub-categories'
];

export default function ChatPanel({ messages, onSendMessage, isLoading }) {
  const [input, setInput] = useState('');
  const [voiceStatus, setVoiceStatus] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    setVoiceStatus(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceTranscript = (transcript, isFinal) => {
    if (transcript === '__MIC_DENIED__') {
      // Mic permission denied — show as a system message
      setVoiceStatus('denied');
      return;
    }
    setInput(transcript);
    if (isFinal) {
      setVoiceStatus(null);
      onSendMessage(transcript);
      setTimeout(() => setInput(''), 100);
    } else {
      setVoiceStatus('listening');
    }
  };

  const showSuggestions = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-dt-bg-primary">
      {/* Chat header */}
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h2 className="text-sm font-sora font-semibold text-dt-text-primary flex items-center gap-2">
          <svg className="w-4 h-4 text-dt-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
          </svg>
          Chat
        </h2>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {showSuggestions && (
          <div className="space-y-3">
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-dt-accent-cyan/20 to-dt-accent-green/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-dt-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </div>
              <h3 className="text-base font-sora font-semibold text-dt-text-primary mb-1">
                Ask anything about your data
              </h3>
              <p className="text-xs text-dt-text-muted">
                I'll generate SQL, run it, and visualize the results
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); onSendMessage(q); }}
                  className="px-3 py-1.5 text-xs rounded-full border border-white/10 text-dt-text-muted
                    hover:border-dt-accent-cyan/40 hover:text-dt-accent-cyan hover:bg-dt-accent-cyan/5
                    transition-all duration-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-dt-accent-cyan/20 to-dt-accent-green/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-dt-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </div>
            <div className="glass-card px-4 py-3 max-w-[85%]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-dt-accent-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-dt-accent-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-dt-accent-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {voiceStatus === 'denied' && (
          <div className="glass-card px-4 py-3 text-xs text-red-400/80 border-red-500/20">
            🎤 Microphone access denied. Please type your question instead.
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice status indicator */}
      {voiceStatus === 'listening' && (
        <div className="px-5 py-1.5 text-center">
          <span className="text-xs text-red-400 animate-pulse font-mono">
            ● Listening... speak now
          </span>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 border-t border-white/[0.06]">
        <div className="flex gap-2 items-center glass-card px-3 py-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your data..."
            className="flex-1 bg-transparent text-sm text-dt-text-primary placeholder:text-dt-text-muted/50
              outline-none font-inter"
            disabled={isLoading}
          />

          <VoiceButton
            onTranscript={handleVoiceTranscript}
            disabled={isLoading}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed
              bg-gradient-to-r from-dt-accent-cyan to-dt-accent-green/80
              hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]
              text-dt-bg-primary"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const [showSql, setShowSql] = useState(false);
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isUser
          ? 'bg-gradient-to-br from-dt-accent-cyan/30 to-dt-accent-cyan/10'
          : 'bg-gradient-to-br from-dt-accent-cyan/20 to-dt-accent-green/10'
      }`}>
        {isUser ? (
          <svg className="w-3.5 h-3.5 text-dt-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-dt-accent-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[85%] ${
        isUser
          ? 'bg-dt-accent-cyan/10 border border-dt-accent-cyan/20 rounded-2xl rounded-tr-md px-4 py-2.5'
          : `glass-card rounded-2xl rounded-tl-md px-4 py-2.5 ${message.isError ? 'border-red-500/20' : ''}`
      }`}>
        <p className={`text-sm leading-relaxed ${
          message.isError ? 'text-red-400/90' : 'text-dt-text-primary/90'
        }`}>
          {message.content}
        </p>

        {/* SQL query toggle */}
        {message.sql_query && (
          <div className="mt-2 pt-2 border-t border-white/[0.04]">
            <button
              onClick={() => setShowSql(!showSql)}
              className="text-[10px] text-dt-text-muted hover:text-dt-accent-cyan transition-colors flex items-center gap-1"
            >
              <svg className={`w-3 h-3 transition-transform ${showSql ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
              {showSql ? 'Hide' : 'Show'} SQL query
            </button>
            {showSql && (
              <pre className="mt-2 text-[10px] font-mono text-dt-accent-cyan/70 bg-black/20 rounded-lg p-2.5 overflow-x-auto whitespace-pre-wrap">
                {message.sql_query}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
