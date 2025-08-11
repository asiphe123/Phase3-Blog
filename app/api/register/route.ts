import { NextResponse } from "next/server";
import { addUser, findUserByEmail } from "@/lib/users";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const existing = findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  addUser({ id: uuidv4(), name, email, password }); // In real apps, hash the password!

  return NextResponse.json({ message: "User registered successfully" });
}