const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  if (file.includes('globals.css')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  if (file.replace(/\\/g, '/').endsWith('app/page.tsx')) {
    const lines = content.split('\n');
    for (let i = 0; i < 80; i++) {
      lines[i] = lines[i].replace(/\bfont-mono\b\s*/g, '');
    }
    content = lines.join('\n');
  } else if (file.replace(/\\/g, '/').endsWith('components/navbar.tsx')) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (i >= 48 && i <= 55) continue;
      lines[i] = lines[i].replace(/\bfont-mono\b\s*/g, '');
    }
    content = lines.join('\n');
  } else {
    content = content.replace(/\bfont-mono\b\s*/g, '');
  }

  content = content.replace(/\s+"/g, '"');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
