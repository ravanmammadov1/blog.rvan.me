import { PortableText } from "@portabletext/react";

import { BlogPost } from "../../../types/blog";
import portableTextComponents from "./PortableTextComponents";

interface BlogContentProps {
  post: BlogPost;
}

export default function BlogContent({ post }: BlogContentProps) {
  return (
    <div className="w-full">
      <div className="prose dark:prose-invert prose-lg max-w-none text-foreground leading-relaxed">
        {Array.isArray(post.body) && post.body.length > 0 ? (
          <PortableText
            value={post.body}
            components={portableTextComponents}
          />
        ) : typeof post.body === "string" && post.body.trim() ? (
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        ) : (
          <p className="text-muted-foreground italic">No content available for this article.</p>
        )}
      </div>
    </div>
  );
}