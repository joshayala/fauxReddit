import React, { useState} from 'react';
import Skeleton from 'react-loading-skeleton';
import './Post.css';
import {
  TiArrowUpOutline,
  TiArrowUpThick,
  TiArrowDownOutline,
  TiArrowDownThick,
  TiMessage,
} from 'react-icons/ti';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import shortenNumber from '../../utils/shortenRandomNumber';
import Card from '../../components/Card/Card';
import Comment from '../Comment/Comment';
import { GiSpikedHalo } from "react-icons/gi";
import { useMediaQuery } from 'react-responsive';

dayjs.extend(relativeTime);

const Post = (props) => {
  const [voteValue, setVoteValue] = useState(0);
  const { post, onToggleComments } = props;
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1024px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });

  const onHandleVote = (newValue) => {
    setVoteValue(voteValue === newValue ? 0 : newValue);
  };

  const renderUpVote = () => (
    voteValue === 1 ? <TiArrowUpThick className="icon-action" /> : <TiArrowUpOutline className="icon-action" />
  );

  const renderDownVote = () => (
    voteValue === -1 ? <TiArrowDownThick className="icon-action" /> : <TiArrowDownOutline className="icon-action" />
  );

  const getVoteType = () => {
    if (voteValue === 1) return 'up-vote';
    if (voteValue === -1) return 'down-vote';
    return '';
  };

  const renderComments = () => {
    if (post.errorComments) {
      return <div><h3>Error loading comments</h3></div>;
    }

    if (post.loadingComments) {
      return (
        <div>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      );
    }

    if (post.showingComments) {
      return (
        <div className='comments-list'>
          {post.comments.map((comment) => (
            <Comment comment={comment} key={comment.id} />
          ))}
        </div>
      );
    }

    return null;
  };

  const displayImage = () => {
    if (post.url && (post.url.includes('jpeg') || post.url.includes('png') || post.url.includes('gif') || post.url.includes('jpg'))) {
      let imageUrl = post.url;
      if (isMobile) {
        imageUrl = `${post.url}?w=400`;
      } else if (isTablet) {
        imageUrl = `${post.url}?w=1200`;
      } else if (isDesktop) {
        imageUrl = `${post.url}?w=1800`;
      }

      return (
        <img
          src={imageUrl}
          className='post-image'
          alt={post.title}
          loading="lazy"
        />
      );
    } else {
      return null;
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const characterLimit = 350;

  const truncatedText = post.selftext.length > characterLimit
    ? post.selftext.substring(0, characterLimit) + "..."
    : post.selftext;

  return (
    <article key={post.id}>
      <Card>
        <div className="post-wrapper">
            <h3 className="post-title">{post.title}</h3>
          <div className="post-votes-container">
            <button
              type="button"
              className={`icon-action-button up-vote ${voteValue === 1 ? 'active' : ''}`}
              onClick={() => onHandleVote(1)}
              aria-label="Upvote"
            >
              {renderUpVote()}
            </button>

            <p className={`post-votes-value ${getVoteType()}`}>
              {shortenNumber(post.ups, 1)}
            </p>

            <button
              type="button"
              className={`icon-action-button down-vote ${voteValue === -1 ? 'active' : ''}`}
              onClick={() => onHandleVote(-1)}
              aria-label="Downvote"
            >
              {renderDownVote()}
            </button>
          </div>

          <div className="post-container">
            <div>
              <p>{isExpanded ? post.selftext : truncatedText}</p>
              {post.selftext.length > characterLimit && (
                <button onClick={() => setIsExpanded(!isExpanded)} className='readmore'>
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>

            <div className="post-image-container">
              {displayImage()}
            </div>

            <div className="post-details">
              <span className="author-details">
                <GiSpikedHalo />
                <span className="author-username"> - {post.author}</span>
              </span>
              <span>{dayjs.unix(post.created_utc).fromNow()}</span>
              <span className="post-comments-container">
                <button
                  type="button"
                  className={`icon-action-button ${post.showingComments ? 'showing-comments' : ''}`}
                  onClick={() => onToggleComments(post.permalink)}
                  aria-label="Show comments"
                >
                  <TiMessage className="icon-action" />
                </button>
                {shortenNumber(post.num_comments, 1)}
              </span>
            </div>
            <div>
            {renderComments()}
            </div>
          </div>
        </div>
      </Card>
    </article>
  );
};

export default Post;
