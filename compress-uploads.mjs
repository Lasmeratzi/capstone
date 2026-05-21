import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = './backend/uploads/artwork';
const QUALITY = 50; 
const MAX_WIDTH = 1200; 

async function compressUploads() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log('Uploads directory not found');
    return;
  }

  const files = fs.readdirSync(UPLOADS_DIR).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));
  console.log(`Found ${files.length} artworks to check...`);

  for (const file of files) {
    const filePath = path.join(UPLOADS_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeMB = stats.size / (1024 * 1024);

    if (sizeMB > 1) { // Only compress if larger than 1MB
      console.log(`🔄 Compressing ${file} (${sizeMB.toFixed(2)}MB)...`);
      const tempPath = filePath + '.temp.webp';
      
      try {
        await sharp(filePath)
          .resize(MAX_WIDTH, null, { withoutEnlargement: true, fit: 'inside' })
          .webp({ quality: QUALITY, effort: 6 })
          .toFile(tempPath);

        const newStats = fs.statSync(tempPath);
        if (newStats.size < stats.size) {
          // In the real world, we might want to keep the original and have a thumbnail
          // but for this capstone lighthouse fix, we replace the original to save bandwidth immediately.
          // Note: This might change the file extension to .webp but keep the name.
          // To be safe for the existing API, we'll keep the original filename but change the content.
          
          fs.unlinkSync(filePath);
          fs.renameSync(tempPath, filePath);
          console.log(`✅ ${file}: ${sizeMB.toFixed(2)}MB → ${(newStats.size / (1024 * 1024)).toFixed(2)}MB`);
        } else {
          fs.unlinkSync(tempPath);
          console.log(`⏭️  Compression didn't help for ${file}`);
        }
      } catch (err) {
        console.error(`❌ Error compressing ${file}:`, err.message);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    }
  }
  console.log('🎉 Backend uploads compression complete!');
}

compressUploads();
