import {cp,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(root,'dist');
await mkdir(dist,{recursive:true});
for(const file of ['index.html','styles.css','data.js','app.js','assets'])await cp(path.join(root,file),path.join(dist,file),{recursive:true});
await writeFile(path.join(dist,'.nojekyll'),'');
console.log('Built dist/ — static files ready for GitHub Pages.');
