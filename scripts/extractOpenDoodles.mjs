import fs from "fs";
import path from "path";
import { OPEN_DOODLE_SVGS } from "../src/lib/openDoodleSvgs.ts";

const doodlesDir = "C:\\Project\\ReplicateGitHubPortfolioSite-main\\public\\illustrations\\open-doodles";
fs.mkdirSync(doodlesDir, { recursive: true });

const DOODLE_MAP = {
  BalletDoodle: "ballet-dancer.svg",
  BikiniDoodle: "summer-vibes.svg",
  ChillingDoodle: "casual-chilling.svg",
  ClumsyDoodle: "clumsy-moment.svg",
  CoffeeDoodle: "coffee-break.svg",
  DancingDoodle: "dancing-freely.svg",
  DogJumpDoodle: "dog-jump.svg",
  DoggieDoodle: "walking-the-dog.svg",
  FloatDoodle: "cloud-floating.svg",
  GroovyDoodle: "groovy-beats.svg",
  IceCreamDoodle: "ice-cream-delight.svg",
  JumpingDoodle: "victory-jump.svg",
  LayingDoodle: "laying-down.svg",
  LevitateDoodle: "levitating-space.svg",
  LovingDoodle: "loving-heart.svg",
  MeditatingDoodle: "zen-meditation.svg",
  MoshingDoodle: "high-energy-moshing.svg",
  PettingDoodle: "petting-dog.svg",
  PlantDoodle: "watering-houseplant.svg",
  ReadingDoodle: "reading-book.svg",
  ReadingSideDoodle: "side-reading-study.svg",
  RollerSkatingDoodle: "roller-skating.svg",
  RollingDoodle: "playful-rolling.svg",
  RunningDoodle: "running-to-goal.svg",
  SelfieDoodle: "selfie-moment.svg",
  SittingDoodle: "relaxed-sitting.svg",
  SittingReadingDoodle: "armchair-reader.svg",
  SleekDoodle: "sleek-executive.svg",
  SprintingDoodle: "high-speed-sprint.svg",
  StrollingDoodle: "urban-stroll.svg",
  SwingingDoodle: "playground-swing.svg",
  UnboxingDoodle: "unboxing-delivery.svg",
  ZombieingDoodle: "late-night-coder.svg",
};

let count = 0;
for (const [key, filename] of Object.entries(DOODLE_MAP)) {
  let svg = OPEN_DOODLE_SVGS[key];
  if (svg) {
    // Replace accent with #61c5ad and ink with #ffffff
    svg = svg.replaceAll("__ACCENT__", "#61c5ad").replaceAll("__INK__", "#ffffff");
    fs.writeFileSync(path.join(doodlesDir, filename), svg, "utf8");
    count++;
  }
}

console.log(`Saved ${count} Open Doodles SVGs to ${doodlesDir}`);
