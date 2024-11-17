/* eslint-disable @typescript-eslint/no-unused-vars */
import { colorPalettes } from "@/theme";
import { Terminal } from "lucide-react";
import { Button } from "../ui/button";
import { ConsoleOutput } from "./ConsoleOutput";

interface ConsoleProps {
  theme: string;
  output: Array<{
    type: string;
    content: string;
    timestamp: string;
  }>;
  onClear: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  outputRef: React.RefObject<HTMLDivElement>;
  colorPalette: string;
}

// Console Component
export const Console: React.FC<ConsoleProps> = ({
  theme,
  output,
  onClear,
  isFullscreen,
  outputRef,
  colorPalette,
}) => {
  return (
    <div
      className={`h-screen max-h-screen overflow-hidden flex flex-col md:border-l border-gray-400   ${
        isFullscreen ? "hidden" : ""
      }`}
    >
      <div
        className={`flex items-center justify-between p-2  ${
          theme === "dark" ? "bg-black/50" : "bg-white/50"
        }`}
      >
        <div className="flex items-center gap-2 ">
          <Terminal
            className={`w-5 h-5 text-${colorPalettes[colorPalette][theme].accent}-400`}
          />
          <span className="font-semibold">Console</span>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
          onClick={onToggleFullscreen}
          size="sm"
          variant="ghost"
          className="opacity-70 hover:opacity-100"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </Button> */}
          <Button
            onClick={onClear}
            size="sm"
            variant="ghost"
            className="opacity-70 hover:opacity-100"
          >
            clear
            {/* <Trash2 className="w-4 h-4" /> */}
          </Button>
        </div>
      </div>
      <ConsoleOutput
        theme={theme}
        output={output}
        outputRef={outputRef}
        colorPalette={colorPalette}
      />
    </div>
  );
};
