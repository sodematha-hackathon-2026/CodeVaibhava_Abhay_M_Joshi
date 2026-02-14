import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppLanguage } from "../../types/language";

export type AppState = {
  language: AppLanguage;
  lastSectionQuery: string;
};

const initialState: AppState = {
  language: "en",
  lastSectionQuery: "",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<"en" | "kn">) {
      state.language = action.payload;
    },
    setLastSectionQuery(state, action: PayloadAction<string>) {
      state.lastSectionQuery = action.payload;
    },
  },
});

export const { setLanguage, setLastSectionQuery } = appSlice.actions;
export default appSlice.reducer;
