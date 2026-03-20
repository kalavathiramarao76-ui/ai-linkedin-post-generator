const ANALYTICS_KEY = "postcraft_analytics";

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  count: number;
  words: number;
}

export interface AnalyticsData {
  totalPosts: number;
  totalWords: number;
  styleBreakdown: Record<string, number>;
  featureBreakdown: Record<string, number>;
  dailyHistory: DailyEntry[];
  streak: number;
  averagePostLength: number;
}

interface RawAnalytics {
  totalPosts: number;
  totalWords: number;
  totalChars: number;
  styleBreakdown: Record<string, number>;
  featureBreakdown: Record<string, number>;
  dailyHistory: DailyEntry[];
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getRawData(): RawAnalytics {
  if (typeof window === "undefined") {
    return {
      totalPosts: 0,
      totalWords: 0,
      totalChars: 0,
      styleBreakdown: {},
      featureBreakdown: {},
      dailyHistory: [],
    };
  }
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    if (!data) {
      return {
        totalPosts: 0,
        totalWords: 0,
        totalChars: 0,
        styleBreakdown: {},
        featureBreakdown: {},
        dailyHistory: [],
      };
    }
    return JSON.parse(data);
  } catch {
    return {
      totalPosts: 0,
      totalWords: 0,
      totalChars: 0,
      styleBreakdown: {},
      featureBreakdown: {},
      dailyHistory: [],
    };
  }
}

function saveRawData(data: RawAnalytics): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
}

export function trackGeneration(
  style: string,
  wordCount: number,
  feature: string
): void {
  const data = getRawData();
  const today = getToday();

  data.totalPosts += 1;
  data.totalWords += wordCount;
  data.totalChars += wordCount * 5; // rough estimate

  // Style breakdown
  data.styleBreakdown[style] = (data.styleBreakdown[style] || 0) + 1;

  // Feature breakdown
  data.featureBreakdown[feature] = (data.featureBreakdown[feature] || 0) + 1;

  // Daily history — keep last 30 days
  const existingDay = data.dailyHistory.find((d) => d.date === today);
  if (existingDay) {
    existingDay.count += 1;
    existingDay.words += wordCount;
  } else {
    data.dailyHistory.push({ date: today, count: 1, words: wordCount });
  }

  // Trim to last 30 days
  data.dailyHistory = data.dailyHistory.slice(-30);

  saveRawData(data);
}

function calculateStreak(dailyHistory: DailyEntry[]): number {
  if (dailyHistory.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  // Check if today has activity; if not, start from yesterday
  const todayStr = getToday();
  const hasToday = dailyHistory.some((d) => d.date === todayStr);
  if (!hasToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];
    const found = dailyHistory.some((d) => d.date === dateStr);
    if (found) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getAnalytics(): AnalyticsData {
  const raw = getRawData();

  const averagePostLength =
    raw.totalPosts > 0 ? Math.round(raw.totalWords / raw.totalPosts) : 0;

  // Get last 7 days of history
  const last7: DailyEntry[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const existing = raw.dailyHistory.find((e) => e.date === dateStr);
    last7.push(existing || { date: dateStr, count: 0, words: 0 });
  }

  return {
    totalPosts: raw.totalPosts,
    totalWords: raw.totalWords,
    styleBreakdown: raw.styleBreakdown,
    featureBreakdown: raw.featureBreakdown,
    dailyHistory: last7,
    streak: calculateStreak(raw.dailyHistory),
    averagePostLength,
  };
}

export function resetAnalytics(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ANALYTICS_KEY);
}
