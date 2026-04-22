import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSubreddits } from '../api/reddit';

const initialState = {
  subreddits: [],
  error: false,
  isLoading: false,
};

export const fetchSubreddits = createAsyncThunk(
  'subreddits/fetchSubreddits',
  async (_, { signal }) => {
    const subreddits = await getSubreddits({ signal });
    return subreddits;
  }
);

const subRedditSlice = createSlice({
  name: 'subreddits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubreddits.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(fetchSubreddits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subreddits = action.payload;
      })
      .addCase(fetchSubreddits.rejected, (state, action) => {
        if (action.error.name !== 'AbortError') {
          state.isLoading = false;
          state.error = true;
        }
      });
  },
});

export default subRedditSlice.reducer;

export const selectSubreddits = (state) => state.subreddits.subreddits;
