const fs = require('fs');
const path = require('path');

// Minimal 81x81 transparent PNG
const smallPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAAAOElEQVR42u3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcGRJNAAFFZMWIAAAAAElFTkSuQmCC',
  'base64'
);

// Minimal larger transparent PNG for cover
const coverPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAMgAAAEECAYAAABgHjDuAAAAPklEQVR42u3BAQ0AAADCoPdPbQ43IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7yI0FQAB89PFagAAAABJRU5ErkJggg==',
  'base64'
);

const dir = __dirname;
const icons = ['home', 'home-active', 'book', 'book-active', 'user', 'user-active'];

icons.forEach(name => {
  fs.writeFileSync(path.join(dir, name + '.png'), smallPng);
});

fs.writeFileSync(path.join(dir, 'default-cover.png'), coverPng);
fs.writeFileSync(path.join(dir, 'default-avatar.png'), smallPng);

console.log('Generated placeholder icons');
