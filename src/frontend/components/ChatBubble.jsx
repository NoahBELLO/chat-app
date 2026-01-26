import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; 

export function ChatBubble({ content }) {
  return (
    <div className={`flex ${content.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className="
          max-w-[75%]
          whitespace-pre-wrap
          rounded-2xl
          rounded-br-sm
          bg-primary
          px-4
          py-2
          text-sm
          text-primary-foreground
        "
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ _node, ...props }) => (
              <div className="markdown-table-wrapper">
                <table {...props} />
              </div>
            ),
          }}
        >
          {content.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
