import { useState } from "react";
import { Check, Link2, Share2, Twitter, Linkedin } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: currentUrl,
        });
      } catch (err) {
        console.warn("Share cancelled or failed:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="my-12 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-6">
      <span className="text-xs font-bold uppercase tracking-[.18em] text-white/50 mono">
        Share Article
      </span>

      <div className="flex flex-wrap items-center gap-3">
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white transition hover:bg-white/15"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>
        )}

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white transition hover:bg-white/15"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span className="text-green-400">Link Copied!</span>
            </>
          ) : (
            <>
              <Link2 size={14} />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <a
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full border border-white/15 bg-white/5 p-2 text-white transition hover:bg-white/15"
          aria-label="Share on Twitter"
        >
          <Twitter size={14} />
        </a>

        <a
          href={linkedinShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full border border-white/15 bg-white/5 p-2 text-white transition hover:bg-white/15"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={14} />
        </a>
      </div>
    </div>
  );
}