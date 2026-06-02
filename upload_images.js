#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = "https://rrdwvqafkiyhwxvnvhuq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZHd3cWFma2l5aHd4dm52aHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2Nzc0OTksImV4cCI6MjA5MjI1MzQ5OX0.clGzqNQToVkikeDgnEBjKVGeZCgq1wYS_JIuodFpCsQ";
const BUCKET_NAME = "products";

const products = {
  "dell-latitude-5420.png": { name: "Dell Latitude 5420", color: "#1f2937" },
  "hp-pavilion-15.png": { name: "HP Pavilion 15", color: "#3b82f6" },
  "lenovo-thinkpad-e14.png": { name: "Lenovo ThinkPad E14", color: "#ef4444" },
  "macbook-air-m1.png": { name: "MacBook Air M1", color: "#6b7280" },
  "asus-vivobook-15.png": { name: "ASUS VivoBook 15", color: "#10b981" },
  "hp-laserjet-pro-m404n.png": { name: "HP LaserJet Pro M404n", color: "#f59e0b" },
  "canon-pixma-ts3320.png": { name: "Canon Pixma TS3320", color: "#8b5cf6" },
  "epson-ecotank-l3150.png": { name: "Epson EcoTank L3150", color: "#06b6d4" },
  "brother-mfc-l2710dw.png": { name: "Brother MFC-L2710DW", color: "#ec4899" },
  "xerox-workcentre-3335.png": { name: "Xerox WorkCentre 3335", color: "#14b8a6" },
  "logitech-mx-master-3.png": { name: "Logitech MX Master 3", color: "#f97316" },
  "corsair-k95-rgb.png": { name: "Corsair K95 RGB", color: "#6366f1" },
  "samsung-ssd-870-evo-1tb.png": { name: "Samsung SSD 870 EVO 1TB", color: "#0ea5e9" },
  "wd-my-passport-2tb.png": { name: "WD My Passport 2TB", color: "#84cc16" },
  "jbl-quantum-400.png": { name: "JBL Quantum 400", color: "#d946ef" },
  "anker-powercore-20000.png": { name: "Anker PowerCore 20000", color: "#f43f5e" },
  "iphone-13.png": { name: "iPhone 13", color: "#000000" },
  "samsung-galaxy-s22.png": { name: "Samsung Galaxy S22", color: "#1f2937" },
  "xiaomi-redmi-note-11.png": { name: "Xiaomi Redmi Note 11", color: "#ea580c" },
  "oneplus-10-pro.png": { name: "OnePlus 10 Pro", color: "#d4af37" },
  "tecno-camon-19.png": { name: "Tecno Camon 19", color: "#7c3aed" },
  "nokia-g50.png": { name: "Nokia G50", color: "#0891b2" },
};

async function generateImage(filename, productData) {
  const svgString = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="${productData.color}"/>
      <text x="200" y="150" font-size="24" font-family="Arial, sans-serif" text-anchor="middle" fill="white" font-weight="bold">
        ${productData.name}
      </text>
    </svg>
  `;

  const outputDir = path.join(__dirname, '.temp-images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, filename);
  
  await sharp(Buffer.from(svgString))
    .png()
    .toFile(outputPath);
  
  return outputPath;
}

async function uploadImage(filename, filepath) {
  const fileBuffer = fs.readFileSync(filepath);
  
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${filename}`;
  const headers = {
    'authorization': `Bearer ${SUPABASE_KEY}`,
    'content-type': 'image/png',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: fileBuffer,
    });

    if (response.ok || response.status === 200) {
      console.log(`✓ Uploaded: ${filename}`);
      return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filename}`;
    } else {
      const text = await response.text();
      console.error(`✗ Failed to upload ${filename}: ${response.status} - ${text}`);
      return null;
    }
  } catch (error) {
    console.error(`✗ Error uploading ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("Starting image generation and upload...\n");

  const urlMappings = {};

  for (const [filename, productData] of Object.entries(products)) {
    try {
      // Generate image
      const filepath = await generateImage(filename, productData);
      console.log(`Generated: ${filename}`);

      // Upload image
      const publicUrl = await uploadImage(filename, filepath);
      if (publicUrl) {
        urlMappings[productData.name] = publicUrl;
      }

      // Clean up temp file
      fs.unlinkSync(filepath);
    } catch (error) {
      console.error(`Error processing ${filename}:`, error.message);
    }
  }

  // Clean up temp directory
  const tempDir = path.join(__dirname, '.temp-images');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
  }

  console.log("\n" + "=".repeat(60));
  console.log("Image processing complete!");
  console.log("=".repeat(60) + "\n");

  // Write mappings to JSON for SQL update
  const mappingFile = path.join(__dirname, 'url-mappings.json');
  fs.writeFileSync(mappingFile, JSON.stringify(urlMappings, null, 2));
  console.log(`URL mappings saved to: ${mappingFile}`);
}

main().catch(console.error);
