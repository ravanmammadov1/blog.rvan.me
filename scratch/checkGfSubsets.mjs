async function check() {
  try {
    const res = await fetch("https://fonts.google.com/metadata/fonts");
    const data = await res.json();
    console.log("Total Google Fonts families:", data.familyMetadataList?.length);
    
    const roboto = data.familyMetadataList.find((f) => f.family === "Roboto");
    const openSans = data.familyMetadataList.find((f) => f.family === "Open Sans");
    const inter = data.familyMetadataList.find((f) => f.family === "Inter");
    const playfair = data.familyMetadataList.find((f) => f.family === "Playfair Display");

    console.log("\nRoboto subsets:", roboto?.subsets);
    console.log("Open Sans subsets:", openSans?.subsets);
    console.log("Inter subsets:", inter?.subsets);
    console.log("Playfair Display subsets:", playfair?.subsets);

    const azSubsetFonts = data.familyMetadataList.filter((f) => f.subsets?.includes("azerbaijani"));
    console.log("\nFonts with explicit 'azerbaijani' subset in Google Fonts:", azSubsetFonts.length);
    console.log("Samples:", azSubsetFonts.slice(0, 15).map((f) => f.family));

    const latinExtFonts = data.familyMetadataList.filter((f) => f.subsets?.includes("latin-ext"));
    console.log("Fonts with 'latin-ext' subset in Google Fonts:", latinExtFonts.length);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

check();
