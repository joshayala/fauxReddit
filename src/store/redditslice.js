import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {
  getSubredditPosts,
  getPostComments,
  getSubredditsbySearch,
} from '../api/reddit';

export const fetchPosts = createAsyncThunk(
  'redditPosts/fetchPosts',
  async (subreddit, { signal }) => {
    const posts = await getSubredditPosts(subreddit, { signal });
    return posts.map((post) => ({
      ...post,
      showingComments: false,
      comments: [],
      loadingComments: false,
      errorComments: false,
    }));
  }
);

export const searchPosts = createAsyncThunk(
  'redditPosts/searchPosts',
  async (searchTerm, { signal }) => {
    const posts = await getSubredditsbySearch(searchTerm, { signal });
    return posts.map((post) => ({
      ...post,
      showingComments: false,
      comments: [],
      loadingComments: false,
      errorComments: false,
    }));
  }
);

export const fetchComments = createAsyncThunk(
  'redditPosts/fetchComments',
  async ({ index, permalink }, { signal }) => {
    const comments = await getPostComments(permalink, { signal });
    return { index, comments };
  },
  {
    condition: ({ index }, { getState }) => {
      const state = getState();
      if (!state.reddit.posts[index].showingComments) {
        return false;
      }
      return true;
    },
  }
);

const initialState = {
  posts: [],
  error: false,
  isLoading: false,
  searchTerm: '',
  selectedSubreddit: '/r/pics/',
};

const redditSlice = createSlice({
  name: 'redditPosts',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setSelectedSubreddit(state, action) {
      state.selectedSubreddit = action.payload;
      state.searchTerm = '';
    },
    toggleShowingComments(state, action) {
      const index = action.payload;
      state.posts[index].showingComments = !state.posts[index].showingComments;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        if (action.error.name !== 'AbortError') {
          state.isLoading = false;
          state.error = true;
        }
      })
      // searchPosts
      .addCase(searchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        if (action.error.name !== 'AbortError') {
          state.isLoading = false;
          state.error = true;
        }
      })
      // fetchComments
      .addCase(fetchComments.pending, (state, action) => {
        const { index } = action.meta.arg;
        state.posts[index].loadingComments = true;
        state.posts[index].error = false;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { index, comments } = action.payload;
        state.posts[index].loadingComments = false;
        state.posts[index].comments = comments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        if (action.error.name !== 'AbortError') {
          const { index } = action.meta.arg;
          state.posts[index].loadingComments = false;
          state.posts[index].errorComments = true;
        }
      });
  },
});

export const { setSearchTerm, setSelectedSubreddit, toggleShowingComments } =
  redditSlice.actions;

export default redditSlice.reducer;

const selectPosts = (state) => state.reddit.posts;
const selectSearchTerm = (state) => state.reddit.searchTerm;
export const selectSelectedSubreddit = (state) =>
  state.reddit.selectedSubreddit;

export const postsToLoad = createSelector(
  [selectPosts, selectSearchTerm],
  (posts, searchTerm) => {
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      return posts.filter(
        (post) =>
          (post.title && post.title.toLowerCase().includes(lowerSearch)) ||
          (post.selftext && post.selftext.toLowerCase().includes(lowerSearch))
      );
    }
    return posts;
  }
);
