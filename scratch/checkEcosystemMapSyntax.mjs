import fs from 'fs';

// Let's restore and properly clean the ecosystem map
// We know exactly what 39 articles we have.
// Let's import MASTER_EDITORIAL_BLOGS and generate a clean, perfect relationship map!
import { MASTER_EDITORIAL_BLOGS } from '../src/lib/editorialBlogRegistry.ts';

console.log('Total master blogs:', MASTER_EDITORIAL_BLOGS.length);
for (const b of MASTER_EDITORIAL_BLOGS) {
  console.log(b.slug.current);
}
