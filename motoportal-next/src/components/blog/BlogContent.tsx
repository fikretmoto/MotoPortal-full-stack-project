import { Fragment } from "react";

type BlogContentProps = {
  content: string;
};

// content düz metin kabul ediliyor (HTML render edilmiyor): boş
// satırlarla paragraflara bölünür, paragraf içindeki tek satır
// sonları <br /> ile korunur. Her şey React ile render edildiği için
// metindeki HTML etiketleri olduğu gibi (kaçışlı) görünür.
function splitParagraphs(content: string): string[] {
  return content
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function BlogContent({ content }: BlogContentProps) {
  if (!content || !content.trim()) {
    return null;
  }

  const paragraphs = splitParagraphs(content);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 text-base leading-relaxed text-foreground">
      {paragraphs.map((paragraph, paragraphIndex) => {
        const lines = paragraph.split("\n");

        return (
          <p key={paragraphIndex}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
