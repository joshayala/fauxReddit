import React, { useState } from 'react';
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
import Avatar from '../Avatar/Avatar';

dayjs.extend(relativeTime);

const Post = (props) => {
  const [voteValue, setVoteValue] = useState(0);

  const { post, onToggleComments } = props;

  /**
   * Handle vote button clicks.
   * @param {number} newValue The new vote value.
   */
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
        <div>
          {post.comments.map((comment) => (
            <Comment comment={comment} key={comment.id} />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <article key={post.id}>
      <Card>
        <div className="post-wrapper">
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
            <h3 className="post-title">{post.title}</h3>

            <div className="post-image-container">
              <img src={post.url} alt={post.title} className="post-image" />
            </div>

            <div className="post-details">
              <span className="author-details">
                <Avatar name={post.author} />
                <span className="author-username">{post.author}</span>
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

            {renderComments()}
          </div>
        </div>
      </Card>
    </article>
  );
};

export default Post;
