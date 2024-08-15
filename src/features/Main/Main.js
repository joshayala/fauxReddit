import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Post from '../Post/Post';
import PostLoading from '../Post/PostLoading';
import getRandomNumber from '../../utils/getRandomNumber';
import {
  fetchPosts,
  selectFilteredPosts,
  setSearchTerm,
  fetchComments,
} from '../../store/redditSlice'
import './Main.css';

const Main = () => {
  const reddit = useSelector((state) => state.reddit);
  const { isLoading, error, searchTerm, selectedSubreddit } = reddit;
  const posts = useSelector(selectFilteredPosts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts(selectedSubreddit));
  }, [selectedSubreddit]);

  const onToggleComments = (index) => {
    const getComments = (permalink) => {
      dispatch(fetchComments(index, permalink));
    };

    return getComments;
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
