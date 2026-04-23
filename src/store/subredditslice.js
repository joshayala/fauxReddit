import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { getSubreddits } from '../api/reddit';

const loadFavorites = () => {
  try {
    const favorites = localStorage.getItem('subreddit_favorites');
    if (favorites) {
      return JSON.parse(favorites);
    }
  } catch (error) {
    console.error('Failed to load favorites from localStorage', error);
  }
  return [];
};

const saveFavorites = (favorites) => {
  try {
    localStorage.setItem('subreddit_favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites to localStorage', error);
  }
};

const initialState = {
  subreddits: [],
  error: false,
  isLoading: false,
  searchTerm: '',
  favorites: loadFavorites(),
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
  reducers: {
    setSubredditSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    toggleFavorite(state, action) {
      const subredditUrl = action.payload;
      if (state.favorites.includes(subredditUrl)) {
        state.favorites = state.favorites.filter((url) => url !== subredditUrl);
      } else {
        state.favorites.push(subredditUrl);
      }
      saveFavorites(state.favorites);
    },
  },
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

export const { setSubredditSearchTerm, toggleFavorite } =
  subRedditSlice.actions;

export default subRedditSlice.reducer;

const selectAllSubreddits = (state) => state.subreddits.subreddits;
const selectSubredditSearchTerm = (state) => state.subreddits.searchTerm;
export const selectFavorites = (state) => state.subreddits.favorites;

export const selectFilteredAndSortedSubreddits = createSelector(
  [selectAllSubreddits, selectSubredditSearchTerm, selectFavorites],
  (subreddits, searchTerm, favorites) => {
    // Determine whether to filter by search term
    let filteredSubreddits = subreddits;
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      filteredSubreddits = subreddits.filter((subreddit) =>
        subreddit.display_name.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort such that favorites appear first.
    return [...filteredSubreddits].sort((a, b) => {
      const aIsFav = favorites.includes(a.url);
      const bIsFav = favorites.includes(b.url);

      if (aIsFav && !bIsFav) return -1;
      if (!aIsFav && bIsFav) return 1;
      // Secondary sorting: alphabetize within groups
      return a.display_name.localeCompare(b.display_name);
    });
  }
);
