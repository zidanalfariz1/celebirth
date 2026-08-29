import "server-only";
import fs from "fs";
import path from "path";

export type Memory = {
  id: string;
  image_url: string;
  caption: string | null;
};

const MEMORIES_DIR = path.join(process.cwd(), "public", "memories");
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp"];

export function getMemories(): Memory[] {
  if (!fs.existsSync(MEMORIES_DIR)) return [];

  const files = fs
    .readdirSync(MEMORIES_DIR)
    .filter((file) => ALLOWED_EXT.includes(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return files.map((file) => ({
    id: file,
    image_url: `/memories/${file}`,
    caption: null,
  }));
}