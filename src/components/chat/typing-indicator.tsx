export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 rounded-lg bg-card px-4 py-3">
      <span className="h-2 w-2 animate-[pulse_0.5s_ease-in-out_infinite] rounded-full bg-muted-foreground" />
      <span className="h-2 w-2 animate-[pulse_0.5s_ease-in-out_0.1s_infinite] rounded-full bg-muted-foreground" />
      <span className="h-2 w-2 animate-[pulse_0.5s_ease-in-out_0.2s_infinite] rounded-full bg-muted-foreground" />
    </div>
  );
}
