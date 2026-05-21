import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = './public/images';
const QUALITY = 60; // Good balance of quality vs size
const MAX_WIDTH = 1920; // Max width for hero backgrounds

async function compressImages() {
  const files = fs.readdirSync(IMAGES_DIR).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));
  
  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    if (stats.size < 500 * 1024) {
      console.log(`⏭️  Skipping ${file} (${sizeMB}MB - already small)`);
      continue;
    }
    
    console.log(`🔄 Compressing ${file} (${sizeMB}MB)...`);
    
    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();
      
      let pipeline = sharp(filePath);
      
      // Resize if wider than MAX_WIDTH
      if (metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        });
      }
      
      // Compress to WebP
      const outputPath = filePath.replace(/\.(webp|jpg|jpeg|png)$/i, '.compressed.webp');
      await pipeline
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(outputPath);
      
      const newStats = fs.statSync(outputPath);
      const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);
      
      // Replace original
      fs.unlinkSync(filePath);
      const finalPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      fs.renameSync(outputPath, finalPath);
      
      const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);
      console.log(`✅ ${file}: ${sizeMB}MB → ${newSizeMB}MB (${savings}% smaller)`);
    } catch (err) {
      console.error(`❌ Error compressing ${file}:`, err.message);
    }
  }
  
  // Also compress public root images
  const rootImages = ['illura.png', 'Qwen.png', 'qwenhover.png', 'qwenwhite.png', 'About.jpg'].filter(f => 
    fs.existsSync(path.join('./public', f))
  );
  
  for (const file of rootImages) {
    const filePath = path.join('./public', file);
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    if (stats.size < 50 * 1024) {
      console.log(`⏭️  Skipping ${file} (${sizeMB}MB - already small)`);
      continue;
    }
    
    console.log(`🔄 Compressing ${file} (${sizeMB}MB)...`);
    
    try {
      const outputPath = filePath + '.compressed.webp';
      await sharp(filePath)
        .resize(800, null, { withoutEnlargement: true, fit: 'inside' })
        .webp({ quality: 75, effort: 6 })
        .toFile(outputPath);
      
      const newStats = fs.statSync(outputPath);
      const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);
      
      // Keep original for compatibility, but note the savings
      fs.unlinkSync(outputPath);
      console.log(`ℹ️  ${file}: Could save ${sizeMB}MB → ${newSizeMB}MB (keeping original for now)`);
    } catch (err) {
      console.error(`❌ Error with ${file}:`, err.message);
    }
  }
  
  console.log('\n🎉 Image compression complete!');
}

compressImages();
