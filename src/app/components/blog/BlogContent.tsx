import { PortableText } from "@portabletext/react";

import { BlogPost } from "../../../types/blog";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import portableTextComponents from "./PortableTextComponents";

interface BlogContentProps {
  post: BlogPost;
}

export default function BlogContent({ post }: BlogContentProps) {
  const { language } = useLanguage();
  const activeBody = language === "az" && post.body_az ? post.body_az : (post.body || post.body_az);

  return (
    <div className="w-full">
      <div className="prose dark:prose-invert prose-lg max-w-none text-foreground leading-relaxed">
        {Array.isArray(activeBody) && activeBody.length > 0 ? (
          <PortableText
            value={activeBody}
            components={portableTextComponents}
          />
        ) : typeof (activeBody as any) === "string" && (activeBody as any).trim() ? (
          <div dangerouslySetInnerHTML={{ __html: activeBody as any }} />
        ) : (
          <p className="text-muted-foreground italic">No content available for this article.</p>
        )}
      </div>
    </div>
  );
}