import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ReactMarkdown from 'react-markdown';
import './Comment.css';
import { GiCharacter } from "react-icons/gi";

dayjs.extend(relativeTime);

const Comment = ({ comment }) => {
  const createdTime = dayjs.unix(comment.created_utc).fromNow();

  return (
    <div className="comment">
      <div className="comment-metadata">
        <p className="comment-author">
          <GiCharacter /> {comment.author}
        </p>
        <p className="comment-created-time">{createdTime}</p>
      </div>
      <div className='comment-text'>
        <ReactMarkdown>{comment.body}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Comment;
