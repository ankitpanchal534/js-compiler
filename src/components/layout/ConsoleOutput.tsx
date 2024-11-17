import { colorPalettes } from "@/theme";
import { ScrollArea } from "../ui/scroll-area";

interface ConsoleOutputProps {
  theme: string;
  output: Array<{
    type: string;
    content: string;
    timestamp: string;
  }>;
  outputRef: React.RefObject<HTMLDivElement>;
  colorPalette: string;
}

// Console Output Component
export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  theme,
  output,
  outputRef,
  colorPalette,
}) => (
  <ScrollArea
    className={`flex-1 ${theme === "dark" ? "bg-black/30" : "bg-white/30"}`}
  >
    <div className="p-2 font-mono space-y-1" ref={outputRef}>
      {output.length === 0 ? (
        <div className="opacity-30 text-sm">
          Console output will appear here...
        </div>
      ) : (
        output.map((item, index) => (
          <div
            key={index}
            className={`px-2 py-1 rounded flex items-start gap-2 ${
              item.type === "error"
                ? "bg-red-500/10 text-red-400 border-l-2 border-red-500"
                : item.type === "result"
                ? `bg-${colorPalettes[colorPalette][theme].accent}-500/10 text-${colorPalettes[colorPalette][theme].accent}-400 border-l-2 border-${colorPalettes[colorPalette][theme].accent}-500`
                : `${
                    theme === "dark" ? "text-white/90" : "text-black/90"
                  } border-l-2 border-${
                    colorPalettes[colorPalette][theme].accent
                  }-300/20`
            }`}
          >
            <span className="opacity-50 shrink-0">
              {item.type === "log" && "›"}
              {item.type === "error" && "⨯"}
              {item.type === "result" && "←"}
            </span>
            <span className="flex-1">{item.content}</span>
            <span className="opacity-30 text-xs shrink-0">
              {item.timestamp}
            </span>
          </div>
        ))
      )}
    </div>
  </ScrollArea>
);
