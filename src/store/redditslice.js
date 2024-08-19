import { createSlice, createSelector } from '@reduxjs/toolkit';
//this is the API
import { getSubredditPosts, getPostComments, getSubredditsbySearch } from '../api/reddit';

const initialState = {
    posts: [],
    error: false,
    isLoading: false,
    searchTerm: '',
    selectedSubreddit: '/r/pics/',
  };
// Recall these are reducers. Reducers are used to take a dispatched action and change the state in the store.
  const redditSlice = createSlice({
    name: 'redditPosts',
    initialState,
    reducers: {
      setPosts(state, action) {
        state.posts = action.payload;
      },
      startGetPosts(state) {
        state.isLoading = true;
        state.error = false;
      },
      getPostsSuccess(state, action) {
        state.isLoading = false;
        state.posts = action.payload;
      },
      getPostsFailed(state) {
        state.isLoading = false;
        state.error = true;
      },
      //Questionable
      setSearchTerm(state, action) {
        state.searchTerm = action.payload;
      },
      setSelectedSubreddit(state, action) {
        state.selectedSubreddit = action.payload;
        state.searchTerm = '';
      },
      toggleShowingComments(state, action) {
        state.posts[action.payload].showingComments = !state.posts[action.payload]
          .showingComments;
      },
      startGetComments(state, action) {
        // If we're hiding comment, don't fetch the comments.
        state.posts[action.payload].showingComments = !state.posts[action.payload]
          .showingComments;
        if (!state.posts[action.payload].showingComments) {
          return;
        }
        state.posts[action.payload].loadingComments = true;
        state.posts[action.payload].error = false;
      },
      getCommentsSuccess(state, action) {
        state.posts[action.payload.index].loadingComments = false;
        state.posts[action.payload.index].comments = action.payload.comments;
      },
      getCommentsFailed(state, action) {
        state.posts[action.payload].loadingComments = false;
        state.posts[action.payload].error = true;
      },


    },
  });
  
  export const {
    setPosts,
    getPostsFailed,
    getPostsSuccess,
    startGetPosts,
    setSearchTerm,
    setSelectedSubreddit,
    toggleShowingComments,
    getCommentsFailed,
    getCommentsSuccess,
    startGetComments,
    setSubredditsbySearch,
    startGetSubredditsbySearch,
    getSubredditsbySearchSuccess,
    getSubredditsbySearchFailedl,
  } = redditSlice.actions;
  
  export default redditSlice.reducer;
  
  // This is a Redux Thunk that gets posts from a subreddit.
  export const fetchPosts = (subreddit) => async (dispatch) => {
    try {
      dispatch(startGetPosts());
      const posts = await getSubredditPosts(subreddit);
  
      // We are adding showingComments and comments as additional fields to handle showing them when the user wants to. We need to do this because we need to call another API endpoint to get the comments for each post.
      const postsWithMetadata = posts.map((post) => ({
        ...post,
        showingComments: false,
        comments: [],
        loadingComments: false,
        errorComments: false,
      }));
      dispatch(getPostsSuccess(postsWithMetadata));
    } catch (error) {
      dispatch(getPostsFailed());
    }
  };
  
  export const searchPosts = (searchTerm) => async (dispatch) => {
    try {
      dispatch(startGetPosts());
      const posts = await getSubredditsbySearch(searchTerm);
  
      // We are adding showingComments and comments as additional fields to handle showing them when the user wants to. We need to do this because we need to call another API endpoint to get the comments for each post.
      const postsWithMetadata = posts.map((post) => ({
        ...post,
        showingComments: false,
        comments: [],
        loadingComments: false,
        errorComments: false,
      }));
      dispatch(getPostsSuccess(postsWithMetadata));
    } catch (error) {
      dispatch(getPostsFailed());
    }
  };
  export const fetchComments = (index, permalink) => async (dispatch) => {
    try {
      dispatch(startGetComments(index));
      const comments = await getPostComments(permalink);
      dispatch(getCommentsSuccess({ index, comments }));
    } catch (error) {
      dispatch(getCommentsFailed(index));
    }
  };
  
  const selectPosts = (state) => state.reddit.posts;
  const selectSearchTerm = (state) => state.reddit.searchTerm;
  export const selectSelectedSubreddit = (state) =>
    state.reddit.selectedSubreddit;
  

    //Come back to this one.
    //This function I want to replace with a function that will
    //return posts from the given searchTerm
  export const postsToLoad = createSelector(
    [selectPosts, selectSearchTerm],
    (posts, searchTerm) => {
      if (searchTerm !== '') {
        return posts
      }
      return posts;
    }
  );

  // .filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
  











  /*     setSubredditsbySearch(state, action) {
    state.SubredditsbySearchTerm = action.payload;
  },
  startGetSubredditsbySearch(state) {
    state.isLoading = true;
    state.error = false;
  },
  getSubredditsbySearchSuccess(state, action) {
    state.isLoading = false;
    state.posts = action.payload;
  },
  getSubredditsbySearchFailed(state) {
    state.isLoading = false;
    state.error = true;
*/
