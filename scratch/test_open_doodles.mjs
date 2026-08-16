import React from "react";
import ReactDOMServer from "react-dom/server";
import * as OpenDoodles from "react-open-doodles";

console.log("Exported keys from react-open-doodles:", Object.keys(OpenDoodles));

const Loving = OpenDoodles.LovingDoodle;
const markup = ReactDOMServer.renderToStaticMarkup(React.createElement(Loving, { accent: "#61c5ad", ink: "#ffffff" }));

console.log("Rendered Loving Doodle length:", markup.length);
console.log("Markup snippet:", markup.slice(0, 300));
