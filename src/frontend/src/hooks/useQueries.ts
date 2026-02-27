import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type {
  Match,
  NewsArticle,
  Player,
  MatchPrediction,
  FantasySuggestion,
  MatchSummary,
  Notification,
  UserProfile,
  ChatMessage,
  MotivationalQuote,
} from "../backend.d";
import { Sport, MatchStatus, UserRole } from "../backend.d";

// ---- Matches ----
export function useAllMatches() {
  const { actor, isFetching } = useActor();
  return useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMatches();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useMatchesByStatus(status: MatchStatus) {
  const { actor, isFetching } = useActor();
  return useQuery<Match[]>({
    queryKey: ["matches", "status", status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMatchesByStatus(status);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useMatchesBySport(sport: Sport | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Match[]>({
    queryKey: ["matches", "sport", sport],
    queryFn: async () => {
      if (!actor || !sport) return [];
      return actor.getMatchesBySport(sport);
    },
    enabled: !!actor && !isFetching && !!sport,
    staleTime: 30_000,
  });
}

// ---- News ----
export function useAllNews() {
  const { actor, isFetching } = useActor();
  return useQuery<NewsArticle[]>({
    queryKey: ["news"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNews();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ---- Players ----
export function useAllPlayers() {
  const { actor, isFetching } = useActor();
  return useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPlayers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ---- Predictions ----
export function usePredictionByMatchId(matchId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<MatchPrediction | null>({
    queryKey: ["prediction", matchId],
    queryFn: async () => {
      if (!actor || !matchId) return null;
      return actor.getPredictionByMatchId(matchId);
    },
    enabled: !!actor && !isFetching && !!matchId,
    staleTime: 60_000,
  });
}

// ---- Fantasy ----
export function useFantasyByMatchId(matchId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<FantasySuggestion | null>({
    queryKey: ["fantasy", matchId],
    queryFn: async () => {
      if (!actor || !matchId) return null;
      return actor.getFantasySuggestionByMatchId(matchId);
    },
    enabled: !!actor && !isFetching && !!matchId,
    staleTime: 60_000,
  });
}

// ---- Summary ----
export function useSummaryByMatchId(matchId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<MatchSummary | null>({
    queryKey: ["summary", matchId],
    queryFn: async () => {
      if (!actor || !matchId) return null;
      return actor.getSummaryByMatchId(matchId);
    },
    enabled: !!actor && !isFetching && !!matchId,
    staleTime: 60_000,
  });
}

// ---- Notifications ----
export function useRecentNotifications() {
  const { actor, isFetching } = useActor();
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentNotifications();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

// ---- User ----
export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity,
  });
}

// ---- Mutations ----
export function useCreateMatch() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (match: Match) => {
      if (!actor) throw new Error("No actor");
      return actor.createMatch(match);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["matches"] }),
  });
}

export function useUpdateMatch() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (match: Match) => {
      if (!actor) throw new Error("No actor");
      return actor.updateMatch(match);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["matches"] }),
  });
}

export function useDeleteMatch() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteMatch(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["matches"] }),
  });
}

export function useCreateNews() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (article: NewsArticle) => {
      if (!actor) throw new Error("No actor");
      return actor.createNews(article);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news"] }),
  });
}

export function useUpdateNews() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (article: NewsArticle) => {
      if (!actor) throw new Error("No actor");
      return actor.updateNews(article);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news"] }),
  });
}

export function useDeleteNews() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteNews(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news"] }),
  });
}

export function useCreatePlayer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (player: Player) => {
      if (!actor) throw new Error("No actor");
      return actor.createPlayer(player);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["players"] }),
  });
}

export function useUpdatePlayer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (player: Player) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePlayer(player);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["players"] }),
  });
}

export function useCreatePrediction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pred: MatchPrediction) => {
      if (!actor) throw new Error("No actor");
      return actor.createPrediction(pred);
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["prediction", vars.matchId] }),
  });
}

export function useUpdatePrediction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pred: MatchPrediction) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePrediction(pred);
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["prediction", vars.matchId] }),
  });
}

export function useCreateFantasy() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sug: FantasySuggestion) => {
      if (!actor) throw new Error("No actor");
      return actor.createFantasySuggestion(sug);
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["fantasy", vars.matchId] }),
  });
}

export function useUpdateFantasy() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sug: FantasySuggestion) => {
      if (!actor) throw new Error("No actor");
      return actor.updateFantasySuggestion(sug);
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["fantasy", vars.matchId] }),
  });
}

export function useCreateSummary() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sum: MatchSummary) => {
      if (!actor) throw new Error("No actor");
      return actor.createSummary(sum);
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["summary", vars.matchId] }),
  });
}

export function useUpdateSummary() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sum: MatchSummary) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSummary(sum);
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["summary", vars.matchId] }),
  });
}

export function useCreateNotification() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notif: Notification) => {
      if (!actor) throw new Error("No actor");
      return actor.createNotification(notif);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("No actor");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

// ---- Chat ----
export function useChatHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<ChatMessage[]>({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatHistory();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useSaveChatMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (msg: ChatMessage) => {
      if (!actor) throw new Error("No actor");
      return actor.saveChatMessage(msg);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chatHistory"] }),
  });
}

export function useClearChatHistory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.clearChatHistory();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chatHistory"] }),
  });
}

// ---- Quotes ----
export function useAllQuotes() {
  const { actor, isFetching } = useActor();
  return useQuery<MotivationalQuote[]>({
    queryKey: ["quotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllQuotes();
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity,
  });
}

export function useAddQuote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (quote: MotivationalQuote) => {
      if (!actor) throw new Error("No actor");
      return actor.addQuote(quote);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quotes"] }),
  });
}
