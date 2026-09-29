import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(express.json({ limit: '50mb' }));

app.post('/api/upload-car', (req, res) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: 'No data' });
    const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    fs.mkdirSync(path.join(__dirname, 'media/images'), { recursive: true });
    fs.writeFileSync(path.join(__dirname, 'media/images/IMG_0007.jpeg'), buffer);
    fs.writeFileSync(path.join(__dirname, 'media/images/audi.jpg'), buffer);

    const publicMedia = path.join(__dirname, 'public/media/images');
    if (fs.existsSync(publicMedia)) {
      fs.writeFileSync(path.join(publicMedia, 'IMG_0007.jpeg'), buffer);
      fs.writeFileSync(path.join(publicMedia, 'audi.jpg'), buffer);
    }
    return res.json({ success: true });
  } catch (err) {
    console.error('Error saving image:', err);
    return res.status(500).json({ error: 'Failed to save image' });
  }
});

// Serve static assets from project root
app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));

// Fallback to 404.html for any unhandled routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
