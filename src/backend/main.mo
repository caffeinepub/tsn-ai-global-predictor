import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  type Sport = { #cricket; #football; #kabaddi; #basketball; #tennis };
  type MatchStatus = { #upcoming; #live; #completed };
  type PredictionConfidence = { #low; #medium; #high };

  type PlayerStats = {
    matchesPlayed : Nat;
    runsGoalsPoints : Nat;
    average : Float;
    recentForm : [Nat];
  };

  type Match = {
    id : Text;
    sport : Sport;
    homeTeam : Text;
    awayTeam : Text;
    homeScore : Nat;
    awayScore : Nat;
    status : MatchStatus;
    matchDate : Time.Time;
    venue : Text;
  };

  module Match {
    public func compare(a : Match, b : Match) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  type NewsArticle = {
    id : Text;
    title : Text;
    content : Text;
    sport : Sport;
    imageUrl : Text;
    publishedAt : Time.Time;
    author : Text;
  };

  module NewsArticle {
    public func compare(a : NewsArticle, b : NewsArticle) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  type Player = {
    id : Text;
    name : Text;
    sport : Sport;
    team : Text;
    position : Text;
    stats : PlayerStats;
    imageUrl : Text;
  };

  module Player {
    public func compare(a : Player, b : Player) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  type MatchPrediction = {
    matchId : Text;
    homeWinProbability : Nat;
    awayWinProbability : Nat;
    drawProbability : Nat;
    confidence : PredictionConfidence;
    keyFactors : Text;
    predictedScore : Text;
  };

  module MatchPrediction {
    public func compare(a : MatchPrediction, b : MatchPrediction) : Order.Order {
      Text.compare(a.matchId, b.matchId);
    };
  };

  type FantasySuggestion = {
    matchId : Text;
    suggestedPlayers : [(Text, Text)];
    captainId : Text;
    captainName : Text;
    viceCaptainId : Text;
    viceCaptainName : Text;
    totalCredits : Nat;
    reasoning : Text;
  };

  module FantasySuggestion {
    public func compare(a : FantasySuggestion, b : FantasySuggestion) : Order.Order {
      Text.compare(a.matchId, b.matchId);
    };
  };

  type MatchSummary = {
    matchId : Text;
    summary : Text;
    highlights : [Text];
    keyMoments : Text;
    generatedAt : Time.Time;
  };

  module MatchSummary {
    public func compare(a : MatchSummary, b : MatchSummary) : Order.Order {
      Text.compare(a.matchId, b.matchId);
    };
  };

  type Notification = {
    id : Text;
    title : Text;
    message : Text;
    sport : Sport;
    matchId : Text;
    notificationType : Text;
    createdAt : Time.Time;
  };

  module Notification {
    public func compare(a : Notification, b : Notification) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  public type UserProfile = {
    name : Text;
    favoriteSport : ?Sport;
    favoriteTeam : ?Text;
  };

  // AI Assistant Types
  public type ChatMessage = {
    id : Text;
    role : Text;
    content : Text;
    timestamp : Int;
    toolUsed : Text;
  };

  public type MotivationalQuote = {
    id : Text;
    quoteText : Text;
    author : Text;
    category : Text;
  };

  module MotivationalQuote {
    public func compare(a : MotivationalQuote, b : MotivationalQuote) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  // Storage
  let matches = Map.empty<Text, Match>();
  let news = Map.empty<Text, NewsArticle>();
  let players = Map.empty<Text, Player>();
  let predictions = Map.empty<Text, MatchPrediction>();
  let fantasySuggestions = Map.empty<Text, FantasySuggestion>();
  let summaries = Map.empty<Text, MatchSummary>();
  let notifications = Map.empty<Text, Notification>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let chatMessages = Map.empty<Principal, [ChatMessage]>();
  let quotes = Map.empty<Text, MotivationalQuote>();

  // Access Control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Match Management
  public shared ({ caller }) func createMatch(match : Match) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create matches");
    };
    matches.add(match.id, match);
  };

  public shared ({ caller }) func updateMatch(match : Match) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update matches");
    };
    matches.add(match.id, match);
  };

  public shared ({ caller }) func deleteMatch(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete matches");
    };
    matches.remove(id);
  };

  public query func getAllMatches() : async [Match] {
    matches.values().toArray().sort();
  };

  public query func getMatchesBySport(sport : Sport) : async [Match] {
    matches.values().toArray().sort().filter(
      func(m) { m.sport == sport }
    );
  };

  public query func getMatchesByStatus(status : MatchStatus) : async [Match] {
    matches.values().toArray().sort().filter(
      func(m) { m.status == status }
    );
  };

  // News Management
  public shared ({ caller }) func createNews(article : NewsArticle) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create news articles");
    };
    news.add(article.id, article);
  };

  public shared ({ caller }) func updateNews(article : NewsArticle) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update news articles");
    };
    news.add(article.id, article);
  };

  public shared ({ caller }) func deleteNews(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete news articles");
    };
    news.remove(id);
  };

  public query func getAllNews() : async [NewsArticle] {
    news.values().toArray().sort();
  };

  public query func getNewsBySport(sport : Sport) : async [NewsArticle] {
    news.values().toArray().sort().filter(
      func(n) { n.sport == sport }
    );
  };

  // Player Management
  public shared ({ caller }) func createPlayer(player : Player) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create players");
    };
    players.add(player.id, player);
  };

  public shared ({ caller }) func updatePlayer(player : Player) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update players");
    };
    players.add(player.id, player);
  };

  public query func getAllPlayers() : async [Player] {
    players.values().toArray().sort();
  };

  public query func getPlayersBySport(sport : Sport) : async [Player] {
    players.values().toArray().sort().filter(
      func(p) { p.sport == sport }
    );
  };

  // AI Match Predictions
  public shared ({ caller }) func createPrediction(prediction : MatchPrediction) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create predictions");
    };
    predictions.add(prediction.matchId, prediction);
  };

  public shared ({ caller }) func updatePrediction(prediction : MatchPrediction) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update predictions");
    };
    predictions.add(prediction.matchId, prediction);
  };

  public query func getPredictionByMatchId(matchId : Text) : async ?MatchPrediction {
    predictions.get(matchId);
  };

  // Fantasy Teams
  public shared ({ caller }) func createFantasySuggestion(suggestion : FantasySuggestion) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create fantasy suggestions");
    };
    fantasySuggestions.add(suggestion.matchId, suggestion);
  };

  public shared ({ caller }) func updateFantasySuggestion(suggestion : FantasySuggestion) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update fantasy suggestions");
    };
    fantasySuggestions.add(suggestion.matchId, suggestion);
  };

  public query func getFantasySuggestionByMatchId(matchId : Text) : async ?FantasySuggestion {
    fantasySuggestions.get(matchId);
  };

  // Match Summaries
  public shared ({ caller }) func createSummary(summary : MatchSummary) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create summaries");
    };
    summaries.add(summary.matchId, summary);
  };

  public shared ({ caller }) func updateSummary(summary : MatchSummary) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update summaries");
    };
    summaries.add(summary.matchId, summary);
  };

  public query func getSummaryByMatchId(matchId : Text) : async ?MatchSummary {
    summaries.get(matchId);
  };

  // Notifications
  public shared ({ caller }) func createNotification(notification : Notification) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create notifications");
    };
    notifications.add(notification.id, notification);
  };

  public query func getRecentNotifications() : async [Notification] {
    let allNotifications = notifications.values().toArray();
    let len = allNotifications.size();

    if (len <= 20) { return allNotifications };

    allNotifications.sliceToArray(0, 20);
  };

  // AI Assistant Functions
  public shared ({ caller }) func saveChatMessage(msg : ChatMessage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save chat messages");
    };

    let currentMessages = switch (chatMessages.get(caller)) {
      case (null) { [] };
      case (?msgs) { msgs };
    };

    let newMessages =
      if (currentMessages.size() >= 100) {
        let filtered = currentMessages.sliceToArray(1, currentMessages.size() - 1);
        filtered.concat([msg]);
      } else {
        currentMessages.concat([msg]);
      };

    chatMessages.add(caller, newMessages);
  };

  public query ({ caller }) func getChatHistory() : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access chat history");
    };

    switch (chatMessages.get(caller)) {
      case (null) { [] };
      case (?msgs) {
        if (msgs.size() <= 50) { return msgs };
        msgs.sliceToArray(msgs.size() - 50, 50);
      };
    };
  };

  public shared ({ caller }) func clearChatHistory() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear chat history");
    };

    chatMessages.remove(caller);
  };

  public shared ({ caller }) func addQuote(quote : MotivationalQuote) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add quotes");
    };

    quotes.add(quote.id, quote);
  };

  public query func getAllQuotes() : async [MotivationalQuote] {
    quotes.values().toArray().sort();
  };

  public query ({ caller }) func getCallerMessageCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access message count");
    };

    switch (chatMessages.get(caller)) {
      case (null) { 0 };
      case (?msgs) { msgs.size() };
    };
  };
};
