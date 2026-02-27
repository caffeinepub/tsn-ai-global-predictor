import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Player {
    id: string;
    name: string;
    team: string;
    sport: Sport;
    stats: PlayerStats;
    imageUrl: string;
    position: string;
}
export interface MatchSummary {
    generatedAt: Time;
    highlights: Array<string>;
    summary: string;
    matchId: string;
    keyMoments: string;
}
export interface PlayerStats {
    recentForm: Array<bigint>;
    average: number;
    matchesPlayed: bigint;
    runsGoalsPoints: bigint;
}
export type Time = bigint;
export interface FantasySuggestion {
    captainName: string;
    viceCaptainId: string;
    reasoning: string;
    viceCaptainName: string;
    matchId: string;
    totalCredits: bigint;
    suggestedPlayers: Array<[string, string]>;
    captainId: string;
}
export interface Match {
    id: string;
    status: MatchStatus;
    venue: string;
    homeTeam: string;
    sport: Sport;
    homeScore: bigint;
    awayTeam: string;
    awayScore: bigint;
    matchDate: Time;
}
export interface MatchPrediction {
    keyFactors: string;
    predictedScore: string;
    matchId: string;
    awayWinProbability: bigint;
    confidence: PredictionConfidence;
    homeWinProbability: bigint;
    drawProbability: bigint;
}
export interface Notification {
    id: string;
    title: string;
    notificationType: string;
    createdAt: Time;
    sport: Sport;
    matchId: string;
    message: string;
}
export interface NewsArticle {
    id: string;
    title: string;
    content: string;
    publishedAt: Time;
    author: string;
    sport: Sport;
    imageUrl: string;
}
export interface ChatMessage {
    id: string;
    content: string;
    role: string;
    timestamp: bigint;
    toolUsed: string;
}
export interface UserProfile {
    favoriteSport?: Sport;
    name: string;
    favoriteTeam?: string;
}
export interface MotivationalQuote {
    id: string;
    quoteText: string;
    author: string;
    category: string;
}
export enum MatchStatus {
    upcoming = "upcoming",
    live = "live",
    completed = "completed"
}
export enum PredictionConfidence {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum Sport {
    basketball = "basketball",
    football = "football",
    cricket = "cricket",
    tennis = "tennis",
    kabaddi = "kabaddi"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addQuote(quote: MotivationalQuote): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearChatHistory(): Promise<void>;
    createFantasySuggestion(suggestion: FantasySuggestion): Promise<void>;
    createMatch(match: Match): Promise<void>;
    createNews(article: NewsArticle): Promise<void>;
    createNotification(notification: Notification): Promise<void>;
    createPlayer(player: Player): Promise<void>;
    createPrediction(prediction: MatchPrediction): Promise<void>;
    createSummary(summary: MatchSummary): Promise<void>;
    deleteMatch(id: string): Promise<void>;
    deleteNews(id: string): Promise<void>;
    getAllMatches(): Promise<Array<Match>>;
    getAllNews(): Promise<Array<NewsArticle>>;
    getAllPlayers(): Promise<Array<Player>>;
    getAllQuotes(): Promise<Array<MotivationalQuote>>;
    getCallerMessageCount(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatHistory(): Promise<Array<ChatMessage>>;
    getFantasySuggestionByMatchId(matchId: string): Promise<FantasySuggestion | null>;
    getMatchesBySport(sport: Sport): Promise<Array<Match>>;
    getMatchesByStatus(status: MatchStatus): Promise<Array<Match>>;
    getNewsBySport(sport: Sport): Promise<Array<NewsArticle>>;
    getPlayersBySport(sport: Sport): Promise<Array<Player>>;
    getPredictionByMatchId(matchId: string): Promise<MatchPrediction | null>;
    getRecentNotifications(): Promise<Array<Notification>>;
    getSummaryByMatchId(matchId: string): Promise<MatchSummary | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveChatMessage(msg: ChatMessage): Promise<void>;
    updateFantasySuggestion(suggestion: FantasySuggestion): Promise<void>;
    updateMatch(match: Match): Promise<void>;
    updateNews(article: NewsArticle): Promise<void>;
    updatePlayer(player: Player): Promise<void>;
    updatePrediction(prediction: MatchPrediction): Promise<void>;
    updateSummary(summary: MatchSummary): Promise<void>;
}
