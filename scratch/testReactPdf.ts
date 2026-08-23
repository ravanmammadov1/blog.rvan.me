import React from "react";
import { pdf, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10 },
  heading: { fontSize: 24, fontWeight: "bold" },
  text: { fontSize: 12 },
});

const MyDoc = () => (
  React.createElement(Document, {},
    React.createElement(Page, { size: "A4", style: styles.page },
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.heading }, "Alex Doe — Resume"),
        React.createElement(Text, { style: styles.text }, "Senior Full-Stack Engineer")
      )
    )
  )
);

async function run() {
  console.log("Generating PDF with @react-pdf/renderer...");
  const blob = await pdf(React.createElement(MyDoc)).toBlob();
  console.log("Generated PDF blob size:", blob.size, "bytes");
  console.assert(blob.size > 500, "PDF blob should be > 500 bytes");
  console.log("✅ @react-pdf/renderer test passed!");
}

run().catch(console.error);
