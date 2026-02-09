"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownResult({ result }) {
  if (!result?.text) return null;

  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">CV généré</h2>

        {result?.meta?.pdf?.name && (
          <div className="text-xs text-muted-foreground">
            PDF source :{" "}
            <span className="font-medium">{result.meta.pdf.name}</span>
          </div>
        )}
      </div>
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (p) => <h1 className="text-2xl font-bold mt-2 mb-3" {...p} />,
            h2: (p) => (
              <h2 className="text-xl font-semibold mt-6 mb-2" {...p} />
            ),
            h3: (p) => (
              <h3 className="text-lg font-semibold mt-4 mb-2" {...p} />
            ),
            ul: (p) => <ul className="list-disc pl-5 my-2" {...p} />,
            ol: (p) => <ol className="list-decimal pl-5 my-2" {...p} />,
            li: (p) => <li className="my-1" {...p} />,
            hr: () => <hr className="my-6 border-border" />,
            table: (p) => (
              <div className="overflow-x-auto my-4">
                <table className="w-full border-collapse text-sm" {...p} />
              </div>
            ),
            th: (p) => (
              <th className="border px-2 py-1 bg-muted text-left" {...p} />
            ),
            td: (p) => <td className="border px-2 py-1 align-top" {...p} />,
            blockquote: (p) => (
              <blockquote
                className="border-l-4 pl-3 my-3 text-muted-foreground"
                {...p}
              />
            ),
          }}
        >
          {result.text}
        </ReactMarkdown>
      </div>
      <div className="mt-6 rounded-lg border bg-background p-3 text-xs text-muted-foreground">
        <div>Expériences analysées : {result.meta?.experienceCount ?? 0}</div>
        {result.meta?.pdf?.size && (
          <div>Taille PDF : {Math.round(result.meta.pdf.size / 1024)} KB</div>
        )}
      </div>
    </section>
  );
}
