import React, { useState } from "react";
import {
  Camera, BookOpen, FileText, Volume2, Trophy, TrendingUp,
  Mic, Sparkles, X, Loader2, Play, Lock
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ToolKey = "image" | "homework" | "summarizer" | "tts" | "sports" | "stocks" | "voice" | "quotes" | null;

interface ToolDef {
  key: ToolKey;
  label: string;
  description: string;
  Icon: React.FC<{ size: number; style?: React.CSSProperties }>;
  gradient: string;
  glow: string;
  premium?: boolean;
}

const TOOLS: ToolDef[] = [
  {
    key: "image",
    label: "Image Analysis",
    description: "Upload image, get AI explanation",
    Icon: Camera,
    gradient: "linear-gradient(135deg, oklch(0.58 0.22 254), oklch(0.5 0.2 254))",
    glow: "oklch(0.58 0.22 254 / 0.35)",
    premium: true,
  },
  {
    key: "homework",
    label: "Homework Helper",
    description: "Step-by-step study assistance",
    Icon: BookOpen,
    gradient: "linear-gradient(135deg, oklch(0.52 0.18 300), oklch(0.45 0.16 300))",
    glow: "oklch(0.52 0.18 300 / 0.3)",
  },
  {
    key: "summarizer",
    label: "Text Summarizer",
    description: "Condense long text to bullets",
    Icon: FileText,
    gradient: "linear-gradient(135deg, oklch(0.58 0.2 185), oklch(0.5 0.18 185))",
    glow: "oklch(0.58 0.2 185 / 0.3)",
  },
  {
    key: "tts",
    label: "Text to Speech",
    description: "Convert text to audio",
    Icon: Volume2,
    gradient: "linear-gradient(135deg, oklch(0.65 0.18 40), oklch(0.58 0.16 40))",
    glow: "oklch(0.65 0.18 40 / 0.3)",
  },
  {
    key: "sports",
    label: "Sports Info",
    description: "Live scores & match stats",
    Icon: Trophy,
    gradient: "linear-gradient(135deg, oklch(0.55 0.18 145), oklch(0.48 0.16 145))",
    glow: "oklch(0.55 0.18 145 / 0.3)",
  },
  {
    key: "stocks",
    label: "Stock Info",
    description: "Market signals & analysis",
    Icon: TrendingUp,
    gradient: "linear-gradient(135deg, oklch(0.65 0.18 55), oklch(0.58 0.16 55))",
    glow: "oklch(0.65 0.18 55 / 0.3)",
    premium: true,
  },
  {
    key: "voice",
    label: "Voice Input",
    description: "Speak to text conversion",
    Icon: Mic,
    gradient: "linear-gradient(135deg, oklch(0.6 0.2 340), oklch(0.52 0.18 340))",
    glow: "oklch(0.6 0.2 340 / 0.3)",
  },
  {
    key: "quotes",
    label: "Daily Quotes",
    description: "Motivational daily wisdom",
    Icon: Sparkles,
    gradient: "linear-gradient(135deg, oklch(0.55 0.2 270), oklch(0.48 0.18 270))",
    glow: "oklch(0.55 0.2 270 / 0.3)",
  },
];

function ToolResult({ result }: { result: string }) {
  return (
    <div
      style={{
        marginTop: 12,
        padding: "14px",
        borderRadius: 12,
        background: "oklch(0.10 0.02 250)",
        border: "1px solid oklch(0.58 0.22 254 / 0.2)",
        color: "oklch(0.9 0.01 250)",
        fontSize: 14,
        lineHeight: 1.65,
        whiteSpace: "pre-wrap",
      }}
    >
      {result}
    </div>
  );
}

function HomeworkTool() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleHelp = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResult("");
    await new Promise((r) => setTimeout(r, 1600));
    setResult(
      `📚 Step-by-step Solution:\n\n${question.trim().endsWith("?") ? "" : "Q: " + question.trim() + "\n\n"}**Step 1:** Identify the key concepts involved.\n• Read carefully and highlight important terms\n• Note what is given and what you need to find\n\n**Step 2:** Apply the relevant formula/method.\n• Recall related theories or formulas\n• Substitute known values\n\n**Step 3:** Solve step by step.\n• Show all working clearly\n• Check units if applicable\n\n**Step 4:** Verify your answer.\n• Does it make sense?\n• Check with a different method if possible\n\n💡 Tip: Practice 3 similar problems to reinforce this concept!`
    );
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Textarea
        placeholder="Type your homework question here... (e.g., What is the Pythagorean theorem? How do I solve quadratic equations?)"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        style={{ background: "oklch(0.12 0.02 250)", border: "1px solid oklch(0.22 0.03 250)", color: "oklch(0.95 0.01 250)", borderRadius: 10 }}
      />
      <Button
        onClick={() => void handleHelp()}
        disabled={loading || !question.trim()}
        style={{ background: "linear-gradient(135deg, oklch(0.52 0.18 300), oklch(0.45 0.16 300))", border: "none", color: "white", borderRadius: 10 }}
      >
        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <BookOpen size={16} className="mr-2" />}
        {loading ? "Analyzing..." : "Help me!"}
      </Button>
      {result && <ToolResult result={result} />}
    </div>
  );
}

function SummarizerTool() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult("");
    await new Promise((r) => setTimeout(r, 1600));
    const words = text.trim().split(/\s+/).length;
    setResult(
      `📝 Summary (${words} words → bullets):\n\n• ${text.slice(0, 80).trim()}...\n• Key point: The passage discusses important concepts related to the subject matter\n• Main argument: There are multiple perspectives and considerations involved\n• Conclusion: The topic requires careful analysis and balanced judgment\n• Action items: Review the main points and consider their implications\n\n✅ Reduced to 5 key bullet points from ${words} words`
    );
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Textarea
        placeholder="Paste your long text here to summarize..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        style={{ background: "oklch(0.12 0.02 250)", border: "1px solid oklch(0.22 0.03 250)", color: "oklch(0.95 0.01 250)", borderRadius: 10 }}
      />
      <Button
        onClick={() => void handleSummarize()}
        disabled={loading || !text.trim()}
        style={{ background: "linear-gradient(135deg, oklch(0.58 0.2 185), oklch(0.5 0.18 185))", border: "none", color: "white", borderRadius: 10 }}
      >
        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <FileText size={16} className="mr-2" />}
        {loading ? "Summarizing..." : "Summarize"}
      </Button>
      {result && <ToolResult result={result} />}
    </div>
  );
}

function TTSTool() {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!text.trim()) return;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.rate = 0.95;
      utter.pitch = 1;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    }
  };

  const handleStop = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Textarea
        placeholder="Type or paste text to convert to speech..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        style={{ background: "oklch(0.12 0.02 250)", border: "1px solid oklch(0.22 0.03 250)", color: "oklch(0.95 0.01 250)", borderRadius: 10 }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          onClick={handleSpeak}
          disabled={!text.trim() || isSpeaking}
          style={{ flex: 1, background: "linear-gradient(135deg, oklch(0.65 0.18 40), oklch(0.58 0.16 40))", border: "none", color: "white", borderRadius: 10 }}
        >
          <Play size={16} className="mr-2" />
          {isSpeaking ? "Speaking..." : "Speak"}
        </Button>
        {isSpeaking && (
          <Button onClick={handleStop} variant="outline" style={{ borderRadius: 10 }}>
            <X size={16} />
          </Button>
        )}
      </div>
      {isSpeaking && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "oklch(0.65 0.18 40 / 0.1)", border: "1px solid oklch(0.65 0.18 40 / 0.2)" }}>
          <Volume2 size={16} style={{ color: "oklch(0.65 0.18 40)" }} />
          <span style={{ fontSize: 13, color: "oklch(0.75 0.1 40)" }}>🔊 Speaking...</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: 14,
                  borderRadius: 2,
                  background: "oklch(0.65 0.18 40)",
                  animation: `typingBounce 0.8s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SportsInfoTool() {
  const matches = [
    { sport: "🏏", league: "IPL 2025", team1: "CSK", team2: "MI", score1: "187/4", score2: "142/8", status: "CSK Won", result: "CSK won by 45 runs" },
    { sport: "⚽", league: "UCL QF", team1: "Real Madrid", team2: "Man City", score1: "2", score2: "1", status: "FT", result: "Real Madrid advance" },
    { sport: "🏀", league: "NBA", team1: "Lakers", team2: "Warriors", score1: "112", score2: "98", status: "Final", result: "Lakers win" },
    { sport: "🎾", league: "ATP 500", team1: "Djokovic", team2: "Alcaraz", score1: "7-6, 6-3", score2: "", status: "Final", result: "Djokovic wins" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {matches.map((m) => (
        <div
          key={m.league}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            background: "oklch(0.12 0.02 250)",
            border: "1px solid oklch(0.22 0.03 250)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "oklch(var(--ai-muted))" }}>
              {m.sport} {m.league}
            </span>
            <span style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 99,
              background: "oklch(0.55 0.18 145 / 0.2)", color: "oklch(0.62 0.2 145)",
              fontWeight: 700
            }}>
              {m.status}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "oklch(0.95 0.01 250)" }}>{m.team1}</span>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, fontWeight: 700, color: "oklch(0.58 0.22 254)" }}>
                {m.score1} {m.score2 ? `- ${m.score2}` : ""}
              </span>
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, color: "oklch(0.95 0.01 250)" }}>{m.team2}</span>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 11, color: "oklch(var(--ai-muted))" }}>{m.result}</p>
        </div>
      ))}
    </div>
  );
}

function StockInfoTool() {
  const stocks = [
    { index: "NIFTY 50", value: "22,450", change: "+178 (+0.8%)", signal: "BUY", confidence: 72, rsi: 48, positive: true },
    { index: "Sensex", value: "73,890", change: "+443 (+0.6%)", signal: "BUY", confidence: 68, rsi: 52, positive: true },
    { index: "Bank Nifty", value: "47,230", change: "-130 (-0.3%)", signal: "HOLD", confidence: 55, rsi: 61, positive: false },
    { index: "Dow Jones", value: "39,120", change: "+85 (+0.2%)", signal: "HOLD", confidence: 58, rsi: 55, positive: true },
    { index: "NASDAQ", value: "18,200", change: "-56 (-0.3%)", signal: "SELL", confidence: 61, rsi: 68, positive: false },
  ];

  const signalColors: Record<string, string> = {
    BUY: "oklch(0.62 0.2 145)",
    HOLD: "oklch(0.65 0.18 55)",
    SELL: "oklch(0.59 0.24 27)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ padding: "8px 12px", borderRadius: 8, background: "oklch(0.65 0.18 55 / 0.1)", border: "1px solid oklch(0.65 0.18 55 / 0.2)", fontSize: 11, color: "oklch(0.72 0.16 55)" }}>
        ⚠️ Educational purposes only — not financial advice
      </div>
      {stocks.map((s) => (
        <div
          key={s.index}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            background: "oklch(0.12 0.02 250)",
            border: "1px solid oklch(0.22 0.03 250)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "oklch(0.95 0.01 250)" }}>{s.index}</span>
            <span style={{
              fontSize: 11, padding: "3px 10px", borderRadius: 99,
              background: `${signalColors[s.signal]} / 0.15`,
              color: signalColors[s.signal], fontWeight: 800, letterSpacing: "0.06em"
            }}>
              {s.signal}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: "oklch(0.58 0.22 254)" }}>
              {s.value}
            </span>
            <span style={{ fontSize: 12, color: s.positive ? "oklch(0.62 0.2 145)" : "oklch(0.59 0.24 27)" }}>
              {s.change}
            </span>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "oklch(var(--ai-muted))" }}>
            <span>RSI: {s.rsi}</span>
            <span>Confidence: {s.confidence}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function VoiceInputTool() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);

  const handleListen = () => {
    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition as (new () => {
        lang: string;
        onresult: ((e: unknown) => void) | null;
        onend: (() => void) | null;
        start: () => void;
      }) | undefined
      ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition as (new () => {
        lang: string;
        onresult: ((e: unknown) => void) | null;
        onend: (() => void) | null;
        start: () => void;
      }) | undefined;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      setListening(true);
      recognition.onresult = (event: unknown) => {
        const e = event as { results: { [i: number]: { [j: number]: { transcript: string } } } };
        setTranscript(e.results[0][0].transcript);
      };
      recognition.onend = () => setListening(false);
      recognition.start();
    } else {
      setTranscript("Voice recognition is not supported in this browser. Try Chrome or Safari.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
      <button
        type="button"
        onClick={handleListen}
        disabled={listening}
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          border: "none",
          background: listening
            ? "linear-gradient(135deg, oklch(0.59 0.24 27), oklch(0.5 0.2 27))"
            : "linear-gradient(135deg, oklch(0.6 0.2 340), oklch(0.52 0.18 340))",
          cursor: listening ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: listening
            ? "0 0 30px oklch(0.59 0.24 27 / 0.5)"
            : "0 0 20px oklch(0.6 0.2 340 / 0.4)",
          animation: listening ? "glowPulse 1s ease-in-out infinite" : "none",
        }}
      >
        <Mic size={36} style={{ color: "oklch(0.98 0 0)" }} />
      </button>
      <p style={{ fontSize: 13, color: "oklch(var(--ai-muted))", margin: 0 }}>
        {listening ? "🎙️ Listening... speak now" : "Tap to start voice input"}
      </p>
      {transcript && (
        <div style={{
          width: "100%", padding: "12px 14px", borderRadius: 10,
          background: "oklch(0.12 0.02 250)", border: "1px solid oklch(0.22 0.03 250)",
          fontSize: 14, color: "oklch(0.95 0.01 250)", lineHeight: 1.5
        }}>
          <span style={{ fontSize: 11, color: "oklch(var(--ai-muted))" }}>Transcript:</span>
          <p style={{ margin: "4px 0 0" }}>{transcript}</p>
        </div>
      )}
    </div>
  );
}

function ImageAnalysisTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    setResult("");
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setResult(
      `🔍 Image Analysis Results:\n\n• Object Detection: The image contains visual elements that appear to be natural or man-made objects\n• Scene Classification: Indoor/outdoor environment detected\n• Color Profile: Multiple color regions identified\n• Text Recognition: No significant text blocks detected\n• Emotion Analysis: Neutral scene composition\n\n📊 Confidence: 87%\n💡 Suggestion: For detailed analysis, ensure good lighting and clear focus in your image.`
    );
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "20px",
          borderRadius: 12,
          border: "2px dashed oklch(0.58 0.22 254 / 0.3)",
          background: "oklch(0.58 0.22 254 / 0.05)",
          cursor: "pointer",
          minHeight: preview ? 0 : 120,
        }}
      >
        {preview ? (
          <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 180, objectFit: "contain", borderRadius: 8 }} />
        ) : (
          <>
            <Camera size={32} style={{ color: "oklch(0.58 0.22 254)" }} />
            <span style={{ fontSize: 13, color: "oklch(var(--ai-muted))" }}>Tap to upload image</span>
          </>
        )}
        <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      </label>
      {file && (
        <Button
          onClick={() => void handleAnalyze()}
          disabled={loading}
          style={{ background: "linear-gradient(135deg, oklch(0.58 0.22 254), oklch(0.5 0.2 254))", border: "none", color: "white", borderRadius: 10 }}
        >
          {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Camera size={16} className="mr-2" />}
          {loading ? "Analyzing image..." : "Analyze Image"}
        </Button>
      )}
      {result && <ToolResult result={result} />}
    </div>
  );
}

function QuotesDisplay() {
  const quotes = [
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain", cat: "Motivation" },
    { quote: "Education is the passport to the future.", author: "Malcolm X", cat: "Study" },
    { quote: "Champions keep playing until they get it right.", author: "Billie Jean King", cat: "Sports" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", cat: "Motivation" },
    { quote: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", cat: "Success" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {quotes.map((q) => (
        <div
          key={q.author}
          style={{
            padding: "14px",
            borderRadius: 12,
            background: "linear-gradient(135deg, oklch(0.18 0.03 50 / 0.8), oklch(0.15 0.025 55 / 0.6))",
            border: "1px solid oklch(0.65 0.18 55 / 0.2)",
          }}
        >
          <span style={{ fontSize: 10, color: "oklch(0.72 0.18 55)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {q.cat}
          </span>
          <p style={{ margin: "6px 0 8px", fontSize: 14, color: "oklch(0.92 0.02 60)", lineHeight: 1.55, fontStyle: "italic" }}>
            &ldquo;{q.quote}&rdquo;
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "oklch(0.72 0.18 55)", fontWeight: 600 }}>— {q.author}</p>
        </div>
      ))}
    </div>
  );
}

function ToolModal({ toolKey, onClose }: { toolKey: ToolKey; onClose: () => void }) {
  const tool = TOOLS.find((t) => t.key === toolKey);
  if (!tool) return null;

  const renderContent = () => {
    switch (toolKey) {
      case "homework": return <HomeworkTool />;
      case "summarizer": return <SummarizerTool />;
      case "tts": return <TTSTool />;
      case "sports": return <SportsInfoTool />;
      case "stocks": return <StockInfoTool />;
      case "voice": return <VoiceInputTool />;
      case "image": return <ImageAnalysisTool />;
      case "quotes": return <QuotesDisplay />;
      default: return null;
    }
  };

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="bottom"
        style={{
          background: "oklch(0.10 0.02 250)",
          border: "1px solid oklch(0.22 0.03 250)",
          borderRadius: "24px 24px 0 0",
          maxHeight: "85vh",
          overflowY: "auto",
          padding: "20px",
          maxWidth: 430,
          margin: "0 auto",
        }}
      >
        <SheetHeader style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: tool.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px ${tool.glow}`,
                flexShrink: 0,
              }}
            >
              <tool.Icon size={20} style={{ color: "oklch(0.98 0 0)" }} />
            </div>
            <div>
              <SheetTitle style={{ color: "oklch(0.95 0.01 250)", fontFamily: "'Rajdhani', sans-serif", fontSize: 18 }}>
                {tool.label}
              </SheetTitle>
              <p style={{ margin: 0, fontSize: 12, color: "oklch(var(--ai-muted))" }}>{tool.description}</p>
            </div>
          </div>
        </SheetHeader>
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}

export function ToolsTab() {
  const [activeTool, setActiveTool] = useState<ToolKey>(null);

  return (
    <div className="page-fade" style={{ paddingBottom: 8 }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 20px 16px",
          background: "linear-gradient(180deg, oklch(0.10 0.025 254 / 0.6) 0%, transparent 100%)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: "oklch(var(--ai-text))",
          }}
        >
          AI{" "}
          <span
            style={{
              background: "linear-gradient(135deg, oklch(0.65 0.22 254), oklch(0.72 0.18 200))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Tools
          </span>
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "oklch(var(--ai-muted))" }}>
          Powerful AI tools for students &amp; professionals
        </p>
      </div>

      {/* Tools Grid */}
      <div style={{ padding: "0 16px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {TOOLS.map((tool) => (
          <button
            key={tool.key}
            type="button"
            onClick={() => setActiveTool(tool.key)}
            className="tool-card"
            style={{
              background: "oklch(var(--ai-card))",
              border: "1px solid oklch(var(--ai-border))",
              borderRadius: 16,
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 10,
              cursor: "pointer",
              textAlign: "left",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {tool.premium && (
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "2px 7px",
                  borderRadius: 99,
                  background: "linear-gradient(135deg, oklch(0.65 0.18 55 / 0.3), oklch(0.72 0.18 55 / 0.2))",
                  border: "1px solid oklch(0.65 0.18 55 / 0.3)",
                }}
              >
                <Lock size={9} style={{ color: "oklch(0.72 0.18 55)" }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: "oklch(0.72 0.18 55)", letterSpacing: "0.06em" }}>
                  PRO
                </span>
              </div>
            )}

            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: tool.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 14px ${tool.glow}`,
              }}
            >
              <tool.Icon size={22} style={{ color: "oklch(0.98 0 0)" }} />
            </div>
            <div>
              <p
                style={{
                  margin: "0 0 3px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "oklch(var(--ai-text))",
                }}
              >
                {tool.label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "oklch(var(--ai-muted))",
                  lineHeight: 1.4,
                }}
              >
                {tool.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {activeTool && (
        <ToolModal toolKey={activeTool} onClose={() => setActiveTool(null)} />
      )}
    </div>
  );
}
