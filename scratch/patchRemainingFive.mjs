import { createClient } from "@sanity/client";

const token = "skqxIS8YhYqY9jyUT327FyNAY9f5Yfd5AyD7ZVBipyqRTNximGZyXws2YVj8Kohbxz0MTC61poqCOok5m";

const client = createClient({
  projectId: "0lqwkcmg",
  dataset: "production",
  apiVersion: "2025-01-01",
  token: token,
  useCdn: false,
});

function createBlock(text, style = "normal", key = Math.random().toString(36).substring(7)) {
  return {
    _key: key,
    _type: "block",
    style,
    markDefs: [],
    children: [{ _key: `${key}-c`, _type: "span", marks: [], text }],
  };
}

const MASTER_39_BLOGS = [
  // 1. VISUAL HIERARCHY
  {
    _id: "blog-visual-hierarchy-masterclass",
    title: "Why Do Your Eyes Look at Certain Things First?",
    title_az: "Gözlərimiz Niyə İlk Olaraq Müəyyən Elementlərə Baxır?",
    slug: "why-eyes-look-at-certain-things-first",
    slug_az: "gozler-niye-ilk-baxir",
    category: "Design Psychology",
    category_az: "Dizayn Psixologiyası",
    excerpt: "The science of visual hierarchy: How human biology, evolutionary survival reflexes, and scanning patterns dictate where our attention lands in the first 50 milliseconds.",
    excerpt_az: "Vizual iyerarxiya elmi: İnsan biologiyası, təkamül refleksləri və skan etmə nümunələri ilk 50 millisaniyədə diqqətimizi necə idarə edir.",
    readTime: "8 min read",
    featured: true,
    tags: ["Visual Hierarchy", "Design Psychology", "Eye Tracking", "UX Design", "Cognitive Science"],
    body: [
      createBlock("Why Do Your Eyes Look at Certain Things First?", "h2"),
      createBlock("Before you consciously decide to read a headline, analyze an image, or click a button, your visual cortex has already made hundreds of subconscious decisions. Within the first 50 milliseconds of landing on a webpage or viewing a poster, your brain processes spatial layout, luminance contrast, and dominant focal points. This is not accidental—it is the direct consequence of millions of years of evolutionary survival mechanisms applied to modern interface design."),
      createBlock("1. The 50-Millisecond Biological Filter", "h3"),
      createBlock("Human vision is not a camera that captures an entire scene with uniform clarity. Only the fovea centralis—a tiny 1.5mm region in the center of the retina—possesses the photoreceptor density required for sharp, high-resolution focus. Everything outside this narrow 2-degree cone is processed in low resolution by peripheral vision, tuned specifically to detect high contrast, motion, and sudden anomalies."),
      createBlock("When a user encounters a digital composition, their peripheral vision scans the canvas for contrast anchors. Elements with high luminance contrast, large physical scale, or human faces trigger immediate saccadic eye movements. Designers who understand this biological filter do not ask users to search; they command the subconscious eye to land on the primary focal point instantly."),
      createBlock("2. The Gutenberg Diagram and Western Reading Gravity", "h3"),
      createBlock("In cultures that read left-to-right and top-to-bottom, visual processing follows a predictable path termed Reading Gravity. First described by Gutenberg, this natural eye flow moves from the Primary Optical Area (top-left) diagonally across the page toward the Terminal Area (bottom-right)."),
      createBlock("When design elements align with reading gravity, cognitive friction drops to near zero. Placing critical value propositions in the top-left and primary calls-to-action (CTAs) in the terminal bottom-right creates a frictionless reading momentum that feels entirely natural to the reader."),
      createBlock("3. F-Patterns, Z-Patterns, and Visual Scanners", "h3"),
      createBlock("Pioneering eye-tracking research conducted by Nielsen Norman Group revealed that users rarely read web pages word-for-word. Instead, they scan in distinct geometric patterns:"),
      createBlock("• The F-Pattern: Common on text-dense editorial and documentation layouts. Users scan horizontally across the top headline, move down the left margin to read a shorter horizontal bar, and finally scan vertically down the left edge."),
      createBlock("• The Z-Pattern: Dominant on visual landing pages and promotional banners. The eye sweeps horizontally across the header, cuts diagonally across the central hero illustration, and completes its journey along the bottom CTA bar."),
      createBlock("4. The Six Levers of Visual Weight", "h3"),
      createBlock("To control the order in which information is digested, master designers manipulate six fundamental properties of visual weight:"),
      createBlock("1. Scale and Proportion: Larger elements command attention first, establishing the root node of the cognitive hierarchy."),
      createBlock("2. Luminance and Contrast: High-contrast elements against deep backgrounds trigger immediate retinal activation."),
      createBlock("3. Chromatic Isolation (The Von Restorff Effect): An accent color surrounded by neutral tones creates an unignorable anomaly."),
      createBlock("4. Spatial Proximity and Whitespace: Generous whitespace around an object isolates it, magnifying its perceived importance."),
      createBlock("5. Gaze Direction and Faces: Human beings are hardwired to look where other humans are looking. An image of a face gazing at a headline will reflexively cause the user to look at that exact headline."),
      createBlock("6. Depth and Layering: Drop shadows, z-index elevation, and blur gradients indicate priority in the third visual dimension."),
      createBlock("Conclusion: Designing for the Biological Eye", "h3"),
      createBlock("Mastering visual hierarchy is not about making headlines bigger or adding bright colors arbitrarily. It is about orchestrating an intentional visual journey where the viewer never has to wonder what to look at next. When hierarchy is executed with surgical precision, design ceases to be decoration and becomes effortless communication."),
    ],
  },

  // 2. TYPOGRAPHY / GOTHAM / LUXURY FONTS
  {
    _id: "blog-the-art-of-typographic-pairing",
    title: "Why Do Some Fonts Feel Expensive and Others Feel Cheap?",
    title_az: "Niyə Bəzi Şriftlər Bahalı, Bəziləri isə Ucuz Təsir Bağışlayır?",
    slug: "why-some-fonts-feel-expensive-gotham-typography",
    slug_az: "bahali-ve-ucuz-sriftler",
    category: "Typography",
    category_az: "Tipoqrafika",
    excerpt: "From Tobias Frere-Jones's New York architectural research to Obama's 2008 campaign: Why Gotham and high-end geometric typefaces convey power, luxury, and institutional trust.",
    excerpt_az: "Tobias Frere-Jones-un Nyu-York memarlıq araşdırmalarından Obama 2008 kampaniyasına qədər: Gotham və həndəsi şriftlər niyə lüks, etibar və siyasi güc aşılayır.",
    readTime: "11 min read",
    featured: true,
    tags: ["Gotham", "Typography", "Political Branding", "Luxury Design", "Font Psychology"],
    body: [
      createBlock("Why Do Some Fonts Feel Expensive and Others Feel Cheap?", "h2"),
      createBlock("When you walk past a luxury boutique like Chanel, Rolex, or Saint Laurent, you don't need to read the price tag to know the products inside cost thousands of dollars. The typography alone communicates authority, heritage, and refined taste. Conversely, poorly spaced lettering on a storefront immediately signals discount retail. Why does letterform geometry evoke such visceral psychological associations?"),
      createBlock("1. The Anatomy of Perceived Value", "h3"),
      createBlock("Typography communicates on two distinct channels simultaneously: the semantic channel (what the words say) and the visual-aesthetic channel (how the letterforms feel). Psychological studies in crossmodal correspondence demonstrate that high-contrast serifs with razor-thin hairlines (like Didot and Bodoni) are subconsciously associated with elegance, delicacy, and high fashion, while wide geometric sans-serifs convey structural solidity and institutional permanence."),
      createBlock("Cheap-feeling fonts often suffer from inconsistent stroke weight, crowded letter-spacing, or exaggerated decorative quirks that feel trendy rather than timeless. Expensive fonts, by contrast, exhibit mathematical harmony, disciplined optical kerning, and generous internal counter-spaces."),
      createBlock("2. The Story of Gotham: From Port Authority to the Presidency", "h3"),
      createBlock("To understand how a single typeface can reshape national perception, one must examine Gotham. Commissioned in 2000 by GQ magazine and designed by legendary type designer Tobias Frere-Jones, Gotham was born not from European modernism, but from the raw urban landscape of mid-20th-century New York City."),
      createBlock("Frere-Jones spent months walking through Manhattan, photographing vernacular signage on municipal buildings, warehouses, and the iconic Port Authority Bus Terminal. These signs were not drawn by trained typographers; they were engineered by draftsmen, lithographers, and stonecutters who favored plain, geometric, unembellished capitals."),
      createBlock("3. Why Do So Many U.S. Political Campaigns Use Gotham?", "h3"),
      createBlock("In 2008, the presidential campaign of Barack Obama made a historic design choice: they abandoned the traditional patriotic serif fonts (like Times New Roman and Century Schoolbook) and chose Gotham as the campaign's core typeface. The iconic 'HOPE' posters and 'CHANGE WE CAN BELIEVE IN' banners established a new visual language in political communication."),
      createBlock("Why did Gotham work so powerfully?"),
      createBlock("• Civic Authority without Elitism: Gotham feels institutional and strong, yet distinctly democratic and modern."),
      createBlock("• Architectural Stability: Its wide circular proportions and sturdy vertical stems project unshakeable confidence."),
      createBlock("• Bipartisan Neutrality: Because it evolved from American municipal architecture rather than corporate boardroom branding, it felt uniquely authentic and trustworthy."),
      createBlock("Following the success of the 2008 campaign, political campaigns and governmental bodies worldwide adopted Gotham and its geometric descendants, cementing its reputation as the visual voice of modern leadership."),
      createBlock("4. Tracking and Kerning: The Secret Sauce of Luxury", "h3"),
      createBlock("Even the most beautiful font will look cheap if it is improperly tracked. Luxury fashion houses (Balenciaga, Bottega Veneta, Saint Laurent) almost universally set their logotypes with generous tracking (letter-spacing: 0.15em to 0.3em). Wide tracking signals that the brand is not in a hurry—it possesses the luxury of space."),
      createBlock("Conclusion: Typeface as Character and Trust", "h3"),
      createBlock("Fonts are never neutral vessels. They carry the cultural DNA of the eras in which they were created. Choosing the right typeface is not merely an aesthetic preference; it is the deliberate construction of perceived value and institutional credibility."),
    ],
  },

  // 3. ICONOGRAPHY / NOTIFICATION BELL
  {
    _id: "blog-iconography-and-vector-precision",
    title: "Why Does the Notification Icon Look Like a Bell?",
    title_az: "Bildiriş İkonu Niyə Zəng Şəklindədir?",
    slug: "why-notification-icon-is-a-bell",
    slug_az: "bildiris-ikonu-niye-zengdir",
    category: "Design History",
    category_az: "Dizayn Tarixi",
    excerpt: "From physical church towers and town criers to modern mobile push alerts: The fascinating history of how physical objects became permanent digital visual metaphors.",
    excerpt_az: "Kilsə zənglərindən və qədim qapı zənglərindən müasir push bildirişlərinə: Fiziki əşyaların rəqəmsal vizual metaforalara çevrilməsinin heyranedici tarixi.",
    readTime: "9 min read",
    featured: true,
    tags: ["Iconography", "Skeuomorphism", "Design History", "Visual Metaphors", "UI Icons"],
    body: [
      createBlock("Why Does the Notification Icon Look Like a Bell?", "h2"),
      createBlock("Look at the top of your smartphone or browser screen right now. If you have unread messages or activity, you are greeted by a small icon shaped like a brass clapper bell. Why a bell? In an era where notifications are silent haptic pulses or glowing OLED badges, why do billions of people instantly recognize a medieval acoustic signaling instrument as a symbol for 'You have a new comment'?"),
      createBlock("1. The Acoustic Archetype: From Church Towers to Schoolyards", "h3"),
      createBlock("For thousands of years of human civilization, the bell was the sole technology capable of broadcasting urgent information over vast distances simultaneously. Church bells announced weddings, funerals, and daily time; tower bells warned of impending fires or invading armies; school bells dictated behavioral shifts; and dinner bells summoned workers from distant fields."),
      createBlock("The acoustic profile of a bell is unique: a sudden, high-energy transient spike that instantly cuts through ambient background noise, followed by an exponential decay. When human software engineers in the 1970s and 1980s needed a sensory prompt for urgent user interrupts, they programmed terminals to output an ASCII Control Character (ASCII 07) designated as '\\a' (Alert/Bell), which triggered an audible hardware bell inside early teletype machines."),
      createBlock("2. Skeuomorphism and the Graphic User Interface Revolution", "h3"),
      createBlock("When Xerox PARC, Apple, and Microsoft introduced graphical user interfaces (GUIs), designers faced a monumental challenge: how do you teach millions of office workers to operate an abstract digital computer?"),
      createBlock("The solution was Skeuomorphism—designing digital interface elements to look and behave like their physical office equivalents:"),
      createBlock("• The Notification Bell: Borrowed from the physical call-bell found on hotel reception desks."),
      createBlock("• The Floppy Disk: The universal symbol for 'Save', despite millions of Gen-Z users having never touched a 3.5-inch magnetic diskette."),
      createBlock("• The Paper Envelope: The universal symbol for digital email messages."),
      createBlock("• The Trash Can / Recycling Bin: The universal affordance for data deletion."),
      createBlock("• The Magnifying Glass: The universal visual metaphor for database search."),
      createBlock("• The Rotary Telephone Handset: The universal icon for digital voice calls."),
      createBlock("3. Semiotics: Why the Metaphor Outlived the Physical Object", "h3"),
      createBlock("In semiotic theory, a sign begins as an 'Icon' (a direct visual representation of a real object) and gradually evolves into a 'Symbol' (an abstract convention whose meaning is learned culturally). The floppy disk and the bell have crossed this semiotic threshold."),
      createBlock("Even a child who has never heard a physical town bell immediately understands that a bell badge with a red dot means 'New event'. The icon no longer represents the brass instrument; it represents the abstract concept of *Attention Required*."),
      createBlock("Conclusion: The Immortality of Good Visual Metaphors", "h3"),
      createBlock("Great iconography is not about drawing what an object is; it is about capturing what an action means. The bell endures because human psychology craves tangible physical anchors in an increasingly abstract digital world."),
    ],
  },

  // 4. FOMO / LOSS AVERSION
  {
    _id: "blog-after-effects-optimization-expressions-render-systems",
    title: "FOMO: Why People Want Things More When They Might Lose Them",
    title_az: "FOMO: İnsanlar İtirmək Qorxusu Olanda Niyə Daha Çox İstəyirlər?",
    slug: "fomo-loss-aversion-scarcity-psychology",
    slug_az: "fomo-itirmek-qorxusu-psixologiyasi",
    category: "Marketing Psychology",
    category_az: "Marketinq Psixologiyası",
    excerpt: "Daniel Kahneman's Loss Aversion theory and the cognitive mechanics of FOMO: Why the pain of losing $100 is twice as intense as the joy of winning $100.",
    excerpt_az: "Daniel Kahneman-ın İtkidən Qorxma Nəzəriyyəsi və FOMO-nun koqnitiv mexanizmləri: Niyə $100 itirməyin ağrısı, $100 qazanmağın sevincindən iki dəfə güclüdür.",
    readTime: "9 min read",
    featured: true,
    tags: ["FOMO", "Loss Aversion", "Behavioral Economics", "Pricing Psychology", "Conversion Optimization"],
    body: [
      createBlock("FOMO: Why People Want Things More When They Might Lose Them", "h2"),
      createBlock("Have you ever booked a hotel room in a panic because a glowing red banner flashed: 'Only 1 room left at this price!'? Or joined an invite-only app waitlist simply because you couldn't get in immediately? You were not making a purely rational economic calculation; you were responding to one of the most powerful psychological drivers in human biology: Loss Aversion."),
      createBlock("1. Kahneman and Tversky: The Asymmetry of Value", "h3"),
      createBlock("In their groundbreaking 1979 Prospect Theory, Nobel laureate Daniel Kahneman and Amos Tversky proved that the human brain does not weigh gains and losses equally. Experiment after experiment demonstrated that the psychological pain of losing $100 is approximately twice as intense as the pleasure of gaining $100."),
      createBlock("This asymmetry is evolutionary. In ancestral environments, a missed opportunity for extra food meant a missed bonus, but a failure to avoid a deadly predator meant death. Our nervous systems are literally wired to prioritize threat avoidance over reward capture."),
      createBlock("2. The Scarcity Trigger: 'Only 3 Left in Stock'", "h3"),
      createBlock("When an item is abundant, consumers evaluate it on its intrinsic merits (price, features, utility). The moment artificial or natural scarcity is introduced ('Limited Edition of 500', 'Offer expires in 12 hours'), cognitive evaluation shifts from utility to availability."),
      createBlock("Sociologist Jack Brehm termed this 'Psychological Reactance': whenever our freedom of choice is threatened or restricted, our desire to retain that freedom intensifies dramatically. An expiring deal threatens our future option to purchase, compelling immediate action."),
      createBlock("3. Ethical Urgency vs. Dark Patterns", "h3"),
      createBlock("While FOMO is a formidable conversion tool, abusive implementations (fake countdown timers that reset on page reload, fabricated '42 people are looking at this' popups) destroy long-term brand equity and invite regulatory scrutiny."),
      createBlock("Ethical scarcity leverages genuine operational constraints: limited cohort sizes in educational programs, true early-bird discount tiers, or seasonal product runs. When scarcity is genuine, urgency serves both the consumer and the creator."),
    ],
  },

  // 5. VISUAL METAPHOR / AIDA
  {
    _id: "blog-aida-framework-performance-creative-attention-action",
    title: "What Is Visual Metaphor and Why Does It Make Ads Easier to Remember?",
    title_az: "Vizual Metafora Nədir və Reklamları Niyə Yadda Qalan Edir?",
    slug: "what-is-visual-metaphor-advertising",
    slug_az: "vizual-metafora-ve-reklamlar",
    category: "Marketing Psychology",
    category_az: "Marketinq Psixologiyası",
    excerpt: "Why literal ads are forgotten in seconds while visual metaphors trigger mental closure and permanent memory encoding: Case studies from Apple, Heinz, and The Economist.",
    excerpt_az: "Niyə hərfi reklamlar saniyələr içində unudulur, vizual metaforalar isə beyində daimi yaddaş izi buraxır: Apple, Heinz və The Economist-dən real nümunələr.",
    readTime: "10 min read",
    featured: true,
    tags: ["Visual Metaphor", "Creative Advertising", "AIDA Framework", "Art Direction", "Brand Memorability"],
    body: [
      createBlock("What Is Visual Metaphor and Why Does It Make Ads Easier to Remember?", "h2"),
      createBlock("Consider two advertisements for a noise-canceling headphone:"),
      createBlock("Ad A displays a photo of the headphones with a bulleted list: 'Active Noise Cancellation, 40dB reduction, 30-hour battery life.'"),
      createBlock("Ad B shows an opera singer screaming with all her might directly into a passenger's ear on a crowded subway—except the passenger is blissfully sleeping wearing the headphones, undisturbed."),
      createBlock("Which ad do you remember six months later? Ad B, without question. This is the superpower of Visual Metaphor."),
      createBlock("1. The Mechanism of Mental Closure (Gestalt Inferences)", "h3"),
      createBlock("Literal advertising hands the viewer the conclusion on a silver platter. Because the brain does not have to expend any cognitive effort to decode it, the message passes through working memory and is instantly discarded."),
      createBlock("A visual metaphor, however, creates an intentional cognitive riddle. When the viewer sees an unexpected combination (like Heinz slicing a fresh tomato into the shape of a ketchup bottle), the brain performs a micro-second of cognitive puzzle-solving. When the meaning clicks, the brain releases a micro-dose of dopamine rewarding 'Mental Closure'. That pleasant realization anchors the memory deeply into long-term recall."),
      createBlock("2. The Evolution of the AIDA Framework", "h3"),
      createBlock("E. St. Elmo Lewis formulated the classic AIDA model in 1898: Attention, Interest, Desire, Action. In the modern visual economy saturated with 10,000 daily ad impressions, literal messaging fails at Step 1 (Attention). Visual metaphors satisfy all four stages simultaneously:"),
      createBlock("• Attention: The visual anomaly arrests thumb-scrolling behavior."),
      createBlock("• Interest: The riddle invites cognitive resolution."),
      createBlock("• Desire: The emotional benefit is dramatized rather than described."),
      createBlock("• Action: The brand name is cemented as the hero of the story."),
      createBlock("Conclusion: Show, Don't Tell", "h3"),
      createBlock("Do not state your product's benefit. Embody it in a striking visual contrast that respects the viewer's intelligence."),
    ],
  },
];

console.log(`Patching first 5 documents without invalid image references...`);
let count = 0;
for (const blog of MASTER_39_BLOGS) {
  try {
    const res = await client
      .patch(blog._id)
      .set({
        title: blog.title,
        title_az: blog.title_az,
        slug: { _type: "slug", current: blog.slug },
        slug_az: { _type: "slug", current: blog.slug_az },
        category: blog.category,
        category_az: blog.category_az,
        excerpt: blog.excerpt,
        excerpt_az: blog.excerpt_az,
        body: blog.body,
        body_az: blog.body,
        tags: blog.tags || [],
        featured: blog.featured || false,
        readTime: blog.readTime || "8 min read",
        publishDate: blog.publishDate || "2026-03-01",
        _updatedAt: new Date().toISOString(),
      })
      .commit();
    console.log(`  ✓ Successfully updated: ${res._id} | Title: "${res.title}"`);
    count++;
  } catch (e) {
    console.error(`  ✗ Error on ${blog._id}:`, e.message);
  }
}
console.log(`Patched ${count} of ${MASTER_39_BLOGS.length} documents!`);
