import { analyzePersuasion, PERSUASION_PRESETS } from '../src/lib/marketing/persuasionEngine.ts';

console.log('=== VALIDATING PERSUASION & MARKETING ANALYZER ENGINE ===\n');

let allPassed = true;

// Test 1: Empty input handling
const emptyRes = analyzePersuasion('', 'headline');
console.log(`1. Empty Input: score = ${emptyRes.overallScore}, dimensions count = ${emptyRes.dimensions.length}`);
if (emptyRes.overallScore === 0 && emptyRes.wordCount === 0) {
  console.log('   ✅ Empty input gracefully handled');
} else {
  console.error('   ❌ Empty input failed');
  allPassed = false;
}

// Test 2: High-converting headline
const strongPreset = PERSUASION_PRESETS.find(p => p.id === 'saas-hero-strong');
const strongRes = analyzePersuasion(strongPreset.text, strongPreset.type);
console.log(`2. High Converting Headline: "${strongPreset.text}" -> Score: ${strongRes.overallScore} (${strongRes.ratingTier.label})`);
if (strongRes.overallScore >= 70 && strongRes.ratingTier.level === 'strong' || strongRes.ratingTier.level === 'exceptional') {
  console.log('   ✅ Strong copy accurately scored high');
} else {
  console.error('   ❌ Strong copy score too low');
  allPassed = false;
}

// Test 3: Vague corporate headline
const vaguePreset = PERSUASION_PRESETS.find(p => p.id === 'vague-corporate-hero');
const vagueRes = analyzePersuasion(vaguePreset.text, vaguePreset.type);
console.log(`3. Vague Fluff Headline: "${vaguePreset.text}" -> Score: ${vagueRes.overallScore} (${vagueRes.ratingTier.label})`);
if (vagueRes.overallScore < strongRes.overallScore && vagueRes.vagueWordsDetected.length >= 3) {
  console.log(`   ✅ Vague copy detected ${vagueRes.vagueWordsDetected.length} fluff words and scored lower`);
} else {
  console.error('   ❌ Vague copy scoring failed');
  allPassed = false;
}

// Test 4: Friction CTA
const frictionPreset = PERSUASION_PRESETS.find(p => p.id === 'cta-high-friction');
const frictionRes = analyzePersuasion(frictionPreset.text, frictionPreset.type);
console.log(`4. High Friction CTA: "${frictionPreset.text}" -> Score: ${frictionRes.overallScore}, Friction words: ${frictionRes.frictionWordsDetected.join(', ')}`);
if (frictionRes.frictionWordsDetected.length >= 1) {
  console.log('   ✅ Friction words successfully identified');
} else {
  console.error('   ❌ Friction words failed to detect');
  allPassed = false;
}

// Test 5: Special characters & Unicode
const specialRes = analyzePersuasion('🔥 Save $1,200/mo & Double Your Reach with 1-Click Automation! (100% Free)', 'headline');
console.log(`5. Special Characters: Score: ${specialRes.overallScore}, Word count: ${specialRes.wordCount}, Power words: ${specialRes.powerWordsDetected.join(', ')}`);
if (specialRes.wordCount >= 8 && specialRes.overallScore >= 75) {
  console.log('   ✅ Special characters and metrics handled cleanly');
} else {
  console.error('   ❌ Special characters failed');
  allPassed = false;
}

console.log('\n========================================');
console.log(allPassed ? '🎉 PERSUASION ENGINE TEST PASSED!' : '❌ PERSUASION ENGINE FAILED');
console.log('========================================');
