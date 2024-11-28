const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Icon sizes for different purposes
const sizes = {
  favicon: 32,
  small: 16,
  medium: 192,
  large: 512,
  apple: 180
};

async function generateIcons() {
  try {
    const sourceIcon = path.join(__dirname, '..', 'src', 'app', 'icon.png');
    
    // Generate different PNG sizes
    for (const [name, size] of Object.entries(sizes)) {
      const outputPath = path.join(publicDir, `icon-${size}.png`);
      if (name !== 'favicon') { // Skip favicon size as PNG
        await sharp(sourceIcon)
          .resize(size, size)
          .png()
          .toFile(outputPath);
        console.log(`✅ Generated ${path.basename(outputPath)}`);
      }
    }

    // Generate favicon.ico (includes both 16x16 and 32x32)
    const favicon32Buffer = await sharp(sourceIcon)
      .resize(32, 32)
      .toFormat('png')
      .toBuffer();
    
    const favicon16Buffer = await sharp(sourceIcon)
      .resize(16, 16)
      .toFormat('png')
      .toBuffer();

    const ico = require('png-to-ico');
    const icoBuffer = await ico([favicon32Buffer, favicon16Buffer]);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
    console.log('✅ Generated favicon.ico (16x16 and 32x32)');

    console.log('🎉 All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
