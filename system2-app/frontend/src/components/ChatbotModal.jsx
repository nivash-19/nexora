import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Key,
  Trash2,
  Minimize2,
  Maximize2,
  HelpCircle,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { ENDPOINTS } from '../config/api';

const QUICK_PROMPTS = [
  "Why are living green roofs recommended for Manali?",
  "What is the cost breakdown of Tier 1 solutions?",
  "Why use a 250m x 250m grid instead of ward averages?",
  "How does the Greedy Knapsack budget allocation work?",
  "What is the difference between Tier 1 and Tier 2?"
];

export default function ChatbotModal({
  isOpen,
  onClose,
  selectedHotspot = null
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your **HeatScape AI Copilot**. Ask me any doubt about Chennai urban heat solutions, Tier 1 municipal costs, localized engineering justifications, or our Greedy Knapsack budget allocation math.",
      source: "HeatScape Intelligence"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('heatscape_gemini_api_key') || '');
  const [showKeySettings, setShowKeySettings] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const saveApiKey = (keyVal) => {
    const clean = keyVal.trim();
    setApiKey(clean);
    if (clean) {
      localStorage.setItem('heatscape_gemini_api_key', clean);
    } else {
      localStorage.removeItem('heatscape_gemini_api_key');
    }
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage = { role: 'user', content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Build history for backend
      const historyPayload = updatedMessages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await axios.post(ENDPOINTS.CHAT, {
        message: query,
        history: historyPayload,
        context_cell_id: selectedHotspot?.cell_id || null,
        api_key: apiKey || null
      });

      const botReply = {
        role: 'assistant',
        content: res.data?.answer || "I received your query but couldn't generate a response. Please try again.",
        source: res.data?.source || "HeatScape Intelligence",
        hasLiveApi: res.data?.has_live_api || false,
        followups: res.data?.suggested_followups || []
      };

      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I encountered an issue communicating with the AI service. Please ensure the backend is running or check your network.",
          source: "Error Handler"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat history cleared. What questions can I help you resolve regarding Chennai's cooling solutions?",
        source: "HeatScape Intelligence"
      }
    ]);
  };

  if (!isOpen) return null;

  // Render markdown-like formatting simply
  const renderFormattedText = (text) => {
    // Simple line-by-line markdown rendering
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headings
      if (line.startsWith('### ')) {
        return <h4 key={idx} style={{ fontSize: '14px', fontWeight: '800', color: '#4edea3', margin: '8px 0 4px 0' }}>{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} style={{ fontSize: '15px', fontWeight: '800', color: '#4cd7f6', margin: '10px 0 4px 0' }}>{line.replace('## ', '')}</h3>;
      }
      // Table rows
      if (line.startsWith('|')) {
        return (
          <div key={idx} className="font-mono" style={{ fontSize: '11px', color: '#dfe2f1', margin: '2px 0', overflowX: 'auto' }}>
            {line}
          </div>
        );
      }
      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const content = line.trim().substring(2);
        return (
          <li key={idx} style={{ marginLeft: '16px', marginBottom: '3px', fontSize: '12px', lineHeight: 1.45, color: '#dfe2f1' }}>
            {parseInlineStyles(content)}
          </li>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={idx} style={{ marginLeft: '14px', marginBottom: '4px', fontSize: '12px', lineHeight: 1.45, color: '#dfe2f1' }}>
            {parseInlineStyles(line.trim())}
          </div>
        );
      }
      // Regular paragraph
      if (!line.trim()) {
        return <div key={idx} style={{ height: '6px' }} />;
      }
      return (
        <p key={idx} style={{ margin: '3px 0', fontSize: '12px', lineHeight: 1.45, color: '#dfe2f1' }}>
          {parseInlineStyles(line)}
        </p>
      );
    });
  };

  // Helper for bold and inline highlights
  const parseInlineStyles = (str) => {
    const parts = str.split(/(\*\*.*?\*\*|\$.*?\$|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#fff', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        return <span key={i} className="font-mono" style={{ color: '#6ffbbe', background: 'rgba(78, 222, 163, 0.15)', padding: '1px 4px', borderRadius: '4px' }}>{part.slice(1, -1)}</span>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="font-mono" style={{ color: '#4cd7f6', background: 'rgba(76, 215, 246, 0.15)', padding: '1px 4px', borderRadius: '4px' }}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  // Minimized docked floating pill
  if (isMinimized) {
    return (
      <div
        className="animate-fade-in"
        style={{
          position: 'fixed',
          left: '24px',
          bottom: '24px',
          zIndex: 1200,
          background: 'rgba(15, 19, 29, 0.95)',
          border: '1px solid rgba(76, 215, 246, 0.4)',
          borderRadius: '12px',
          padding: '10px 16px',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#4cd7f6" />
          <span className="font-headline" style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
            AI Cooling Copilot
          </span>
        </div>
        <button
          onClick={() => setIsMinimized(false)}
          style={{
            background: 'rgba(76, 215, 246, 0.15)',
            border: '1px solid rgba(76, 215, 246, 0.3)',
            color: '#4cd7f6',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Maximize2 size={12} />
          <span>Expand</span>
        </button>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#86948a', cursor: 'pointer' }}
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="animate-slide-in"
      style={{
        position: 'fixed',
        left: '24px',
        bottom: '24px',
        width: '460px',
        maxWidth: '92vw',
        height: '620px',
        maxHeight: '85vh',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(15, 19, 29, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(76, 215, 246, 0.35)',
        borderRadius: '18px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
        overflow: 'hidden'
      }}
    >
      {/* 1. Header */}
      <div style={{
        padding: '14px 18px',
        background: 'rgba(10, 14, 24, 0.9)',
        borderBottom: '1px solid rgba(53, 57, 68, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(78, 222, 163, 0.2), rgba(76, 215, 246, 0.2))',
            border: '1px solid rgba(76, 215, 246, 0.4)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={16} color="#4cd7f6" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="font-headline" style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>
                AI Cooling Copilot
              </span>
              <span className="font-mono" style={{
                fontSize: '9.5px',
                background: apiKey ? 'rgba(78, 222, 163, 0.15)' : 'rgba(76, 215, 246, 0.15)',
                color: apiKey ? '#4edea3' : '#4cd7f6',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '700'
              }}>
                {apiKey ? 'GEMINI LIVE' : 'HYBRID AI'}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#86948a', marginTop: '1px' }}>
              Doubt resolution & climatological reasoning
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Key Settings Toggle */}
          <button
            onClick={() => setShowKeySettings(prev => !prev)}
            title="Configure Gemini API Key"
            style={{
              background: showKeySettings ? 'rgba(76, 215, 246, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: showKeySettings ? '1px solid #4cd7f6' : '1px solid rgba(255, 255, 255, 0.08)',
              color: showKeySettings ? '#4cd7f6' : '#bbcabf',
              borderRadius: '8px',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Key size={13} />
          </button>

          {/* Clear History */}
          <button
            onClick={clearChat}
            title="Clear Chat"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#bbcabf',
              borderRadius: '8px',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Trash2 size={13} />
          </button>

          {/* Minimize */}
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#bbcabf',
              borderRadius: '8px',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Minimize2 size={13} />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            title="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#dfe2f1',
              borderRadius: '8px',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* 2. Optional API Key Drawer */}
      {showKeySettings && (
        <div style={{
          padding: '12px 18px',
          background: 'rgba(10, 14, 24, 0.95)',
          borderBottom: '1px solid rgba(76, 215, 246, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-mono" style={{ fontSize: '10.5px', color: '#4cd7f6', fontWeight: '700' }}>
              GEMINI API KEY CONFIGURATION
            </span>
            {keySaved && (
              <span className="font-mono" style={{ fontSize: '10px', color: '#4edea3', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Check size={11} /> Saved
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="password"
              placeholder="Paste Google Gemini API Key (AIza...)"
              value={apiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              className="font-mono"
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '8px',
                background: '#171b26',
                border: '1px solid rgba(76, 215, 246, 0.3)',
                color: '#fff',
                fontSize: '11px',
                outline: 'none'
              }}
            />
          </div>
          <p style={{ fontSize: '10.5px', color: '#86948a', lineHeight: 1.35 }}>
            Stored securely in local browser storage. If empty, the system automatically uses backend environment or HeatScape's verified knowledge engine.
          </p>
        </div>
      )}

      {/* 3. Active Context Strip (if hotspot selected) */}
      {selectedHotspot && (
        <div style={{
          padding: '7px 18px',
          background: 'rgba(16, 185, 129, 0.08)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
            <MapPin size={12} color="#34d399" />
            <span style={{ color: '#bbcabf' }}>Context:</span>
            <strong style={{ color: '#fff' }}>{selectedHotspot.zone}</strong>
            <span className="font-mono" style={{ color: '#34d399', fontSize: '10px' }}>({selectedHotspot.cell_id})</span>
          </div>
          <span className="font-mono" style={{ fontSize: '10px', color: '#6ffbbe' }}>
            {selectedHotspot.cause?.replace(/_/g, ' ')}
          </span>
        </div>
      )}

      {/* 4. Messages Scrollable Body */}
      <div
        className="soln-panel-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: '4px'
              }}
            >
              {/* Sender Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '10px',
                color: isUser ? '#4edea3' : '#4cd7f6',
                padding: '0 4px'
              }}>
                {isUser ? <User size={10} /> : <Bot size={10} />}
                <span className="font-mono">{isUser ? 'You' : (msg.source || 'AI Copilot')}</span>
              </div>

              {/* Message Bubble */}
              <div style={{
                maxWidth: '88%',
                padding: '12px 14px',
                borderRadius: '14px',
                borderTopRightRadius: isUser ? '4px' : '14px',
                borderTopLeftRadius: isUser ? '14px' : '4px',
                backgroundColor: isUser ? 'rgba(16, 185, 129, 0.2)' : 'rgba(28, 31, 42, 0.85)',
                border: isUser ? '1px solid rgba(78, 222, 163, 0.35)' : '1px solid rgba(53, 57, 68, 0.4)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)'
              }}>
                {isUser ? (
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#fff', lineHeight: 1.45 }}>
                    {msg.content}
                  </p>
                ) : (
                  <div>{renderFormattedText(msg.content)}</div>
                )}
              </div>

              {/* Suggested Followups */}
              {!isUser && msg.followups && msg.followups.length > 0 && index === messages.length - 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', maxWidth: '92%' }}>
                  <span style={{ fontSize: '10px', color: '#86948a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Suggested Follow-ups:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {msg.followups.map((f, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => handleSend(f)}
                        style={{
                          background: 'rgba(76, 215, 246, 0.1)',
                          border: '1px solid rgba(76, 215, 246, 0.25)',
                          color: '#bae6fd',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        💡 {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4cd7f6', fontSize: '12px', padding: '6px 0' }}>
            <Sparkles size={14} className="animate-spin" />
            <span className="font-mono">Thinking with Gemini AI...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. Quick Prompts Bar (when only 1 message) */}
      {messages.length <= 2 && (
        <div style={{
          padding: '8px 18px',
          background: 'rgba(10, 14, 24, 0.7)',
          borderTop: '1px solid rgba(53, 57, 68, 0.3)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          flexShrink: 0
        }}>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#bbcabf',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '10.5px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* 6. Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          padding: '12px 18px',
          background: 'rgba(10, 14, 24, 0.95)',
          borderTop: '1px solid rgba(53, 57, 68, 0.4)',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexShrink: 0
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask any doubt about heat solutions, costs, or algorithms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: '#171b26',
            border: '1px solid rgba(53, 57, 68, 0.6)',
            color: '#fff',
            fontSize: '12.5px',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            background: input.trim() ? '#4edea3' : 'rgba(255, 255, 255, 0.1)',
            color: input.trim() ? '#003824' : '#86948a',
            border: 'none',
            borderRadius: '10px',
            width: '38px',
            height: '38px',
            cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s'
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
