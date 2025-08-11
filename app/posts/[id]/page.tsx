import { getPostById } from "@/lib/posts";
import CommentsSection from "@/components/CommentsSection";

export default async function SinglePostPage({ params }: { params: Promise < { id: string } >}) {
  const resolvedParams = await params;  // wait for params to resolve
  const id = resolvedParams.id; 
  const post = await getPostById((await params).id);

  if (!post) {
    return <div className="p-6">Post not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {post.date} • {post.author}
      </p>
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {/* CommentsSection is a client component */}
      <CommentsSection postId={post.id} />
    </div>
  );
}