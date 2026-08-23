import fs from 'fs';
import path from 'path';

const routes = [
  './src/app/HomePage.tsx',
  './src/app/AboutPage.tsx',
  './src/app/ProfilePage.tsx',
  './src/app/pages/FounderProfilePage.tsx',
  './src/app/WorkArchive.tsx',
  './src/app/ProjectDetail.tsx',
  './src/app/ContactPage.tsx',
  './src/app/BlogArchive.tsx',
  './src/app/BlogDetail.tsx',
  './src/app/ToolsArchive.tsx',
  './src/app/pages/ToolDetailPage.tsx',
  './src/app/PrivacyPolicyPage.tsx',
  './src/app/CookiePolicyPage.tsx',
  './src/app/TermsPage.tsx',
  './src/app/ResourcesArchive.tsx',
  './src/app/ResourceDetail.tsx',
  './src/app/pages/AiToolArchivePage.tsx',
  './src/app/pages/OpportunityArchivePage.tsx',
  './src/app/pages/FontDetailPage.tsx',
  './src/app/LinkedInAdmin.tsx',
  './src/app/NotFound.tsx'
];

console.log('=== ROUTE COMPONENT VALIDATION ===');
routes.forEach(r => {
  if (!fs.existsSync(r)) {
    console.error('MISSING ROUTE FILE:', r);
    return;
  }
  const code = fs.readFileSync(r, 'utf8');
  const hasDefault = /export\s+default\s+/.test(code);
  if (!hasDefault) {
    console.error('NO DEFAULT EXPORT IN:', r);
  } else {
    console.log('OK:', r);
  }
});
