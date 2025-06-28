import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userName: string;
  roomNumber: string;
  languages: string[];
  _id: string;
  role: string;
}


const initialState: UserState = {
  userName: " ",
  roomNumber: "",
  languages: [],
  _id: "",
  role: ""
};


export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state._id = action.payload;
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    setRoomNumber: (state, action: PayloadAction<string>) => {
      state.roomNumber = action.payload;
    },
    addLanguage: (state, action: PayloadAction<string>) => {
      state.languages.push(action.payload);
    },
    removeLanguage: (state, action: PayloadAction<string>) => {
      state.languages = state.languages.filter(lang => {return lang !== action.payload;});
    },
    setLanguages: (state, action: PayloadAction<string[]>) => {
      state.languages = action.payload;
    },
  },
});

export const {
  setUserId,
  setUserRole,
  setUserName,
  setRoomNumber,
  addLanguage,
  removeLanguage,
  setLanguages,
} = userSlice.actions;

export default userSlice.reducer;