import path from "path";
import sharp from "sharp";

const svg = path.resolve("book.svg");

const targets = [
  // --- App / Platform icons ---
  { file: "assets/images/icon.png", size: 1024 },
  { file: "assets/images/android-icon-foreground.png", size: 1080 },
  { file: "assets/images/android-icon-background.png", size: 1080 },
  { file: "assets/images/android-icon-monochrome.png", size: 1080 },
  { file: "assets/images/splash-icon.png", size: 304 },
  { file: "assets/images/favicon.png", size: 512 },

  // --- Tab icons (32 / 64 / 96) ---
  { file: "assets/images/tabIcons/home.png", size: 32 },
  { file: "assets/images/tabIcons/home@2x.png", size: 64 },
  { file: "assets/images/tabIcons/home@3x.png", size: 96 },
  { file: "assets/images/tabIcons/explore.png", size: 32 },
  { file: "assets/images/tabIcons/explore@2x.png", size: 64 },
  { file: "assets/images/tabIcons/explore@3x.png", size: 96 },
];

for (const { file, size } of targets) {
  await sharp(svg, { density: 300 })
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(file);
  console.log(`✓ ${file}  (${size}×${size})`);
}

console.log("\nDone — all icons generated.");
