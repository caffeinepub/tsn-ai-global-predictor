import type { backendInterface } from "../backend";
import {
  Sport,
  MatchStatus,
  PredictionConfidence,
} from "../backend.d";

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function nowBigInt(): bigint {
  return BigInt(Date.now()) * BigInt(1_000_000);
}

function futureBigInt(hoursAhead: number): bigint {
  return BigInt(Date.now() + hoursAhead * 3600 * 1000) * BigInt(1_000_000);
}

function pastBigInt(hoursAgo: number): bigint {
  return BigInt(Date.now() - hoursAgo * 3600 * 1000) * BigInt(1_000_000);
}

export async function seedIfNeeded(actor: backendInterface): Promise<void> {
  try {
    const [isAdmin, existingMatches] = await Promise.all([
      actor.isCallerAdmin(),
      actor.getAllMatches(),
    ]);

    if (!isAdmin || existingMatches.length > 0) {
      return;
    }

    console.log("[Seed] Starting data seeding...");

    // --- MATCHES ---
    const matchData = [
      // Cricket
      {
        id: generateId(), sport: Sport.cricket, homeTeam: "India", awayTeam: "Australia",
        homeScore: BigInt(287), awayScore: BigInt(0), status: MatchStatus.live,
        matchDate: pastBigInt(2), venue: "Wankhede Stadium, Mumbai",
      },
      {
        id: generateId(), sport: Sport.cricket, homeTeam: "England", awayTeam: "South Africa",
        homeScore: BigInt(0), awayScore: BigInt(0), status: MatchStatus.upcoming,
        matchDate: futureBigInt(3), venue: "Lord's Cricket Ground, London",
      },
      {
        id: generateId(), sport: Sport.cricket, homeTeam: "Pakistan", awayTeam: "New Zealand",
        homeScore: BigInt(312), awayScore: BigInt(298), status: MatchStatus.completed,
        matchDate: pastBigInt(24), venue: "National Stadium, Karachi",
      },
      // Football
      {
        id: generateId(), sport: Sport.football, homeTeam: "Real Madrid", awayTeam: "Barcelona",
        homeScore: BigInt(2), awayScore: BigInt(1), status: MatchStatus.live,
        matchDate: pastBigInt(1), venue: "Santiago Bernabéu, Madrid",
      },
      {
        id: generateId(), sport: Sport.football, homeTeam: "Man City", awayTeam: "Liverpool",
        homeScore: BigInt(0), awayScore: BigInt(0), status: MatchStatus.upcoming,
        matchDate: futureBigInt(5), venue: "Etihad Stadium, Manchester",
      },
      {
        id: generateId(), sport: Sport.football, homeTeam: "PSG", awayTeam: "Bayern Munich",
        homeScore: BigInt(3), awayScore: BigInt(2), status: MatchStatus.completed,
        matchDate: pastBigInt(48), venue: "Parc des Princes, Paris",
      },
      // Kabaddi
      {
        id: generateId(), sport: Sport.kabaddi, homeTeam: "Patna Pirates", awayTeam: "Jaipur Pink Panthers",
        homeScore: BigInt(38), awayScore: BigInt(35), status: MatchStatus.live,
        matchDate: pastBigInt(1), venue: "Shree Shiv Chhatrapati Sports Complex, Pune",
      },
      {
        id: generateId(), sport: Sport.kabaddi, homeTeam: "U Mumba", awayTeam: "Bengaluru Bulls",
        homeScore: BigInt(0), awayScore: BigInt(0), status: MatchStatus.upcoming,
        matchDate: futureBigInt(2), venue: "DOME NSCI SVP Stadium, Mumbai",
      },
      // Basketball
      {
        id: generateId(), sport: Sport.basketball, homeTeam: "LA Lakers", awayTeam: "Golden State",
        homeScore: BigInt(98), awayScore: BigInt(92), status: MatchStatus.live,
        matchDate: pastBigInt(1), venue: "Crypto.com Arena, Los Angeles",
      },
      {
        id: generateId(), sport: Sport.basketball, homeTeam: "Chicago Bulls", awayTeam: "Miami Heat",
        homeScore: BigInt(0), awayScore: BigInt(0), status: MatchStatus.upcoming,
        matchDate: futureBigInt(6), venue: "United Center, Chicago",
      },
      // Tennis
      {
        id: generateId(), sport: Sport.tennis, homeTeam: "Djokovic", awayTeam: "Alcaraz",
        homeScore: BigInt(1), awayScore: BigInt(2), status: MatchStatus.live,
        matchDate: pastBigInt(2), venue: "Centre Court, Wimbledon",
      },
      {
        id: generateId(), sport: Sport.tennis, homeTeam: "Medvedev", awayTeam: "Zverev",
        homeScore: BigInt(0), awayScore: BigInt(0), status: MatchStatus.upcoming,
        matchDate: futureBigInt(4), venue: "Arthur Ashe Stadium, New York",
      },
    ];

    await Promise.all(matchData.map((m) => actor.createMatch(m)));
    console.log("[Seed] Matches created");

    // Fetch created matches for IDs
    const matches = await actor.getAllMatches();

    // --- PLAYERS ---
    const playerData = [
      // Cricket
      { id: generateId(), name: "Virat Kohli", sport: Sport.cricket, team: "India", position: "Batsman", imageUrl: "", stats: { matchesPlayed: BigInt(250), runsGoalsPoints: BigInt(12000), average: 59.8, recentForm: [BigInt(82), BigInt(45), BigInt(110), BigInt(33), BigInt(77)] } },
      { id: generateId(), name: "Rohit Sharma", sport: Sport.cricket, team: "India", position: "Opener/Captain", imageUrl: "", stats: { matchesPlayed: BigInt(240), runsGoalsPoints: BigInt(10800), average: 52.3, recentForm: [BigInt(65), BigInt(120), BigInt(28), BigInt(88), BigInt(43)] } },
      { id: generateId(), name: "Pat Cummins", sport: Sport.cricket, team: "Australia", position: "Fast Bowler", imageUrl: "", stats: { matchesPlayed: BigInt(130), runsGoalsPoints: BigInt(280), average: 32.1, recentForm: [BigInt(4), BigInt(3), BigInt(5), BigInt(2), BigInt(4)] } },
      // Football
      { id: generateId(), name: "Vinicius Jr.", sport: Sport.football, team: "Real Madrid", position: "Forward", imageUrl: "", stats: { matchesPlayed: BigInt(180), runsGoalsPoints: BigInt(95), average: 7.8, recentForm: [BigInt(2), BigInt(1), BigInt(0), BigInt(1), BigInt(2)] } },
      { id: generateId(), name: "Erling Haaland", sport: Sport.football, team: "Man City", position: "Striker", imageUrl: "", stats: { matchesPlayed: BigInt(150), runsGoalsPoints: BigInt(145), average: 9.1, recentForm: [BigInt(2), BigInt(3), BigInt(1), BigInt(2), BigInt(1)] } },
      { id: generateId(), name: "Mo Salah", sport: Sport.football, team: "Liverpool", position: "Right Wing", imageUrl: "", stats: { matchesPlayed: BigInt(310), runsGoalsPoints: BigInt(228), average: 8.4, recentForm: [BigInt(1), BigInt(2), BigInt(1), BigInt(2), BigInt(0)] } },
      // Kabaddi
      { id: generateId(), name: "Pardeep Narwal", sport: Sport.kabaddi, team: "Patna Pirates", position: "Raider", imageUrl: "", stats: { matchesPlayed: BigInt(160), runsGoalsPoints: BigInt(1380), average: 12.2, recentForm: [BigInt(14), BigInt(12), BigInt(16), BigInt(10), BigInt(15)] } },
      // Basketball
      { id: generateId(), name: "LeBron James", sport: Sport.basketball, team: "LA Lakers", position: "Forward", imageUrl: "", stats: { matchesPlayed: BigInt(1450), runsGoalsPoints: BigInt(40000), average: 27.2, recentForm: [BigInt(28), BigInt(32), BigInt(25), BigInt(38), BigInt(22)] } },
      { id: generateId(), name: "Stephen Curry", sport: Sport.basketball, team: "Golden State", position: "Guard", imageUrl: "", stats: { matchesPlayed: BigInt(1050), runsGoalsPoints: BigInt(25000), average: 24.8, recentForm: [BigInt(30), BigInt(22), BigInt(35), BigInt(18), BigInt(28)] } },
      // Tennis
      { id: generateId(), name: "Novak Djokovic", sport: Sport.tennis, team: "Serbia", position: "Singles", imageUrl: "", stats: { matchesPlayed: BigInt(1240), runsGoalsPoints: BigInt(98), average: 87.4, recentForm: [BigInt(1), BigInt(0), BigInt(1), BigInt(1), BigInt(1)] } },
      { id: generateId(), name: "Carlos Alcaraz", sport: Sport.tennis, team: "Spain", position: "Singles", imageUrl: "", stats: { matchesPlayed: BigInt(380), runsGoalsPoints: BigInt(28), average: 72.5, recentForm: [BigInt(1), BigInt(1), BigInt(0), BigInt(1), BigInt(1)] } },
    ];

    await Promise.all(playerData.map((p) => actor.createPlayer(p)));
    console.log("[Seed] Players created");

    // --- NEWS ---
    const newsData = [
      { id: generateId(), title: "India Dominates with Kohli's 82* in ODI Thriller", content: "Virat Kohli once again proved his class with a brilliant 82 not out, guiding India to a strong total against Australia. The innings featured 8 boundaries and demonstrated his trademark technique on a challenging pitch. The middle-order support from Rohit Sharma and Jadeja ensured a competitive total.", sport: Sport.cricket, imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400", publishedAt: pastBigInt(4), author: "Sports Desk" },
      { id: generateId(), title: "El Clásico: Real Madrid Edge Barcelona 2-1 in Thriller", content: "In a pulsating El Clásico encounter, Real Madrid's Vinicius Jr. scored a brace to seal a dramatic 2-1 victory over Barcelona. The match, watched by millions globally, saw both teams create numerous chances. Barcelona's Lewandowski pulled one back in the dying minutes but couldn't salvage a draw.", sport: Sport.football, imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400", publishedAt: pastBigInt(8), author: "Football Analyst" },
      { id: generateId(), title: "PKL Season 11: Patna Pirates on Winning Streak", content: "Patna Pirates continue their dominant run in Pro Kabaddi League Season 11. Pardeep Narwal's 14-point performance in the latest match was instrumental in their victory. The team's defense has been equally impressive, with the right corner pairing proving impenetrable.", sport: Sport.kabaddi, imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400", publishedAt: pastBigInt(12), author: "PKL Correspondent" },
      { id: generateId(), title: "NBA: LeBron James Achieves Historic Scoring Milestone", content: "LeBron James scored 28 points in the Lakers vs Golden State clash, crossing yet another milestone in his storied career. At 39, LeBron continues to defy age with his athletic brilliance and basketball IQ. The game ended 98-92 in favor of the Lakers.", sport: Sport.basketball, imageUrl: "https://images.unsplash.com/photo-1546519638405-a3aed27a3fe9?w=400", publishedAt: pastBigInt(6), author: "NBA Beat Reporter" },
      { id: generateId(), title: "Wimbledon 2025: Alcaraz vs Djokovic — A Grand Slam Classic", content: "The Wimbledon semifinal between Carlos Alcaraz and Novak Djokovic is living up to its billing as the match of the tournament. With Alcaraz leading 2-1 in sets, every point is contested fiercely. Analysts say it could be the most watched Wimbledon match in a decade.", sport: Sport.tennis, imageUrl: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=400", publishedAt: pastBigInt(3), author: "Tennis Correspondent" },
      { id: generateId(), title: "FIFA Rankings: New Nations Rise to Challenge Top Teams", content: "The latest FIFA rankings reveal surprising movements with several nations climbing the charts after strong performances in qualifiers. The data reflects a democratization of global football talent, with African and Asian teams making significant gains.", sport: Sport.football, imageUrl: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400", publishedAt: pastBigInt(18), author: "FIFA Analyst" },
      { id: generateId(), title: "IPL Auction 2026: Record-Breaking Bids for Young Talent", content: "The upcoming IPL auction is set to see record bids for young domestic talent. Several U-23 players have been scouted extensively by franchise teams, with AI analytics tools playing a major role in identifying potential stars early.", sport: Sport.cricket, imageUrl: "https://images.unsplash.com/photo-1624526267942-ab0ff8a45e95?w=400", publishedAt: pastBigInt(20), author: "IPL Correspondent" },
    ];

    await Promise.all(newsData.map((n) => actor.createNews(n)));
    console.log("[Seed] News created");

    // --- PREDICTIONS for each match ---
    const predictionData = matches.map((match, index) => {
      const patterns = [
        { home: BigInt(60), away: BigInt(25), draw: BigInt(15), conf: PredictionConfidence.high, score: "India: 320/6 vs Australia: 285/9" },
        { home: BigInt(45), away: BigInt(35), draw: BigInt(20), conf: PredictionConfidence.medium, score: "England: 290/8 vs SA: 275/10" },
        { home: BigInt(50), away: BigInt(40), draw: BigInt(10), conf: PredictionConfidence.high, score: "PAK: 310 vs NZ: 298" },
        { home: BigInt(55), away: BigInt(30), draw: BigInt(15), conf: PredictionConfidence.high, score: "Real Madrid 2 - Barcelona 1" },
        { home: BigInt(40), away: BigInt(35), draw: BigInt(25), conf: PredictionConfidence.medium, score: "Man City 1 - Liverpool 1" },
        { home: BigInt(48), away: BigInt(42), draw: BigInt(10), conf: PredictionConfidence.low, score: "PSG 2 - Bayern 2" },
        { home: BigInt(55), away: BigInt(45), draw: BigInt(0), conf: PredictionConfidence.medium, score: "Patna 42 - Jaipur 38" },
        { home: BigInt(50), away: BigInt(50), draw: BigInt(0), conf: PredictionConfidence.low, score: "U Mumba 36 - Bengaluru 36" },
        { home: BigInt(58), away: BigInt(42), draw: BigInt(0), conf: PredictionConfidence.high, score: "Lakers 105 - Golden State 98" },
        { home: BigInt(45), away: BigInt(55), draw: BigInt(0), conf: PredictionConfidence.medium, score: "Bulls 95 - Miami Heat 102" },
        { home: BigInt(42), away: BigInt(58), draw: BigInt(0), conf: PredictionConfidence.high, score: "Alcaraz wins 3-1" },
        { home: BigInt(50), away: BigInt(50), draw: BigInt(0), conf: PredictionConfidence.medium, score: "Medvedev wins 3-2" },
      ];
      const p = patterns[index % patterns.length];
      return {
        matchId: match.id,
        homeWinProbability: p.home,
        awayWinProbability: p.away,
        drawProbability: p.draw,
        confidence: p.conf,
        keyFactors: "Recent form, head-to-head record, home advantage, player fitness, and weather conditions have been analyzed. AI confidence level reflects statistical consistency.",
        predictedScore: p.score,
      };
    });

    await Promise.all(predictionData.map((p) => actor.createPrediction(p)));
    console.log("[Seed] Predictions created");

    // --- FANTASY SUGGESTIONS for each match ---
    const fantasySuggestions = matches.slice(0, 8).map((match) => {
      const sportEmoji = getSportAbbr(match.sport);
      return {
        matchId: match.id,
        suggestedPlayers: [
          [generateId(), `${match.homeTeam} Player 1 (${sportEmoji})`] as [string, string],
          [generateId(), `${match.homeTeam} Player 2 (${sportEmoji})`] as [string, string],
          [generateId(), `${match.homeTeam} Player 3 (${sportEmoji})`] as [string, string],
          [generateId(), `${match.homeTeam} Player 4 (${sportEmoji})`] as [string, string],
          [generateId(), `${match.homeTeam} Player 5 (${sportEmoji})`] as [string, string],
          [generateId(), `${match.awayTeam} Player 1 (${sportEmoji})`] as [string, string],
          [generateId(), `${match.awayTeam} Player 2 (${sportEmoji})`] as [string, string],
          [generateId(), `${match.awayTeam} Player 3 (${sportEmoji})`] as [string, string],
          [generateId(), `${match.awayTeam} Player 4 (${sportEmoji})`] as [string, string],
          [generateId(), `${match.awayTeam} Player 5 (${sportEmoji})`] as [string, string],
          [generateId(), `${match.homeTeam} Player 6 (${sportEmoji})`] as [string, string],
        ],
        captainId: `cap-${match.id}`,
        captainName: `${match.homeTeam} Star Player`,
        viceCaptainId: `vc-${match.id}`,
        viceCaptainName: `${match.awayTeam} Star Player`,
        totalCredits: BigInt(100),
        reasoning: `AI Analysis: Based on recent form, pitch conditions, and head-to-head statistics, this team composition maximizes point potential. The captain choice reflects the highest probability of multi-score performance in current match conditions.`,
      };
    });

    await Promise.all(fantasySuggestions.map((f) => actor.createFantasySuggestion(f)));
    console.log("[Seed] Fantasy suggestions created");

    // --- MATCH SUMMARIES ---
    const liveAndCompletedMatches = matches.filter(
      (m) => m.status === MatchStatus.live || m.status === MatchStatus.completed,
    );

    const summaries = liveAndCompletedMatches.slice(0, 5).map((match) => ({
      matchId: match.id,
      summary: `This ${match.sport} match between ${match.homeTeam} and ${match.awayTeam} has been a compelling contest at ${match.venue}. The ${match.homeTeam} team has shown excellent ${match.sport === Sport.cricket ? "batting technique" : match.sport === Sport.football ? "attacking play" : "performance"}, while ${match.awayTeam} has mounted a strong resistance. The match atmosphere is electric with fans witnessing world-class sport.`,
      highlights: [
        `${match.homeTeam} takes early initiative with strong start`,
        `${match.awayTeam} responds with tactical brilliance`,
        `Key defensive play changes match momentum`,
        `Crowd witnessing exceptional individual skill`,
        `Match intensity reaches fever pitch in crucial phase`,
      ],
      keyMoments: `Key moments include the opening exchanges setting the tone, a pivotal mid-game shift in momentum, and the current battle for match dominance. Both teams have shown why they are elite competitors in ${match.sport}.`,
      generatedAt: nowBigInt(),
    }));

    await Promise.all(summaries.map((s) => actor.createSummary(s)));
    console.log("[Seed] Summaries created");

    // --- NOTIFICATIONS ---
    const notifications = [
      { id: generateId(), title: "🔴 LIVE: India vs Australia", message: "Match underway at Wankhede! India batting first with 287 on the board.", sport: Sport.cricket, matchId: matches[0]?.id || "", notificationType: "live_match", createdAt: pastBigInt(0.5) },
      { id: generateId(), title: "⚽ El Clásico LIVE", message: "Real Madrid leads 2-1 against Barcelona. Vinicius scores brace!", sport: Sport.football, matchId: matches[3]?.id || "", notificationType: "score_update", createdAt: pastBigInt(1) },
      { id: generateId(), title: "🏀 NBA Alert: Lakers vs Warriors", message: "LeBron with 28pts, Lakers lead 98-92 in Q4!", sport: Sport.basketball, matchId: matches[8]?.id || "", notificationType: "live_match", createdAt: pastBigInt(1.5) },
      { id: generateId(), title: "🎾 Wimbledon Update", message: "Alcaraz leads Djokovic 2-1 sets in epic semifinal battle!", sport: Sport.tennis, matchId: matches[10]?.id || "", notificationType: "score_update", createdAt: pastBigInt(2) },
      { id: generateId(), title: "🏐 PKL: Patna Pirates Leading", message: "Patna Pirates dominating 38-35 with 5 minutes remaining!", sport: Sport.kabaddi, matchId: matches[6]?.id || "", notificationType: "live_match", createdAt: pastBigInt(0.8) },
    ];

    await Promise.all(notifications.map((n) => actor.createNotification(n)));
    console.log("[Seed] Notifications created");

    console.log("[Seed] ✅ All data seeded successfully!");
  } catch (error) {
    console.error("[Seed] Error during seeding:", error);
  }
}

function getSportAbbr(sport: Sport): string {
  const map: Record<Sport, string> = {
    [Sport.cricket]: "BAT",
    [Sport.football]: "FWD",
    [Sport.kabaddi]: "RAI",
    [Sport.basketball]: "PG",
    [Sport.tennis]: "SNG",
  };
  return map[sport] || "PL";
}
