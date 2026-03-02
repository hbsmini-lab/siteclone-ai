import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;
    const { url, prompt, name } = await req.json();

    let projectName = name || "Project v3.0";
    let normalizedUrl = url;

    if (url && !url.startsWith("http")) normalizedUrl = "https://" + url;

    // Hard Bypass for Testing/Admin
    const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
    const isAdmin = user?.role === "admin" || !userId; // Default to admin power if session is flaky

    let htmlContent = "";
    let screenshotBase64 = null;

    if (normalizedUrl) {
      console.log(`[v3.0 Clean] 🚀 Cloning: ${normalizedUrl}`);
      const puppeteer = await import("puppeteer");
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      try {
        await page.goto(normalizedUrl, { waitUntil: "networkidle2", timeout: 30000 });
        
        // v3.0 Simple Extraction: RAW HTML
        const rawHtml = await page.evaluate(() => document.documentElement.outerHTML);
        screenshotBase64 = await page.screenshot({ encoding: "base64", fullPage: false });

        console.log("[v3.0 Clean] 🧠 Asking GPT-4o to Clean & Reconstruct...");
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert web developer. Recreate the provided website as a single, clean, responsive HTML file. Use pure CSS in a <style> tag. Use Font-Awesome for icons. Ensure images use original URLs if available, otherwise placeholders. Return ONLY raw HTML code."
            },
            {
              role: "user",
              content: `URL: ${normalizedUrl}\n\nRAW HTML STRUCTURE:\n${rawHtml.substring(0, 80000)}`
            }
          ],
          temperature: 0.2
        });

        htmlContent = completion.choices[0]?.message?.content || "";
        htmlContent = htmlContent.replace(/```html\n?|```\n?/g, "").trim();
      } finally {
        await browser.close();
      }
    } else if (prompt) {
      // Basic AI Generation
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: `Generate a complete, beautiful, responsive HTML page for: ${prompt}` }],
      });
      htmlContent = gptResponse.choices[0]?.message?.content || "";
      htmlContent = htmlContent.replace(/```html\n?|```\n?/g, "").trim();
    }

    if (!htmlContent) throw new Error("Could not generate HTML.");

    // Save Thumbnail
    let thumbnailPath = null;
    if (screenshotBase64) {
      const fileName = `thumb_${Date.now()}.jpg`;
      const filePath = path.join(process.cwd(), "public", "thumbnails", fileName);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, Buffer.from(screenshotBase64, "base64"));
      thumbnailPath = `/thumbnails/${fileName}`;
    }

    // Save Project
    const project = await prisma.project.create({
      data: {
        name: projectName,
        sourceUrl: normalizedUrl || null,
        htmlContent,
        cssContent: "",
        userId: userId || (await prisma.user.findFirst({ where: { role: "admin" } }))?.id || "admin",
        thumbnail: thumbnailPath
      }
    });

    return NextResponse.json({ message: "Success", project: { id: project.id, name: project.name } });
  } catch (error: any) {
    console.error("[v3.0 Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
