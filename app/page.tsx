import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen flex justify-center items-start p-6 bg-gray-50">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Posts</h1>

        <div className="flex justify-center mb-8">
          <Link
            href="/posts/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Create New Post
          </Link>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white"
            >
              <Link href={`/posts/${post.id}`}>
                <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                  {post.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-500">
                By <span className="font-medium">{post.author}</span> on{" "}
                {new Date(post.date).toLocaleDateString()}
              </p>
              {post.excerpt && (
                <p className="mt-2 text-gray-700">{post.excerpt}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}