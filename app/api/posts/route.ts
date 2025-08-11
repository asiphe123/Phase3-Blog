import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getAllPosts } from "@/lib/posts";

const postsDirectory = path.join(process.cwd(), "posts");

// GET: Return list of all posts metadata
export async function GET() {
  const posts = getAllPosts();
  return NextResponse.json(posts);
}

// POST: Create new post file from JSON data
export async function POST(req: NextRequest) {
  try {
    const { title, content, author, date } = await req.json();

    if (!title || !content || !author || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a simple slug ID based on the title and date
    const id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") + "-" + date.slice(0,10);

    const filename = `${id}.md`;
    const filePath = path.join(postsDirectory, filename);

    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Post with this title and date already exists" }, { status: 409 });
    }

    // Prepare markdown content with frontmatter
    const markdownContent = `---
title: "${title}"
date: "${date}"
author: "${author}"
---

${content}
`;

    // Write file to posts directory
    fs.writeFileSync(filePath, markdownContent);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}