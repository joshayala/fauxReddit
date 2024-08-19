import { configureStore, combineReducers } from '@reduxjs/toolkit';
import redditReducer from './redditSlice';
import subRedditReducer from './subredditslice'
//The REDUX Store

const store = configureStore({
    reducer: combineReducers({
        // Add your reducers here
        reddit: redditReducer,
        subreddits: subRedditReducer,

    }),
});

export default store;
