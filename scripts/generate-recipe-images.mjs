#!/usr/bin/env node
// Generate 3 styled dish photos for a recipe via Gemini Nano Banana 2.
// Usage: node scripts/generate-recipe-images.mjs <slug> "<dish description>"

import { readFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const MODEL = "gemini-3.1-flash-image-preview";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const [, , slug, dishDescription] = process.argv;
if (!slug || !dishDescription) {
  console.error('Usage: node scripts/generate-recipe-images.mjs <slug> "<dish description>"');
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY not set");
  process.exit(1);
}

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const stylePrompt = `Food-forward clean photo of ${dishDescription}. The ceramic bowl is centered and fills at least 70% of the frame. Soft natural daylight, no dramatic lighting. Slight top-down angle (about 65-75°). Simple plain neutral surface — plain muted linen or simple plain countertop. Borrow the color palette, depth-of-field, and soft-warm tone from the reference photos, but DO NOT reproduce: stains, smears, hands, fingers, cutting boards, wood-grain planks, fussy prop arrangements, visible clutter, phones/people in frame. Also avoid the opposite extreme: no food-magazine styling, no studio lighting, no editorial overhead shots with scattered props, no decorative herbs flying, no dramatic steam. The goal is a clean, honest picture of the dish — like a friend texted a photo of their dinner bowl on a plain napkin. 4:3 aspect ratio.`;

async function loadRef(path) {
  const buf = await readFile(path);
  return { mimeType: "image/jpeg", data: buf.toString("base64") };
}

async function generateOne(refs, variant) {
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: `${stylePrompt}\n\nVariant ${variant} of 3 — vary the framing slightly from the other variants.` },
          { inlineData: refs[0] },
          { inlineData: refs[1] },
        ],
      },
    ],
    generationConfig: { responseModalities: ["IMAGE"] },
  };
  const res = await fetch(`${API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Gemini API ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (!part) {
    throw new Error(`No image returned for variant ${variant}: ${JSON.stringify(data).slice(0, 600)}`);
  }
  return Buffer.from(part.inlineData.data, "base64");
}

const refs = await Promise.all([
  loadRef(join(repoRoot, "public/images/babaganoush.jpeg")),
  loadRef(join(repoRoot, "public/images/hummus.jpeg")),
]);

const outDir = join(repoRoot, "public/images/candidates");
await mkdir(outDir, { recursive: true });

for (let i = 1; i <= 3; i++) {
  console.log(`Generating variant ${i}…`);
  const raw = await generateOne(refs, i);
  const outPath = join(outDir, `${slug}-${i}.jpg`);
  await sharp(raw)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true })
    .toFile(outPath);
  console.log(`Wrote ${outPath}`);
}
