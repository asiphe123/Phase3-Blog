'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NewPostPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (status !== 'authenticated' || !session?.user?.name) {
      setError('You must be logged in to create a post');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          author: session.user.name,
          date: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || 'Failed to create post');
        setLoading(false);
        return;
      }

      // Redirect to posts 
      router.push('/posts');
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <p>Loading session...</p>;
  }

  if (status !== 'authenticated') {
    return <p>Please log in to create a post.</p>;
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
    <h1 className="text-xl mb-4 font-semibold text-center">Create New Post</h1>
    {error && <p className="text-red-600 mb-4">{error}</p>}

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-1 font-semibold">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Post title"
        />
      </div>

      <div>
        <label htmlFor="content" className="block mb-1 font-semibold">
          Content
        </label>
        <textarea
          id="content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 font-mono"
          placeholder="Write your post content here..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  </div>
  );
}