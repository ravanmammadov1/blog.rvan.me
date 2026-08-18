import {
  evaluateContrast,
  calcAPCA,
  calcWcagRatio,
  hexToRgb,
  generateTypographyMatrix,
  CONTRAST_PRESETS
} from '../src/lib/accessibility/apcaEngine.ts';

console.log('=== VALIDATING DETERMINISTIC APCA 0.98G & WCAG 2.1 ENGINE ===\n');

let allPassed = true;

// Test 1: Black on White (Normal Polarity: Dark on Light)
const blackOnWhite = evaluateContrast('#000000', '#FFFFFF');
console.log(`1. Black on White: Lc = ${blackOnWhite.lc} (Expected ≈ +106), Polarity: ${blackOnWhite.polarity}, WCAG = ${blackOnWhite.wcag.formattedRatio}`);
if (blackOnWhite.lc >= 105 && blackOnWhite.lc <= 107 && blackOnWhite.polarity === 'normal' && blackOnWhite.wcag.ratio === 21) {
  console.log('   ✅ Black on White passed benchmark');
} else {
  console.error('   ❌ Black on White failed benchmark');
  allPassed = false;
}

// Test 2: White on Black (Reverse Polarity: Light on Dark)
const whiteOnBlack = evaluateContrast('#FFFFFF', '#000000');
console.log(`2. White on Black: Lc = ${whiteOnBlack.lc} (Expected ≈ -108), Polarity: ${whiteOnBlack.polarity}, WCAG = ${whiteOnBlack.wcag.formattedRatio}`);
if (whiteOnBlack.lc <= -107 && whiteOnBlack.lc >= -109 && whiteOnBlack.polarity === 'reverse' && whiteOnBlack.wcag.ratio === 21) {
  console.log('   ✅ White on Black passed benchmark');
} else {
  console.error('   ❌ White on Black failed benchmark');
  allPassed = false;
}

// Test 3: Pure Blue on White (#0000FF on #FFFFFF)
// Classic demonstration where WCAG 2.1 gives 8.59:1 (Passing AAA), but APCA gives Lc ~ 87
const blueOnWhite = evaluateContrast('#0000FF', '#FFFFFF');
console.log(`3. Pure Blue on White: Lc = ${blueOnWhite.lc}, WCAG = ${blueOnWhite.wcag.formattedRatio}`);
if (blueOnWhite.wcag.ratio >= 8.5 && blueOnWhite.absLc >= 80) {
  console.log('   ✅ Pure Blue on White passed benchmark');
} else {
  console.error('   ❌ Pure Blue on White failed benchmark');
  allPassed = false;
}

// Test 4: Low Contrast Pair (#71717A on #18181B)
const lowContrast = evaluateContrast('#71717A', '#18181B');
console.log(`4. Muted Grey on Dark: Lc = ${lowContrast.lc}, Rating = ${lowContrast.rating.label}, WCAG = ${lowContrast.wcag.formattedRatio}`);

// Test 5: Typography Matrix Grid Shape
const matrix = generateTypographyMatrix(whiteOnBlack.absLc);
console.log(`5. Typography Matrix: ${matrix.length} sizes x ${matrix[0].length} weights`);
if (matrix.length === 7 && matrix[0].length === 5) {
  console.log('   ✅ Matrix dimensions verified (7x5)');
} else {
  console.error('   ❌ Matrix dimensions failed');
  allPassed = false;
}

// Test 6: Presets Validation
console.log(`\n6. Validating ${CONTRAST_PRESETS.length} presets:`);
CONTRAST_PRESETS.forEach(p => {
  const ev = evaluateContrast(p.fg, p.bg);
  console.log(`   - ${p.name.padEnd(38)} -> Lc: ${ev.lc.toString().padStart(6)} | Rating: ${ev.rating.label.padEnd(24)} | WCAG: ${ev.wcag.formattedRatio}`);
});

console.log('\n========================================');
console.log(allPassed ? '🎉 APCA & WCAG MATHEMATICAL VALIDATION PASSED!' : '❌ VALIDATION FAILED');
console.log('========================================');
