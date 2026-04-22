import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Post from '../Post/Post';
import PostLoading from '../Post/PostLoading';
import getRandomNumber from '../../utils/getRandomNumber';
import {
  fetchPosts,
  postsToLoad,
  setSearchTerm,
  fetchComments,
  searchPosts,
  toggleShowingComments,
} from '../../store/redditslice'
import './Main.css';

const Main = () => {
  const reddit = useSelector((state) => state.reddit);
  const { isLoading, error, searchTerm, selectedSubreddit } = reddit;
  const posts = useSelector(postsToLoad);
  const dispatch = useDispatch();

  useEffect(() => {
    const promise = dispatch(fetchPosts(selectedSubreddit));
    return () => {
      promise.abort();
    };
  }, [dispatch, selectedSubreddit]);

  useEffect(() => {
    if (!searchTerm) return;

    const promise = dispatch(searchPosts(searchTerm));

    return () => {
      promise.abort();
    };
  }, [dispatch, searchTerm]);



    const onToggleComments = (index) => {
      return (permalink) => {
        dispatch(toggleShowingComments(index));
        dispatch(fetchComments({ index, permalink }));
      };
    };

  
  

  if (isLoading) {
    const loadingPlaceholders = Array.from({ length: getRandomNumber(3, 10) }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <PostLoading />
      </motion.div>
    ));

    return (
      <div className="loading-container">
        <AnimatePresence>
          {loadingPlaceholders}
        </AnimatePresence>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Failed to load posts.</h2>
        <button
          type="button"
          onClick={() => dispatch(fetchPosts(selectedSubreddit))}
        >
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="error">
        <h2>No posts matching "{searchTerm}"</h2>
        <button type="button" onClick={() => dispatch(setSearchTerm(''))}>
          Go home
        </button>
      </div>
    );
  }

  return (
    <>
      {posts.map((post, index) => (
        <Post
          key={post.id}
          post={post}
          onToggleComments={onToggleComments(index)}
        />
      ))}
    </>
  );
};

export default Main;
