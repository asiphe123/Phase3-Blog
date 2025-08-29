'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Comment {
  postId: string;
  text: string;
  user: string;
  timestamp: string;
}

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = '/api/proxyComments'; 

 
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`${API_BASE}?postId=${postId}`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        const data: Comment[] = await res.json();
        setComments(data);
      } catch (err) {
        console.error('Fetch comments error:', err);
        setError('Failed to load comments');
      }
    }
    fetchComments();
  }, [postId]);

  // Submit new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedComment = newComment.trim();
    const username = session?.user?.name;

   
    if (!trimmedComment) {
      setError('Comment cannot be empty');
      return;
    }
    if (!username) {
      setError('You must be logged in to post a comment');
      return;
    }
    if (!postId) {
      setError('Post ID is missing');
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting comment:', { postId, text: trimmedComment, user: username });

      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          text: trimmedComment,
          user: username,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to post comment');
      }

      const data = await res.json();
      console.log('Comment submitted:', data);

      setComments(prev => [...prev, data.comment]);
      setNewComment('');
    } catch (err: unknown) {
      console.error('Error submitting comment:', err);
      if (err instanceof Error) {
        setError(err.message || 'Error submitting comment');
      } else {
        setError('Error submitting comment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment, i) => (
            <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-sm text-gray-600 mb-1">{comment.user}</p>
              <p className="text-gray-800">{comment.text}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none"
          placeholder="Write your comment..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}