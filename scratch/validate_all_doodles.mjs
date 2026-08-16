import React from "react";
import ReactDOMServer from "react-dom/server";
import * as OpenDoodles from "react-open-doodles";

const doodleKeys = [
  'BalletDoodle',         'BikiniDoodle',
  'ChillingDoodle',       'ClumsyDoodle',
  'CoffeeDoodle',         'DancingDoodle',
  'DogJumpDoodle',        'DoggieDoodle',
  'FloatDoodle',          'GroovyDoodle',
  'IceCreamDoodle',       'JumpingDoodle',
  'LayingDoodle',         'LevitateDoodle',
  'LovingDoodle',         'MeditatingDoodle',
  'MoshingDoodle',        'PettingDoodle',
  'PlantDoodle',          'ReadingDoodle',
  'ReadingSideDoodle',    'RollerSkatingDoodle',
  'RollingDoodle',        'RunningDoodle',
  'SelfieDoodle',         'SittingDoodle',
  'SittingReadingDoodle', 'SleekDoodle',
  'SprintingDoodle',      'StrollingDoodle',
  'SwingingDoodle',       'UnboxingDoodle',
  'ZombieingDoodle'
];

doodleKeys.forEach((key) => {
  const Comp = OpenDoodles[key];
  if (!Comp) throw new Error(`Missing ${key}`);
  const markup = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { accent: "#61c5ad", ink: "#000000" }));
  if (!markup.startsWith("<svg") || !markup.endsWith("</svg>")) {
    throw new Error(`Invalid SVG markup for ${key}`);
  }
});

console.log("All 33 Open Doodles rendered 100% valid SVG markup!");
