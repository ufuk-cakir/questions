import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "questions.txt");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const questions = fileContent
      .split(/\d+\./)
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error reading questions file:", error);
    return NextResponse.json(
      { error: "Failed to read questions" },
      { status: 500 },
    );
  }
}
