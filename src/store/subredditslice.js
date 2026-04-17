import { createSlice } from "@reduxjs/toolkit";
import { getSubreddits } from "../api/reddit";

const initialState = {
  subreddits: [],
  error: false,
  isLoading: false,
};

const subRedditSlice = createSlice({
  name: "subreddits",
  initialState,
  reducers: {
    startGetSubreddits(state) {
      state.isLoading = true;
      state.error = false;
    },
    getSubredditsSuccess(state, action) {
      state.isLoading = false;
      state.subreddits = action.payload;
    },
    getSubredditsFailed(state) {
      state.isLoading = false;
      state.error = true;
    },
  },
});

export const { getSubredditsFailed, getSubredditsSuccess, startGetSubreddits } =
  subRedditSlice.actions;

export default subRedditSlice.reducer;

// This is a Redux Thunk that gets subreddits.
let fetchSubredditsController;
export const fetchSubreddits = () => async (dispatch) => {
  if (fetchSubredditsController) fetchSubredditsController.abort();
  fetchSubredditsController = new AbortController();
  const { signal } = fetchSubredditsController;
  try {
    dispatch(startGetSubreddits());
    const subreddits = await getSubreddits({ signal });
    dispatch(getSubredditsSuccess(subreddits));
  } catch (error) {
    if (error.name !== "AbortError") dispatch(getSubredditsFailed());
  }
};

export const selectSubreddits = (state) => state.subreddits.subreddits;
