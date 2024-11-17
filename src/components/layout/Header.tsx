import { colorPalettes } from "@/theme";
import { Code2, Copy, Download, Play, Settings2, Timer } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface HeaderProps {
  theme: string;
  onThemeChange: () => void;
  onCopy: () => void;
  onDownload: () => void;
  autoRun: boolean;
  onAutoRunChange: (checked: boolean) => void;
  interval: number;
  onIntervalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExecute: () => void;
  isExecuting: boolean;
  colorPalette: string;
}

// Header Component
export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  onCopy,
  onDownload,
  autoRun,
  onAutoRunChange,
  interval,
  onIntervalChange,
  onExecute,
  isExecuting,
  colorPalette,
}) => (
  <div
    className={`flex items-center justify-between p-2
       ${theme === "dark" ? "bg-black/50" : "bg-white/50"}
    `}
  >
    <div className="flex items-center gap-2">
      <Code2
        className={`w-5 h-5 text-${colorPalettes[colorPalette][theme].accent}-400`}
      />
      <span className="font-semibold"> Code Editor</span>
      <img
        src="https://static-00.iconduck.com/assets.00/javascript-js-icon-2048x2048-nyxvtvk0.png"
        className="h-5 w-5"
      />
    </div>
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button
          onClick={onThemeChange}
          size="sm"
          variant="ghost"
          className="text-white"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={onCopy}
          size="sm"
          variant="ghost"
          title="Copy code"
          className="text-white"
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          onClick={onDownload}
          size="sm"
          variant="ghost"
          className="text-white"
          title="Download code"
        >
          <Download className="w-4 h-4" />
        </Button>
        <label className="flex items-center border-[0.5px] border-black  dark:border-white  p-2 rounded-lg">
          <span className="text-xs">Autorun &nbsp;</span>
          <input
            type="checkbox"
            checked={autoRun}
            onChange={(e) => onAutoRunChange(e.target.checked)}
            className={`data-[state=checked]:bg-white`}
          />
        </label>
        <Timer className="w-4 h-4 opacity-70" />
        <Input
          type="number"
          value={interval}
          onChange={onIntervalChange}
          className={`w-20 h-6 border-0 ${
            theme === "dark" ? "bg-black/30" : "bg-white/30"
          }`}
          min={100}
        />
        <span className="opacity-70 text-sm">ms</span>
      </div>
      <Button
        onClick={onExecute}
        disabled={isExecuting}
        size="sm"
        // className="bg"
        className={`border border-${colorPalettes[colorPalette][theme].accent}-600 bg-${colorPalettes[colorPalette][theme].accent}-700`}
      >
        <Play className="w-4 h-4" />
      </Button>
    </div>
  </div>
);
