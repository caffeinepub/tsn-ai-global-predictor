import React, { useState, useEffect, useRef, useCallback } from "react";
import { Brain, Trash2, Send, Mic, BotMessageSquare } from "lucide-react";
import { useActor } from "../hooks/useActor";
import type { ChatMessage } from "../backend.d";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
  toolUsed: string;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m} ${ampm}`;
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.match(/homework|study|learn|school|exam|assignment|college|university/)) {
    return "📚 Great question! Here are some study tips:\n\n1. Break your homework into small chunks\n2. Use the Pomodoro technique: 25 min study, 5 min break\n3. Remove distractions and find a quiet space\n4. Review your notes within 24 hours of class\n5. Teach the concept to someone else to reinforce learning\n\nWould you like help with a specific subject? 😊";
  }
  if (lower.match(/cricket|ipl|t20|odi|test match|bcci/)) {
    return "🏏 Cricket Update!\n\n• IND vs AUS: India leads 280/6 (48 overs)\n• IPL 2025: CSK vs MI tonight at 7:30 PM IST\n• ICC Rankings: Rohit Sharma #1 T20I captain\n\nWant prediction for today's match? I can analyze team form and head-to-head stats! 📊";
  }
  if (lower.match(/football|soccer|epl|champions league|la liga|fifa/)) {
    return "⚽ Football Highlights!\n\n• EPL: Man City leads table with 72 pts\n• UCL Quarter-finals draw announced\n• La Liga: Real Madrid 3-1 Barcelona (El Clasico)\n\nAI Prediction: Man City 65% chance to win UCL this season based on current form. Want full match analysis? 🎯";
  }
  if (lower.match(/nba|basketball|lakers|warriors|celtics/)) {
    return "🏀 NBA Update!\n\n• LAL vs GSW: Lakers win 112-98\n• LeBron James: 28 pts, 11 reb, 9 ast\n• Current standings: Boston Celtics #1 East\n\nPlayoff predictions available — want to see AI analysis for your team? 🔥";
  }
  if (lower.match(/stock|market|invest|nifty|sensex|nasdaq|crypto/)) {
    return "📈 Market Intelligence!\n\n• NIFTY 50: 22,450 (+0.8%)\n• Sensex: 73,890 (+0.6%)\n• NASDAQ: 18,200 (-0.3%)\n\n🤖 AI Signal:\n• AAPL: BUY (RSI 42, oversold)\n• TSLA: HOLD (high volatility)\n• GOOGL: BUY (strong fundamentals)\n\n⚠️ Educational purposes only — not financial advice.";
  }
  if (lower.match(/hello|hi|hey|good morning|good evening|good afternoon|how are you/)) {
    return "Hello! 👋 I'm TSN AI Assistant, your intelligent companion for:\n\n🎓 Study help & homework\n📊 Stock market insights\n🏆 Sports predictions\n📝 Text summarization\n🔊 Text to speech\n\nHow can I help you today? Just ask anything! 😊";
  }
  if (lower.match(/weather|temperature|forecast/)) {
    return "🌤️ For real-time weather, I recommend:\n\n• weather.com for detailed forecasts\n• AccuWeather for hourly predictions\n• Your device's built-in weather app\n\nIs there anything else I can help you with? I'm great at homework, sports, stocks, and more! 🚀";
  }
  if (lower.match(/joke|funny|laugh|humor/)) {
    return "😄 Here's one:\n\nWhy do programmers prefer dark mode?\n\n...Because light attracts bugs! 🐛\n\nWant another one? Or shall we get back to learning something amazing? 🎓";
  }
  return `🤖 Thanks for your question! I'm TSN AI Assistant.\n\nI can help you with:\n• 📚 Homework & study tips\n• 🏆 Sports info & predictions\n• 📈 Stock market insights\n• 📝 Text summarization\n• 🎯 General knowledge\n\nCould you rephrase your question or choose one of the topics above? I'm here to help! ✨`;
}

export function ChatTab() {
  const { actor } = useActor();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history on mount
  useEffect(() => {
    if (!actor) return;
    void (async () => {
      try {
        const history = await actor.getChatHistory();
        const msgs: Message[] = history.map((m: ChatMessage) => ({
          id: m.id,
          content: m.content,
          role: m.role as "user" | "assistant",
          timestamp: Number(m.timestamp),
          toolUsed: m.toolUsed,
        }));
        // Sort by timestamp
        msgs.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(msgs);
      } catch {
        // ignore
      }
    })();
  }, [actor]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      content: text,
      role: "user",
      timestamp: Date.now(),
      toolUsed: "",
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    // Persist user message
    if (actor) {
      void actor.saveChatMessage({
        id: userMsg.id,
        content: userMsg.content,
        role: "user",
        timestamp: BigInt(userMsg.timestamp),
        toolUsed: "",
      });
    }

    // Simulate AI thinking
    const delay = 1500 + Math.random() * 700;
    await new Promise((r) => setTimeout(r, delay));

    const aiResponse = getAIResponse(text);
    const aiMsg: Message = {
      id: `a_${Date.now()}`,
      content: aiResponse,
      role: "assistant",
      timestamp: Date.now(),
      toolUsed: "chat",
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsThinking(false);

    // Persist AI message
    if (actor) {
      void actor.saveChatMessage({
        id: aiMsg.id,
        content: aiMsg.content,
        role: "assistant",
        timestamp: BigInt(aiMsg.timestamp),
        toolUsed: "chat",
      });
    }
  }, [input, actor]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionStatic }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionStatic }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        inputRef.current?.focus();
      };
      recognition.start();
    } else {
      setInput("Tell me about today's cricket match");
      inputRef.current?.focus();
    }
  };

  const clearChat = async () => {
    if (actor) {
      try {
        await actor.clearChatHistory();
      } catch {
        // ignore
      }
    }
    setMessages([]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        background: "oklch(var(--ai-bg))",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "oklch(var(--ai-card))",
          borderBottom: "1px solid oklch(var(--ai-border))",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "linear-gradient(135deg, oklch(0.58 0.22 254), oklch(0.68 0.18 200))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px oklch(0.58 0.22 254 / 0.4)",
            }}
          >
            <Brain size={20} style={{ color: "oklch(0.98 0 0)" }} />
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 17,
                fontWeight: 700,
                color: "oklch(var(--ai-text))",
              }}
            >
              TSN AI Assistant
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: "oklch(0.62 0.2 145)" }}>
              ● Online • Ready to help
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void clearChat()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: "1px solid oklch(var(--ai-border))",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "oklch(0.59 0.24 27)",
          }}
          aria-label="Clear chat"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          paddingBottom: 0,
        }}
      >
        {messages.length === 0 && !isThinking && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "linear-gradient(135deg, oklch(0.58 0.22 254 / 0.15), oklch(0.68 0.18 200 / 0.1))",
                border: "1px solid oklch(0.58 0.22 254 / 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BotMessageSquare size={32} style={{ color: "oklch(0.58 0.22 254)" }} />
            </div>
            <p
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: "oklch(var(--ai-text))",
                margin: 0,
              }}
            >
              Ask me anything!
            </p>
            <p style={{ fontSize: 13, color: "oklch(var(--ai-muted))", margin: 0, lineHeight: 1.5 }}>
              I can help with homework, sports, stocks,
              <br />
              summaries, and much more.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 }}>
              {["📚 Study help", "🏏 Cricket score", "📈 Stock tips", "🤔 General Q&A"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setInput(s.slice(3))}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 99,
                    border: "1px solid oklch(0.58 0.22 254 / 0.3)",
                    background: "oklch(0.58 0.22 254 / 0.08)",
                    color: "oklch(0.72 0.15 254)",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              animation: "slideUp 0.25s ease forwards",
            }}
          >
            {msg.role === "assistant" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: "linear-gradient(135deg, oklch(0.58 0.22 254), oklch(0.68 0.18 200))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Brain size={12} style={{ color: "oklch(0.98 0 0)" }} />
                </div>
                <span style={{ fontSize: 11, color: "oklch(var(--ai-muted))", fontWeight: 600 }}>TSN AI</span>
              </div>
            )}
            <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.content}</p>
            </div>
            <span style={{ fontSize: 10, color: "oklch(var(--ai-muted))", marginTop: 3 }}>
              {formatTime(msg.timestamp)}
            </span>
          </div>
        ))}

        {/* Typing indicator */}
        {isThinking && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              animation: "slideUp 0.25s ease forwards",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: "linear-gradient(135deg, oklch(0.58 0.22 254), oklch(0.68 0.18 200))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Brain size={12} style={{ color: "oklch(0.98 0 0)" }} />
              </div>
              <span style={{ fontSize: 11, color: "oklch(var(--ai-muted))", fontWeight: 600 }}>TSN AI</span>
            </div>
            <div
              className="chat-bubble-ai"
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "12px 16px" }}
            >
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} style={{ height: 1 }} />
      </div>

      {/* Input Bar */}
      <div
        style={{
          padding: "12px 16px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
          background: "oklch(var(--ai-card))",
          borderTop: "1px solid oklch(var(--ai-border))",
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexShrink: 0,
          marginBottom: 62,
        }}
      >
        <button
          type="button"
          onClick={handleVoiceInput}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "1px solid oklch(var(--ai-border))",
            background: "oklch(var(--ai-surface))",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "oklch(var(--ai-muted))",
            flexShrink: 0,
          }}
        >
          <Mic size={18} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isThinking}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 12,
            border: "1px solid oklch(var(--ai-border))",
            background: "oklch(var(--ai-surface))",
            padding: "0 14px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 14,
            color: "oklch(var(--ai-text))",
            outline: "none",
          }}
        />

        <button
          type="button"
          onClick={() => void sendMessage()}
          disabled={!input.trim() || isThinking}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "none",
            background:
              input.trim() && !isThinking
                ? "linear-gradient(135deg, oklch(0.58 0.22 254), oklch(0.5 0.2 254))"
                : "oklch(var(--ai-surface))",
            cursor: input.trim() && !isThinking ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: input.trim() && !isThinking ? "oklch(0.98 0 0)" : "oklch(var(--ai-muted))",
            flexShrink: 0,
            boxShadow:
              input.trim() && !isThinking ? "0 4px 12px oklch(0.58 0.22 254 / 0.4)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

// Type shim for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
}
interface SpeechRecognitionStatic {
  new (): {
    lang: string;
    onresult: ((e: SpeechRecognitionEvent) => void) | null;
    start: () => void;
  };
}
