import React from "react";
import ReactDOMServer from "react-dom/server";
import * as OpenDoodles from "react-open-doodles";

function renderOpenDoodleSvg(doodleKey, accentColor = "#61c5ad", inkColor = "#ffffff") {
  const Comp = OpenDoodles[doodleKey] || OpenDoodles.LovingDoodle;
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(Comp, { accent: accentColor, ink: inkColor })
  );
}

const svg1 = renderOpenDoodleSvg("LovingDoodle", "#61c5ad", "#ffffff");
const svg2 = renderOpenDoodleSvg("MeditatingDoodle", "#ef4444", "#ffffff");
const svg3 = renderOpenDoodleSvg("RollerSkatingDoodle", "#3b82f6", "#ffffff");

console.log("SVG1 starts with:", svg1.slice(0, 80));
console.log("SVG1 ends with:", svg1.slice(-20));
console.log("SVG2 length:", svg2.length);
console.log("SVG3 length:", svg3.length);
