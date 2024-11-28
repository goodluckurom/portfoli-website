const sharp = require('sharp');
const path = require('path');

// Generate apple-icon.png (180x180)
sharp(path.join(__dirname, '..', 'src', 'app', 'icon.png'))
  .resize(180, 180)
  .toFile(path.join(__dirname, '..', 'src', 'app', 'apple-icon.png'))
  .then(() => console.log('✅ Generated apple-icon.png'))
  .catch(err => console.error('Error:', err));
