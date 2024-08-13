import { configureStore } from '@reduxjs/toolkit';
import redditReducer from './redditslice';
//The REDUX Store

const store = configureStore({
    reducer: {
        // Add your reducers here
        reddit: redditReducer,
    },
});

export default store;
