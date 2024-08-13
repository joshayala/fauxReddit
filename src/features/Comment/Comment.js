import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ReactMarkdown from 'react-markdown';
import './Comment.css';
import Avatar from '../Avatar/Avatar';

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

const Comment = (props) => {
  const { comment } = props;

  // Convert the Unix timestamp to a dayjs object and format it
  const createdTime = dayjs.unix(comment.created_utc).fromNow();

  return (
    <div className="comment">
      <div className="comment-metadata">
        <Avatar name={comment.author} />
        <p className="comment-author">{comment.author}</p>
        <p className="comment-created-time">{createdTime}</p>
      </div>
      <ReactMarkdown>{comment.body}</ReactMarkdown>
    </div>
  );
};

export default Comment;
