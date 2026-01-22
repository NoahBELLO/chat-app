export function ChatBubble({ content }) {
  return (
    <div className="flex justify-end">
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
        {content}
      </div>
    </div>
  );
}
