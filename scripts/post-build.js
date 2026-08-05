import fs from 'fs';
import path from 'path';

const dirs = ['.output/public', 'dist', 'build'];

for (const dir of dirs) {
  const fullPath = path.resolve(dir);
  if (fs.existsSync(fullPath)) {
    const indexPath = path.join(fullPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      const fallbackPath = path.join(fullPath, '404.html');
      fs.copyFileSync(indexPath, fallbackPath);
      fs.writeFileSync(path.join(fullPath, '.nojekyll'), '# Disable Jekyll\n');
      console.log(`[post-build] Created 404.html and .nojekyll in ${dir}`);
    }
  }
}
