import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

interface Comment {
  postId: string;
  text: string;
  user: string;
  timestamp: string;
}

// Declare comments as an array of Comment objects
const comments: Comment[] = [];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (postId) {
    // Filter comments for the given postId
    const filteredComments = comments.filter(comment => comment.postId === postId);
    return NextResponse.json(filteredComments);
  }

  // Return all comments if no postId query param
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { postId, text, user } = body;

    if (!postId || !text || !user) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newComment: Comment = {
      postId,
      text,
      user,
      timestamp: new Date().toISOString(),
    };

    comments.push(newComment);
    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
  }
}