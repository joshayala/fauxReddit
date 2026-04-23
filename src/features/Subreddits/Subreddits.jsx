import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../components/Card/Card';
import { 
  fetchSubreddits, 
  selectFilteredAndSortedSubreddits,
  selectFavorites,
  setSubredditSearchTerm,
  toggleFavorite
} from '../../store/subredditslice';
import './Subreddits.css';
import {
  setSelectedSubreddit,
  selectSelectedSubreddit,
} from '../../store/redditslice';
import { FaStar, FaRegStar } from 'react-icons/fa';

 const Subreddits = () => {
  const dispatch = useDispatch();
  const subreddits = useSelector(selectFilteredAndSortedSubreddits);
  const selectedSubreddit = useSelector(selectSelectedSubreddit);
  const favorites = useSelector(selectFavorites);
  
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const onSearchTermChange = (e) => {
    setLocalSearchTerm(e.target.value);
    dispatch(setSubredditSearchTerm(e.target.value));
  };

  useEffect(() => {
    const promise = dispatch(fetchSubreddits());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  return (
    <Card className="subreddit-card">
      <h2>Subreddits</h2>
      <div className="subreddit-search">
        <input 
          type="text" 
          placeholder="Filter subreddits" 
          value={localSearchTerm}
          onChange={onSearchTermChange}
          aria-label="Filter subreddits"
        />
      </div>
      <ul className="subreddits-list">
        {subreddits.map((subreddit) => (
          <li
            key={subreddit.id}
            className={`${
              selectedSubreddit === subreddit.url && `selected-subreddit`
            }`}
          >
            <div className="subreddit-item-container">
              <button
                type="button"
                className="subreddit-item-btn"
                onClick={() => dispatch(setSelectedSubreddit(subreddit.url))}
              >
                <img
                  src={
                    subreddit.icon_img ||  subreddit.header_img || subreddit.thumbnail || subreddit.community_icon || subreddit.banner_img||
                    `https://i.redd.it/t5366y1q680d1.png`
                  }
                  alt={`${subreddit.display_name}`}
                  className="subreddit-icon"
                  style={{ border: `3px solid ${subreddit.primary_color}` }}
                />
                {subreddit.display_name}
              </button>
              <button 
                type="button" 
                className="subreddit-favorite-btn"
                onClick={() => dispatch(toggleFavorite(subreddit.url))}
                title={favorites.includes(subreddit.url) ? "Remove from Favorites" : "Add to Favorites"}
              >
                {favorites.includes(subreddit.url) ? (
                  <FaStar className="star-icon-filled" />
                ) : (
                  <FaRegStar className="star-icon-outline" />
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default Subreddits;