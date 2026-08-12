import { PortableText } from "@portabletext/react";

import { BlogPost } from "../../../types/blog";
import portableTextComponents from "./PortableTextComponents";

interface BlogContentProps {
  post: BlogPost;
}

export default function BlogContent({ post }: BlogContentProps) {
  return (
    <article className="mx-auto mt-20 max-w-4xl">
      <div className="prose dark:prose-invert prose-lg max-w-none text-foreground">
        <PortableText
          value={post.body}
          components={portableTextComponents}
        />
      </div>
    </article>
  );
}