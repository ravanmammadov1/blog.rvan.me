const accessToken = "AQXVBs0HfrsrAEB48625xotsjhHHmWUl3dMkjClFkleHI0ftmIOJzSIL3xLispAO1_Pfra6tV0pi8ybNczWVpG8GUzF8Yi32qLk10T7ngoFqj5m3gp3a4UtJzhd0i5aMqIMZ3ubHdGoDj0zendaMAtVlzS6i32Oeok-tqETCkBzo7WYo34D58Aet8WMM0AtpqfV_MaH4gegqo90pEIFuL67w58WyZD6SlnvgLkoJB5eF4p8jXmdBh8aSx5Y2UvGR0GaAZYBxNdXy2-h1Qr53rBieYp2DQ4LI7VrRHsxrNj2JNYDcH1f77NB73AguThf72DjMIJIn-AjtvC--X2Duu0YpnKhsIA";
const memberUrn = "urn:li:person:lXgx4dR9RK";

const commentary = `Süni intellekt təkcə mətn yazmır və ya şəkil yaratmır — artıq biologiyanın və təbabətin gələcəyini yenidən formalaşdırır. 🧬

Alimlər generativ süni intellekt modellərindən istifadə edərək antibiotiklərə davamlı bakteriyaları məhv edən tam funksional biologiya strukturları dizayn ediblər. 

Bu nailiyyət təbii təkamülün milyonlarla ilə etdiyini AI modellərinin həftələr ərzində bacarması deməkdir. Generativ AI və biotexnologiyanın kəsişməsində yeni bir dövr başlayır.

Sizcə, yaxın illərdə süni intellektin təbabətdəki ən böyük töhfəsi nə olacaq?

#ArtificialIntelligence #Biotech #TechNews #Innovation #AI`;

const articleUrl = "https://www.theguardian.com/technology/2026/aug/02/ai-generative-biology-viruses-antibiotic-resistance";
const articleTitle = "AI Generative Biology Breakthrough in Medicine";

async function publishDirectToLinkedIn() {
  console.log("Publishing test post directly to LinkedIn API...");

  const postPayload = {
    author: memberUrn,
    commentary: commentary.trim(),
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
    content: {
      article: {
        source: articleUrl,
        title: articleTitle,
      },
    },
  };

  const response = await fetch("https://api.linkedin.com/v2/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202401",
    },
    body: JSON.stringify(postPayload),
  });

  const status = response.status;
  const postId = response.headers.get("x-restli-id") || "published";
  const text = await response.text();

  console.log(`LinkedIn API HTTP ${status}:`);
  console.log(`Post ID (x-restli-id): ${postId}`);
  console.log(`Response Body:`, text);
}

publishDirectToLinkedIn();
