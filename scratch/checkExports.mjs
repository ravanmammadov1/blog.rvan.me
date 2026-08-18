import fs from 'fs';

const filesToCheck = [
  'src/app/BlogArchive.tsx',
  'src/app/BlogDetail.tsx',
  'src/app/ToolsArchive.tsx',
  'src/app/AboutPage.tsx',
  'src/app/ProfilePage.tsx',
  'src/app/pages/FounderProfilePage.tsx',
  'src/app/WorkArchive.tsx',
  'src/app/PrivacyPolicyPage.tsx',
  'src/app/CookiePolicyPage.tsx',
  'src/app/TermsPage.tsx',
  'src/app/ResourcesArchive.tsx',
  'src/app/ResourceDetail.tsx',
  'src/app/ProjectDetail.tsx',
  'src/app/pages/AiToolArchivePage.tsx',
  'src/app/pages/OpportunityArchivePage.tsx',
  'src/app/pages/ToolDetailPage.tsx',
  'src/app/pages/FontDetailPage.tsx',
  'src/app/LinkedInAdmin.tsx',
  'src/app/components/HeroPortrait.tsx',
  'src/app/components/HeroParticles.tsx',
  'src/app/components/home/BlogSection.tsx',
  'src/app/components/home/ResourcesSection.tsx',
  'src/app/components/home/ToolsSection.tsx',
  'src/app/components/home/ContactSection.tsx',
  'src/app/components/tools/OpenPeepsBuilder.tsx',
  'src/app/components/tools/ResumeBuilder.tsx',
  'src/app/components/tools/typography/TypographyScaleCalculator.tsx',
  'src/app/components/tools/contrast/ApcaContrastCalculator.tsx'
];

console.log('=== CHECKING LAZY LOADED COMPONENT EXPORTS ===\n');

filesToCheck.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log(`FILE NOT FOUND: ${f}`);
    return;
  }
  const content = fs.readFileSync(f, 'utf8');
  const hasDefault = /export\s+default\s+/.test(content);
  const named = [...content.matchAll(/export\s+(const|function|class)\s+([a-zA-Z0-9_]+)/g)].map(m => m[2]);
  console.log(f.padEnd(65), hasDefault ? '✅ DEFAULT' : '❌ NO DEFAULT EXPORT!', named.length > 0 ? `(Named: ${named.join(', ')})` : '');
});
