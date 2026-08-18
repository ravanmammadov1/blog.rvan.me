import { calculateTypeScale, calculateComputedSize, MODULAR_SCALE_PRESETS } from '../src/lib/typography/typeScaleEngine.ts';

console.log('=== VALIDATING MATHEMATICAL TYPE SCALE ENGINE ===');

// 1. Test Default Configuration (Minor Third to Perfect Fourth)
const result = calculateTypeScale({
  minViewport: 375,
  maxViewport: 1280,
  minBaseFontSize: 16,
  maxBaseFontSize: 18,
  minScaleRatio: 1.200,
  maxScaleRatio: 1.333,
  rootFontSize: 16
});

console.log('Calculated Steps Count:', result.steps.length);
console.log('Generated Steps Overview:');
result.steps.forEach(s => {
  console.log(`- ${s.tag.padEnd(8)} | ${s.name.padEnd(10)} | ${s.minPx}px -> ${s.maxPx}px | ${s.clampCss}`);
});

// 2. Validate Linear Interpolation at key breakpoints for H1 (step 5)
const h1 = result.steps.find(s => s.tag === 'H1');
console.log('\nH1 Breakpoint Validation:');
[320, 375, 768, 1024, 1280, 1600].forEach(w => {
  const computed = calculateComputedSize(h1.minPx, h1.maxPx, 375, 1280, w);
  console.log(`  Viewport ${w}px -> H1 computed size: ${computed}px`);
});

// 3. Test Golden Ratio preset
const goldenPreset = MODULAR_SCALE_PRESETS.find(p => p.id === 'golden-ratio');
const goldenResult = calculateTypeScale({
  minViewport: 375,
  maxViewport: 1440,
  minBaseFontSize: 16,
  maxBaseFontSize: 20,
  minScaleRatio: 1.25,
  maxScaleRatio: goldenPreset.ratio,
  rootFontSize: 16
});

console.log('\nGolden Ratio Display Step:', goldenResult.steps[0].name, `${goldenResult.steps[0].minPx}px -> ${goldenResult.steps[0].maxPx}px`);

// 4. Test CSS Variables Output
console.log('\nGenerated CSS Variables:\n' + result.cssVariables);

// 5. Test Tailwind Config Output
console.log('\nGenerated Tailwind Config:\n' + result.tailwindConfig);
