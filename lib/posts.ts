import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export interface Post {
  id: string;
  title: string;
  date: string;
  author: string;
  excerpt ?: string;
  contentHtml: string;
  contentMarkdown: string;
}

const postsDir = path.join(process.cwd(), "posts");
export async function markdownToHtml(markdown: string): Promise<string> {
  return marked.parse(markdown);
}
export async function getAllPosts(): Promise<Post[]> {
  const filenames = fs.readdirSync(postsDir);

  const posts = await Promise.all(
    filenames.map(async (filename) => {
      const filePath = path.join(postsDir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      
      const { data, content } = matter(fileContents);

      return {
        id:filename.replace(/\.md$/, ""),
        title: data.title,
        date: data.date,
        author: data.author,
        contentHtml: marked.parse(content) as string,
        contentMarkdown: content,
        excerpt: data.excerpt || "",
      };
    })
  );

  return posts;
}

// Get a single post by id
export async function getPostById(id: string): Promise<Post | null> {
  const filePath = path.join(postsDir, `${id}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    id,
    title: data.title || "Untitled",
    date: data.date || "",
    author: data.author || "Unknown",
    contentHtml: marked.parse(content) as string,
    contentMarkdown: content,
  };
}