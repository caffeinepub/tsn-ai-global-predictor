import React, { useState } from "react";
import { X, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  useCreateMatch,
  useCreateNews,
  useCreatePlayer,
  useCreatePrediction,
  useCreateFantasy,
  useCreateNotification,
  useAllMatches,
} from "../hooks/useQueries";
import { Sport, MatchStatus, PredictionConfidence } from "../backend.d";
import { generateId, nowBigInt, getSportIcon, getSportLabel } from "../utils/helpers";

interface AdminPanelProps {
  onClose: () => void;
}

type AdminTab = "matches" | "news" | "players" | "predictions" | "fantasy" | "notifications";

const ADMIN_TABS: { key: AdminTab; label: string; icon: string }[] = [
  { key: "matches", label: "Matches", icon: "🏟️" },
  { key: "news", label: "News", icon: "📰" },
  { key: "players", label: "Players", icon: "🏃" },
  { key: "predictions", label: "Predictions", icon: "🤖" },
  { key: "fantasy", label: "Fantasy", icon: "👑" },
  { key: "notifications", label: "Notifs", icon: "🔔" },
];

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("matches");

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        className="admin-panel-overlay w-full h-full cursor-default"
        onClick={onClose}
        aria-label="Close admin panel"
      />

      {/* Panel */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[210] rounded-t-2xl overflow-hidden"
        style={{
          maxHeight: "90dvh",
          backgroundColor: "oklch(var(--sport-card))",
          border: "1px solid oklch(var(--sport-border))",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sport-border sticky top-0 bg-sport-card z-10">
          <p className="font-heading font-black text-base text-sport-text">⚙️ Admin Panel</p>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-sport-surface hover:bg-sport-border transition-colors"
            aria-label="Close admin panel"
          >
            <X size={16} className="text-sport-muted" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex overflow-x-auto border-b border-sport-border bg-sport-surface">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-heading font-bold tracking-wide transition-all border-b-2 ${
                activeTab === tab.key
                  ? "text-primary border-primary"
                  : "text-sport-muted border-transparent"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(90dvh - 130px)" }}>
          <div className="p-4">
            {activeTab === "matches" && <MatchForm />}
            {activeTab === "news" && <NewsForm />}
            {activeTab === "players" && <PlayerForm />}
            {activeTab === "predictions" && <PredictionForm />}
            {activeTab === "fantasy" && <FantasyForm />}
            {activeTab === "notifications" && <NotifForm />}
          </div>
        </div>
      </div>
    </>
  );
}

// --- Match Form ---
function MatchForm() {
  const { mutateAsync, isPending } = useCreateMatch();
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [sport, setSport] = useState<Sport>(Sport.cricket);
  const [status, setStatus] = useState<MatchStatus>(MatchStatus.upcoming);
  const [homeScore, setHomeScore] = useState("0");
  const [awayScore, setAwayScore] = useState("0");
  const [venue, setVenue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({
        id: generateId(),
        sport,
        homeTeam,
        awayTeam,
        homeScore: BigInt(parseInt(homeScore) || 0),
        awayScore: BigInt(parseInt(awayScore) || 0),
        status,
        matchDate: nowBigInt(),
        venue,
      });
      toast.success("Match created!");
      setHomeTeam(""); setAwayTeam(""); setVenue("");
    } catch {
      toast.error("Failed to create match");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminField label="Sport">
        <SportSelect value={sport} onChange={setSport} />
      </AdminField>
      <div className="grid grid-cols-2 gap-3">
        <AdminField label="Home Team">
          <Input value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} placeholder="India" required className="bg-sport-surface border-sport-border" />
        </AdminField>
        <AdminField label="Away Team">
          <Input value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} placeholder="Australia" required className="bg-sport-surface border-sport-border" />
        </AdminField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <AdminField label="Home Score">
          <Input type="number" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} min="0" className="bg-sport-surface border-sport-border" />
        </AdminField>
        <AdminField label="Away Score">
          <Input type="number" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} min="0" className="bg-sport-surface border-sport-border" />
        </AdminField>
      </div>
      <AdminField label="Status">
        <Select value={status} onValueChange={(v) => setStatus(v as MatchStatus)}>
          <SelectTrigger className="bg-sport-surface border-sport-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={MatchStatus.upcoming}>Upcoming</SelectItem>
            <SelectItem value={MatchStatus.live}>Live</SelectItem>
            <SelectItem value={MatchStatus.completed}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </AdminField>
      <AdminField label="Venue">
        <Input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Stadium name" className="bg-sport-surface border-sport-border" />
      </AdminField>
      <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
        <Plus size={16} className="mr-2" />
        {isPending ? "Creating…" : "Create Match"}
      </Button>
    </form>
  );
}

// --- News Form ---
function NewsForm() {
  const { mutateAsync, isPending } = useCreateNews();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sport, setSport] = useState<Sport>(Sport.cricket);
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({
        id: generateId(),
        title,
        content,
        sport,
        author,
        imageUrl,
        publishedAt: nowBigInt(),
      });
      toast.success("News article created!");
      setTitle(""); setContent(""); setAuthor(""); setImageUrl("");
    } catch {
      toast.error("Failed to create article");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminField label="Sport">
        <SportSelect value={sport} onChange={setSport} />
      </AdminField>
      <AdminField label="Title">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Match headline..." required className="bg-sport-surface border-sport-border" />
      </AdminField>
      <AdminField label="Content">
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Article content..." rows={4} required className="bg-sport-surface border-sport-border resize-none" />
      </AdminField>
      <AdminField label="Author">
        <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Sports Desk" className="bg-sport-surface border-sport-border" />
      </AdminField>
      <AdminField label="Image URL">
        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="bg-sport-surface border-sport-border" />
      </AdminField>
      <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
        <Save size={16} className="mr-2" />
        {isPending ? "Saving…" : "Publish Article"}
      </Button>
    </form>
  );
}

// --- Player Form ---
function PlayerForm() {
  const { mutateAsync, isPending } = useCreatePlayer();
  const [name, setName] = useState("");
  const [sport, setSport] = useState<Sport>(Sport.cricket);
  const [team, setTeam] = useState("");
  const [position, setPosition] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({
        id: generateId(),
        name,
        sport,
        team,
        position,
        imageUrl: "",
        stats: {
          matchesPlayed: BigInt(0),
          runsGoalsPoints: BigInt(0),
          average: 0,
          recentForm: [],
        },
      });
      toast.success("Player created!");
      setName(""); setTeam(""); setPosition("");
    } catch {
      toast.error("Failed to create player");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminField label="Sport">
        <SportSelect value={sport} onChange={setSport} />
      </AdminField>
      <AdminField label="Player Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Virat Kohli" required className="bg-sport-surface border-sport-border" />
      </AdminField>
      <AdminField label="Team">
        <Input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="India" required className="bg-sport-surface border-sport-border" />
      </AdminField>
      <AdminField label="Position">
        <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Batsman" required className="bg-sport-surface border-sport-border" />
      </AdminField>
      <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
        <Plus size={16} className="mr-2" />
        {isPending ? "Creating…" : "Add Player"}
      </Button>
    </form>
  );
}

// --- Prediction Form ---
function PredictionForm() {
  const { mutateAsync, isPending } = useCreatePrediction();
  const { data: matches = [] } = useAllMatches();
  const [matchId, setMatchId] = useState("");
  const [homeWin, setHomeWin] = useState([50]);
  const [awayWin, setAwayWin] = useState([30]);
  const [draw, setDraw] = useState([20]);
  const [confidence, setConfidence] = useState<PredictionConfidence>(PredictionConfidence.medium);
  const [keyFactors, setKeyFactors] = useState("");
  const [predictedScore, setPredictedScore] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchId) { toast.error("Select a match"); return; }
    try {
      await mutateAsync({
        matchId,
        homeWinProbability: BigInt(homeWin[0]),
        awayWinProbability: BigInt(awayWin[0]),
        drawProbability: BigInt(draw[0]),
        confidence,
        keyFactors,
        predictedScore,
      });
      toast.success("Prediction saved!");
    } catch {
      toast.error("Failed to save prediction");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminField label="Match">
        <Select value={matchId} onValueChange={setMatchId}>
          <SelectTrigger className="bg-sport-surface border-sport-border">
            <SelectValue placeholder="Select match..." />
          </SelectTrigger>
          <SelectContent>
            {matches.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.homeTeam} vs {m.awayTeam}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AdminField>

      <AdminField label={`Home Win %: ${homeWin[0]}%`}>
        <Slider value={homeWin} onValueChange={setHomeWin} min={0} max={100} step={1} className="mt-2" />
      </AdminField>
      <AdminField label={`Away Win %: ${awayWin[0]}%`}>
        <Slider value={awayWin} onValueChange={setAwayWin} min={0} max={100} step={1} className="mt-2" />
      </AdminField>
      <AdminField label={`Draw %: ${draw[0]}%`}>
        <Slider value={draw} onValueChange={setDraw} min={0} max={100} step={1} className="mt-2" />
      </AdminField>

      <AdminField label="Confidence">
        <Select value={confidence} onValueChange={(v) => setConfidence(v as PredictionConfidence)}>
          <SelectTrigger className="bg-sport-surface border-sport-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PredictionConfidence.low}>Low</SelectItem>
            <SelectItem value={PredictionConfidence.medium}>Medium</SelectItem>
            <SelectItem value={PredictionConfidence.high}>High</SelectItem>
          </SelectContent>
        </Select>
      </AdminField>

      <AdminField label="Key Factors">
        <Textarea value={keyFactors} onChange={(e) => setKeyFactors(e.target.value)} placeholder="Recent form, H2H..." rows={3} className="bg-sport-surface border-sport-border resize-none" />
      </AdminField>
      <AdminField label="Predicted Score">
        <Input value={predictedScore} onChange={(e) => setPredictedScore(e.target.value)} placeholder="India: 320/6 vs AUS: 290" className="bg-sport-surface border-sport-border" />
      </AdminField>
      <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
        <Save size={16} className="mr-2" />
        {isPending ? "Saving…" : "Save Prediction"}
      </Button>
    </form>
  );
}

// --- Fantasy Form ---
function FantasyForm() {
  const { mutateAsync, isPending } = useCreateFantasy();
  const { data: matches = [] } = useAllMatches();
  const [matchId, setMatchId] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [vcName, setVcName] = useState("");
  const [reasoning, setReasoning] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchId) { toast.error("Select a match"); return; }
    const capId = generateId();
    const vcId = generateId();
    try {
      await mutateAsync({
        matchId,
        suggestedPlayers: [[capId, captainName], [vcId, vcName]] as [string, string][],
        captainId: capId,
        captainName,
        viceCaptainId: vcId,
        viceCaptainName: vcName,
        totalCredits: BigInt(100),
        reasoning,
      });
      toast.success("Fantasy suggestion saved!");
      setCaptainName(""); setVcName(""); setReasoning("");
    } catch {
      toast.error("Failed to save fantasy suggestion");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminField label="Match">
        <Select value={matchId} onValueChange={setMatchId}>
          <SelectTrigger className="bg-sport-surface border-sport-border">
            <SelectValue placeholder="Select match..." />
          </SelectTrigger>
          <SelectContent>
            {matches.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.homeTeam} vs {m.awayTeam}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AdminField>
      <AdminField label="Captain Name">
        <Input value={captainName} onChange={(e) => setCaptainName(e.target.value)} placeholder="Star Player" required className="bg-sport-surface border-sport-border" />
      </AdminField>
      <AdminField label="Vice Captain Name">
        <Input value={vcName} onChange={(e) => setVcName(e.target.value)} placeholder="Vice Star Player" required className="bg-sport-surface border-sport-border" />
      </AdminField>
      <AdminField label="AI Reasoning">
        <Textarea value={reasoning} onChange={(e) => setReasoning(e.target.value)} placeholder="Why this team composition..." rows={3} className="bg-sport-surface border-sport-border resize-none" />
      </AdminField>
      <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
        <Save size={16} className="mr-2" />
        {isPending ? "Saving…" : "Save Fantasy Team"}
      </Button>
    </form>
  );
}

// --- Notification Form ---
function NotifForm() {
  const { mutateAsync, isPending } = useCreateNotification();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sport, setSport] = useState<Sport>(Sport.cricket);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({
        id: generateId(),
        title,
        message,
        sport,
        matchId: "",
        notificationType: "alert",
        createdAt: nowBigInt(),
      });
      toast.success("Notification sent!");
      setTitle(""); setMessage("");
    } catch {
      toast.error("Failed to send notification");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminField label="Sport">
        <SportSelect value={sport} onChange={setSport} />
      </AdminField>
      <AdminField label="Title">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="🔴 LIVE: Match Alert" required className="bg-sport-surface border-sport-border" />
      </AdminField>
      <AdminField label="Message">
        <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Notification message..." rows={3} required className="bg-sport-surface border-sport-border resize-none" />
      </AdminField>
      <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
        <Plus size={16} className="mr-2" />
        {isPending ? "Sending…" : "Send Notification"}
      </Button>
    </form>
  );
}

// --- Shared Components ---
function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-heading font-bold text-sport-muted uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}

function SportSelect({ value, onChange }: { value: Sport; onChange: (v: Sport) => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Sport)}>
      <SelectTrigger className="bg-sport-surface border-sport-border">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.values(Sport).map((s) => (
          <SelectItem key={s} value={s}>
            {getSportIcon(s)} {getSportLabel(s)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
