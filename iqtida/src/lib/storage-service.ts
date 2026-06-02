const KEYS = {
  THEME: "iqtida-theme",
  FAVORITES: "iqtida-favorites",
  COMPLETED: "iqtida-completed",
  DAILY_PROGRESS: "iqtida-daily-progress",
  REFLECTIONS: "iqtida-reflections",
};

function get<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded, silently fail */
  }
}

export const storage = {
  getFavorites(): string[] {
    return get<string[]>(KEYS.FAVORITES, []);
  },
  setFavorites(ids: string[]) {
    set(KEYS.FAVORITES, ids);
  },
  toggleFavorite(id: string): string[] {
    const favs = this.getFavorites();
    const updated = favs.includes(id)
      ? favs.filter((f) => f !== id)
      : [...favs, id];
    this.setFavorites(updated);
    return updated;
  },
  isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  },

  getCompleted(): string[] {
    return get<string[]>(KEYS.COMPLETED, []);
  },
  setCompleted(ids: string[]) {
    set(KEYS.COMPLETED, ids);
  },
  toggleCompleted(id: string): string[] {
    const done = this.getCompleted();
    const updated = done.includes(id)
      ? done.filter((d) => d !== id)
      : [...done, id];
    this.setCompleted(updated);
    return updated;
  },
  isCompleted(id: string): boolean {
    return this.getCompleted().includes(id);
  },

  getDailyProgress(): Record<string, string[]> {
    return get<Record<string, string[]>>(KEYS.DAILY_PROGRESS, {});
  },
  markTodayCompleted(id: string): Record<string, string[]> {
    const today = new Date().toISOString().slice(0, 10);
    const progress = this.getDailyProgress();
    const todayList = progress[today] || [];
    if (todayList.includes(id)) return progress;
    progress[today] = [...todayList, id];
    set(KEYS.DAILY_PROGRESS, progress);
    return progress;
  },
  getTodayCompleted(): string[] {
    const today = new Date().toISOString().slice(0, 10);
    return this.getDailyProgress()[today] || [];
  },
  getTodayCount(): number {
    return this.getTodayCompleted().length;
  },

  getReflections(): { text: string; date: string }[] {
    return get(KEYS.REFLECTIONS, []);
  },
  addReflection(text: string) {
    const refls = this.getReflections();
    refls.unshift({ text, date: new Date().toISOString().slice(0, 10) });
    set(KEYS.REFLECTIONS, refls);
  },
  clearReflections() {
    set(KEYS.REFLECTIONS, []);
  },

  clearAll() {
    Object.values(KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        /* ignore */
      }
    });
  },
};
