import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Cached<T> = { data: T | null; updatedAt: number | null };

export type CacheState = {
  config: Cached<any>;
  home: Cached<any>;
  legal: Cached<any>;
  events: Cached<any>;
};

const initialState: CacheState = {
  config: { data: null, updatedAt: null },
  home: { data: null, updatedAt: null },
  legal: { data: null, updatedAt: null },
  events: { data: null, updatedAt: null },
};

const cacheSlice = createSlice({
  name: "cache",
  initialState,
  reducers: {
    setCache(
      state,
      action: PayloadAction<{
        key: keyof CacheState;
        data: any;
        updatedAt?: number;
      }>
    ) {
      const { key, data, updatedAt } = action.payload;
      state[key] = { data, updatedAt: updatedAt ?? Date.now() };
    },
    clearCache(state, action: PayloadAction<keyof CacheState>) {
      state[action.payload] = { data: null, updatedAt: null };
    },
  },
});

export const { setCache, clearCache } = cacheSlice.actions;
export default cacheSlice.reducer;
