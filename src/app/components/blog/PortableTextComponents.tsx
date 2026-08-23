import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { urlFor } from "../../../lib/sanityClient";

function CodeBlock({ value }: { value: any }) {
  const [copied, setCopied] = useState(false);
  const codeText = value.code || value.text || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-8 overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] p-5 font-mono text-sm">
      <div className="mb-3 flex items-center justify-between border-b border-white/15 pb-2 text-xs text-white/50">
        <span>{value.language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded bg-white/10 px-2.5 py-1 text-xs text-white transition hover:bg-white/20"
        >
          {copied ? (
            <>
              <Check size={13} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto text-white/90">
        <code>{codeText}</code>
      </pre>
    </div>
  );
}

function generateId(children: any) {
  const text = Array.isArray(children)
    ? children.map((c) => (typeof c === "string" ? c : c?.props?.text || "")).join("")
    : String(children || "");
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const imgUrlBuilder = urlFor(value);
      if (!imgUrlBuilder) return null;
      const src = imgUrlBuilder.width(1400).quality(90).url();
      if (!src) return null;

      return (
        <figure className="my-10">
          <img
            src={src}
             alt={value.alt || value.caption || "Editorial illustration"}
             width={1400}
             height={900}
            loading="lazy"
            className="w-full rounded-2xl object-cover shadow-2xl"
          />
          {value.caption && (
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    code: CodeBlock,
    codeBlock: CodeBlock,
    calloutBox: ({ value }: any) => {
      const type = value?.type || "insight";
      const isWarning = type === "warning";
      const isReference = type === "reference";
      const borderColor = isWarning
        ? "border-amber-500/30 bg-amber-500/5 text-amber-300"
        : isReference
        ? "border-purple-500/30 bg-purple-500/5 text-purple-300"
        : "border-primary/30 bg-primary/5 text-primary";

      return (
        <div className={`my-8 p-6 rounded-2xl border ${borderColor} backdrop-blur-sm`}>
          {value.title && (
            <h4 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
              {value.title}
            </h4>
          )}
          <p className="text-sm leading-relaxed text-foreground/90 font-medium">{value.text}</p>
        </div>
      );
    },
    divider: ({ value }: any) => {
      if (value?.style === "stars") {
        return (
          <div className="my-12 text-center text-xl tracking-[1em] text-muted-foreground select-none">
            ✦ ✦ ✦
          </div>
        );
      }
      return <hr className="my-12 border-white/10" />;
    },
  },

  block: {
    h1: ({ children }: any) => {
      const id = generateId(children);
      return (
        <h2 id={id} className="mt-14 mb-6 text-4xl font-black md:text-5xl scroll-mt-28 text-foreground">
          {children}
        </h2>
      );
    },

    h2: ({ children }: any) => {
      const id = generateId(children);
      return (
        <h2 id={id} className="mt-12 mb-5 text-3xl font-bold md:text-4xl scroll-mt-28 text-foreground">
          {children}
        </h2>
      );
    },

    h3: ({ children }: any) => {
      const id = generateId(children);
      return (
        <h3 id={id} className="mt-10 mb-4 text-2xl font-semibold md:text-3xl scroll-mt-28 text-foreground">
          {children}
        </h3>
      );
    },

    h4: ({ children }: any) => {
      const id = generateId(children);
      return (
        <h4 id={id} className="mt-8 mb-3 text-xl font-bold scroll-mt-28 text-foreground">
          {children}
        </h4>
      );
    },

    normal: ({ children }: any) => (
      <p className="mb-6 text-lg leading-9 text-foreground/90 font-normal">
        {children}
      </p>
    ),

    blockquote: ({ children }: any) => (
      <blockquote className="my-10 border-l-4 border-primary pl-6 italic text-foreground/80">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }: any) => (
      <ul className="my-6 list-disc space-y-2 pl-6 text-foreground/90">
        {children}
      </ul>
    ),

    number: ({ children }: any) => (
      <ol className="my-6 list-decimal space-y-2 pl-6 text-foreground/90">
        {children}
      </ol>
    ),
  },

  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold text-foreground">
        {children}
      </strong>
    ),

    em: ({ children }: any) => (
      <em className="italic">
        {children}
      </em>
    ),

    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-4 hover:opacity-80"
      >
        {children}
      </a>
    ),
  },
};

export default portableTextComponents;
