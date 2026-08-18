import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";

// Uses built-in PDF standard Type 1 fonts (Helvetica, Times-Roman, Courier) - 0 network dependency
interface ResumePdfProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
}

export const ResumePdfDocument: React.FC<ResumePdfProps> = ({ data, theme }) => {
  const { personalInfo, summary, experiences, education, skills, projects, certifications, languages, references } = data;
  const accent = theme.accentColor || "#111827";
  const density = theme.density || "standard";

  // Compute spacing & density metrics
  const pagePadding = density === "compact" ? 24 : density === "relaxed" ? 40 : 32;
  const sectionGap = density === "compact" ? 10 : density === "relaxed" ? 18 : 14;
  const itemGap = density === "compact" ? 4 : density === "relaxed" ? 8 : 6;
  const fontSizeBody = density === "compact" ? 9 : density === "relaxed" ? 10 : 9.5;
  const fontSizeHeading = density === "compact" ? 11 : density === "relaxed" ? 13 : 12;
  const fontSizeName = density === "compact" ? 18 : density === "relaxed" ? 22 : 20;

  const styles = StyleSheet.create({
    page: {
      padding: pagePadding,
      backgroundColor: "#ffffff",
      color: "#111827",
      fontSize: fontSizeBody,
      lineHeight: 1.35,
      fontFamily: "Helvetica",
    },
    // Top Header
    headerCenter: {
      textAlign: "center",
      marginBottom: sectionGap,
      borderBottomWidth: 1.5,
      borderBottomColor: accent,
      paddingBottom: 6,
    },
    headerLeft: {
      marginBottom: sectionGap,
      borderBottomWidth: 1.5,
      borderBottomColor: accent,
      paddingBottom: 6,
    },
    name: {
      fontSize: fontSizeName,
      fontWeight: "bold",
      color: "#0a0a0a",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    title: {
      fontSize: fontSizeBody + 1,
      fontWeight: "bold",
      color: accent,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    contactRow: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 6,
      fontSize: fontSizeBody - 1,
      color: "#4b5563",
    },
    contactRowLeft: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      fontSize: fontSizeBody - 1,
      color: "#4b5563",
    },
    // Section Styles
    section: {
      marginBottom: sectionGap,
      breakInside: "avoid",
    },
    sectionHeader: {
      fontSize: fontSizeHeading,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: accent,
      borderBottomWidth: 1,
      borderBottomColor: `${accent}40`,
      paddingBottom: 2,
      marginBottom: itemGap,
      letterSpacing: 0.5,
    },
    // Item Rows
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 2,
    },
    itemTitle: {
      fontWeight: "bold",
      fontSize: fontSizeBody,
      color: "#111827",
    },
    itemSubtitle: {
      fontStyle: "italic",
      color: "#374151",
      fontSize: fontSizeBody,
    },
    itemDate: {
      fontSize: fontSizeBody - 1.5,
      color: "#6b7280",
      fontWeight: "bold",
    },
    bulletList: {
      marginLeft: 10,
      marginTop: 2,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 2,
    },
    bulletDot: {
      width: 3,
      height: 3,
      backgroundColor: accent,
      borderRadius: 1.5,
      marginTop: 4,
      marginRight: 5,
    },
    bulletText: {
      flex: 1,
      fontSize: fontSizeBody - 0.5,
      color: "#374151",
      lineHeight: 1.3,
    },
    // 2-Column Layout
    twoColumnContainer: {
      flexDirection: "row",
      gap: 16,
    },
    colSidebar: {
      width: "35%",
    },
    colMain: {
      width: "65%",
    },
    // Skill tags
    skillRow: {
      flexDirection: "row",
      marginBottom: 3,
    },
    skillCategory: {
      fontWeight: "bold",
      width: 90,
      color: "#111827",
    },
    skillItems: {
      flex: 1,
      color: "#374151",
    },
  });

  const isTwoColumn =
    theme.template === "modern-cv" ||
    theme.template === "editorial-cv" ||
    theme.template === "quotation-cv" ||
    theme.template === "clean-modern-cv";

  const isSidebar = theme.template === "professional-cv";

  return (
    <Document title={`${personalInfo.fullName || "Resume"} - CV`} author="Rvan.me Studio">
      <Page size="A4" style={styles.page}>
        {/* ── HEADER ── */}
        <View style={isTwoColumn ? styles.headerLeft : styles.headerCenter}>
          <Text style={styles.name}>{personalInfo.fullName || "YOUR FULL NAME"}</Text>
          {personalInfo.title && <Text style={styles.title}>{personalInfo.title}</Text>}

          <View style={isTwoColumn ? styles.contactRowLeft : styles.contactRow}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>• {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>• {personalInfo.location}</Text>}
            {personalInfo.website && <Text>• {personalInfo.website.replace(/^https?:\/\//, "")}</Text>}
            {personalInfo.linkedin && <Text>• {personalInfo.linkedin.replace(/^https?:\/\//, "")}</Text>}
            {personalInfo.github && <Text>• {personalInfo.github.replace(/^https?:\/\//, "")}</Text>}
          </View>
        </View>

        {/* ── SUMMARY ── */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Professional Summary</Text>
            <Text style={{ color: "#374151", fontSize: fontSizeBody - 0.5, lineHeight: 1.35 }}>{summary}</Text>
          </View>
        )}

        {/* ── MAIN CONTENT (SINGLE OR 2-COLUMN) ── */}
        {isTwoColumn ? (
          <View style={styles.twoColumnContainer}>
            {/* Left Sidebar Column (Skills, Education, Languages) */}
            <View style={styles.colSidebar}>
              {/* Skills */}
              {skills.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Skills</Text>
                  {skills.map((cat, idx) => (
                    <View key={idx} style={{ marginBottom: 4 }}>
                      <Text style={{ fontWeight: "bold", fontSize: fontSizeBody - 0.5, color: "#111827" }}>{cat.name}:</Text>
                      <Text style={{ fontSize: fontSizeBody - 1, color: "#4b5563" }}>{cat.items.join(", ")}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Education */}
              {education.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Education</Text>
                  {education.map((edu, idx) => (
                    <View key={idx} style={{ marginBottom: itemGap }}>
                      <Text style={styles.itemTitle}>{edu.institution}</Text>
                      <Text style={styles.itemSubtitle}>{edu.degree} {edu.field ? `in ${edu.field}` : ""}</Text>
                      <Text style={styles.itemDate}>{edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ""}</Text>
                      {edu.gpa && <Text style={{ fontSize: fontSizeBody - 1.5, color: "#6b7280" }}>GPA: {edu.gpa}</Text>}
                    </View>
                  ))}
                </View>
              )}

              {/* Languages */}
              {languages && languages.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Languages</Text>
                  {languages.map((l, idx) => (
                    <Text key={idx} style={{ fontSize: fontSizeBody - 1, color: "#374151", marginBottom: 2 }}>
                      {l.language} ({l.proficiency})
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {/* Right Main Column (Work Experience & Projects) */}
            <View style={styles.colMain}>
              {/* Experience */}
              {experiences.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Experience</Text>
                  {experiences.map((exp, idx) => (
                    <View key={idx} style={{ marginBottom: itemGap }}>
                      <View style={styles.itemRow}>
                        <Text style={styles.itemTitle}>{exp.title}</Text>
                        <Text style={styles.itemDate}>{exp.startDate} — {exp.current ? "Present" : exp.endDate}</Text>
                      </View>
                      <Text style={styles.itemSubtitle}>{exp.company} {exp.location ? `— ${exp.location}` : ""}</Text>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <View style={styles.bulletList}>
                          {exp.bullets.map((b, bIdx) => (
                            <View key={bIdx} style={styles.bulletItem}>
                              <View style={styles.bulletDot} />
                              <Text style={styles.bulletText}>{b}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Projects */}
              {projects && projects.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Projects</Text>
                  {projects.map((proj, idx) => (
                    <View key={idx} style={{ marginBottom: itemGap }}>
                      <View style={styles.itemRow}>
                        <Text style={styles.itemTitle}>{proj.name}</Text>
                        {proj.techStack && proj.techStack.length > 0 && (
                          <Text style={{ fontSize: fontSizeBody - 1.5, color: accent }}>{proj.techStack.join(", ")}</Text>
                        )}
                      </View>
                      {proj.description && (
                        <Text style={{ fontSize: fontSizeBody - 0.5, color: "#4b5563" }}>{proj.description.join(" ")}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ) : (
          /* Single Column Clean Layout */
          <View>
            {/* Experience */}
            {experiences.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Work Experience</Text>
                {experiences.map((exp, idx) => (
                  <View key={idx} style={{ marginBottom: itemGap }}>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemTitle}>{exp.title} — <Text style={styles.itemSubtitle}>{exp.company}</Text></Text>
                      <Text style={styles.itemDate}>{exp.startDate} — {exp.current ? "Present" : exp.endDate}</Text>
                    </View>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <View style={styles.bulletList}>
                        {exp.bullets.map((b, bIdx) => (
                          <View key={bIdx} style={styles.bulletItem}>
                            <View style={styles.bulletDot} />
                            <Text style={styles.bulletText}>{b}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Education</Text>
                {education.map((edu, idx) => (
                  <View key={idx} style={{ marginBottom: itemGap }}>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemTitle}>{edu.institution}</Text>
                      <Text style={styles.itemDate}>{edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ""}</Text>
                    </View>
                    <Text style={styles.itemSubtitle}>{edu.degree} {edu.field ? `in ${edu.field}` : ""} {edu.gpa ? `(GPA: ${edu.gpa})` : ""}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Technical Skills */}
            {skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Skills & Competencies</Text>
                {skills.map((cat, idx) => (
                  <View key={idx} style={styles.skillRow}>
                    <Text style={styles.skillCategory}>{cat.name}:</Text>
                    <Text style={styles.skillItems}>{cat.items.join(", ")}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Key Projects */}
            {projects && projects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Key Projects</Text>
                {projects.map((proj, idx) => (
                  <View key={idx} style={{ marginBottom: itemGap }}>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemTitle}>{proj.name}</Text>
                      {proj.link && <Text style={styles.itemDate}>{proj.link.replace(/^https?:\/\//, "")}</Text>}
                    </View>
                    {proj.description && (
                      <Text style={{ fontSize: fontSizeBody - 0.5, color: "#374151" }}>{proj.description.join(" ")}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Certifications</Text>
                {certifications.map((c, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemTitle}>{c.name} — <Text style={styles.itemSubtitle}>{c.issuer}</Text></Text>
                    <Text style={styles.itemDate}>{c.date}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};
