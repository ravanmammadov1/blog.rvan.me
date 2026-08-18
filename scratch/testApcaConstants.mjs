// Test exact APCA 0.98G constants

const sRco = 0.2126729;
const sGco = 0.7151522;
const sBco = 0.072175;

const normBG = 0.56;
const normTXT = 0.57;
const revTXT = 0.62;
const revBG = 0.65;

const blkThrs = 0.022;
const blkClmp = 1.414;
const scaleBoW = 1.14;
const scaleWoB = 1.14;
const offsetExp = 0.027;
const deltaYmin = 0.0005;

function sRGBtoY(rgb) {
  const rLin = Math.pow(rgb.r / 255.0, 2.4);
  const gLin = Math.pow(rgb.g / 255.0, 2.4);
  const bLin = Math.pow(rgb.b / 255.0, 2.4);

  let Y = sRco * rLin + sGco * gLin + sBco * bLin;

  if (Y < blkThrs) {
    Y += Math.pow(blkThrs - Y, blkClmp);
  }

  return Y;
}

function calcAPCA_test(txtRgb, bgRgb) {
  const yTxt = sRGBtoY(txtRgb);
  const yBg = sRGBtoY(bgRgb);

  if (Math.abs(yBg - yTxt) < deltaYmin) {
    return 0;
  }

  let outputLc = 0;

  if (yBg > yTxt) {
    // Normal Polarity: Dark text on Light BG (Black on White)
    const sBg = Math.pow(yBg, normBG);
    const sTxt = Math.pow(yTxt, normTXT);
    const sapca = (sBg - sTxt) * scaleBoW;
    outputLc = sapca > offsetExp ? (sapca - offsetExp) * 100 : 0;
  } else {
    // Reverse Polarity: Light text on Dark BG (White on Black)
    const sBg = Math.pow(yBg, revBG);
    const sTxt = Math.pow(yTxt, revTXT);
    const sapca = (sBg - sTxt) * scaleWoB;
    outputLc = sapca < -offsetExp ? (sapca + offsetExp) * 100 : 0;
  }

  return Math.round(outputLc * 10) / 10;
}

console.log('Black on White (#000 on #FFF):', calcAPCA_test({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }));
console.log('White on Black (#FFF on #000):', calcAPCA_test({ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 }));
console.log('Blue on White (#00F on #FFF):', calcAPCA_test({ r: 0, g: 0, b: 255 }, { r: 255, g: 255, b: 255 }));
console.log('Grey on White (#767676 on #FFF):', calcAPCA_test({ r: 118, g: 118, b: 118 }, { r: 255, g: 255, b: 255 }));
console.log('Grey on Dark (#71717A on #18181B):', calcAPCA_test({ r: 113, g: 113, b: 122 }, { r: 24, g: 24, b: 27 }));
