/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Code2,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Palette,
  Play,
  Settings2,
  Terminal,
  Timer,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// interface ColorPalette {
//   name: string;
//   dark: {
//     bg: string;
//     text: string;
//     editor: string;
//     accent: string;
//   };
//   light: {
//     bg: string;
//     text: string;
//     editor: string;
//     accent: string;
//   };
// }

// interface ColorPalettes {
//   [key: string]: ColorPalette;
// }

// Color palette options
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const colorPalettes: any = {
  default: {
    name: "Default",
    dark: {
      bg: "from-gray-900 to-black",
      text: "text-white",
      editor: "bg-black/30",
      accent: "purple",
    },
    light: {
      bg: "from-gray-100 to-white",
      text: "text-black",
      editor: "bg-white/30",
      accent: "purple",
    },
  },
  ocean: {
    name: "Ocean",
    dark: {
      bg: "from-blue-900 to-slate-900",
      text: "text-blue-50",
      editor: "bg-blue-950/30",
      accent: "blue",
    },
    light: {
      bg: "from-blue-50 to-white",
      text: "text-blue-900",
      editor: "bg-blue-50/30",
      accent: "blue",
    },
  },
  forest: {
    name: "Forest",
    dark: {
      bg: "from-green-900 to-emerald-950",
      text: "text-emerald-50",
      editor: "bg-green-950/30",
      accent: "emerald",
    },
    light: {
      bg: "from-green-50 to-white",
      text: "text-emerald-900",
      editor: "bg-green-50/30",
      accent: "emerald",
    },
  },
  sunset: {
    name: "Sunset",
    dark: {
      bg: "from-orange-900 to-red-950",
      text: "text-orange-50",
      editor: "bg-orange-950/30",
      accent: "orange",
    },
    light: {
      bg: "from-orange-50 to-white",
      text: "text-orange-900",
      editor: "bg-orange-50/30",
      accent: "orange",
    },
  },
  lavender: {
    name: "Lavender",
    dark: {
      bg: "from-purple-900 to-indigo-950",
      text: "text-purple-50",
      editor: "bg-purple-950/30",
      accent: "purple",
    },
    light: {
      bg: "from-purple-50 to-white",
      text: "text-purple-900",
      editor: "bg-purple-50/30",
      accent: "purple",
    },
  },
};

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
const Header: React.FC<HeaderProps> = ({
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
    className={`flex items-center justify-between p-2 ${
      theme === "dark" ? "bg-black/50" : "bg-white/50"
    }`}
  >
    <div className="flex items-center gap-2">
      <Code2
        className={`w-5 h-5 text-${colorPalettes[colorPalette][theme].accent}-400`}
      />
      <span className="font-semibold">Code Editor</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button onClick={onThemeChange} size="sm" variant="ghost">
          <Settings2 className="w-4 h-4" />
        </Button>
        <Button onClick={onCopy} size="sm" variant="ghost" title="Copy code">
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          onClick={onDownload}
          size="sm"
          variant="ghost"
          title="Download code"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Switch
          checked={autoRun}
          onCheckedChange={onAutoRunChange}
          className={`data-[state=checked]:bg-${colorPalettes[colorPalette][theme].accent}-600`}
        />
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
        className={`bg-${colorPalettes[colorPalette][theme].accent}-600 hover:bg-${colorPalettes[colorPalette][theme].accent}-700`}
      >
        <Play className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

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
const Console: React.FC<ConsoleProps> = ({
  theme,
  output,
  onClear,
  isFullscreen,
  onToggleFullscreen,
  outputRef,
  colorPalette,
}) => (
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
        <Button
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
        </Button>
        <Button
          onClick={onClear}
          size="sm"
          variant="ghost"
          className="opacity-70 hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
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
const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
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

interface ColorPalettePickerProps {
  currentPalette: string;
  onPaletteChange: (palette: string) => void;
}

// Color Palette Picker Component
const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  currentPalette,
  onPaletteChange,
}) => (
  <div className="absolute bottom-2 right-24 flex flex-col gap-2 bg-black/20 p-2 rounded">
    <Button size="sm" variant="ghost" className="flex items-center gap-2">
      <Palette className="w-4 h-4" />
      <span>Theme</span>
    </Button>
    <div className="flex flex-col gap-1">
      {Object.entries(colorPalettes).map(([key, palette]) => (
        <Button
          key={key}
          size="sm"
          variant={currentPalette === key ? "secondary" : "ghost"}
          onClick={() => onPaletteChange(key)}
          className="justify-start"
        >
          {(palette as { name: string }).name}
        </Button>
      ))}
    </div>
  </div>
);

function App() {
  const [code, setCode] = useState(
    '// Write your JavaScript code here\nconsole.log("Hello, World!");\n'
  );
  const [output, setOutput] = useState<
    Array<{
      type: string;
      content: string;
      timestamp: string;
    }>
  >([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [autoRun, setAutoRun] = useState(false);
  const [interval, setIntervalTime] = useState(1000);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [fontSize, setFontSize] = useState(14);
  const [colorPalette, setColorPalette] = useState("default");
  const outputRef = useRef<HTMLDivElement>(null);
  const autoRunRef = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const executeCode = useCallback(async () => {
    setIsExecuting(true);
    const logs: Array<{
      type: string;
      content: string;
      timestamp: string;
    }> = [];

    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
      originalConsoleLog.apply(console, args);
      logs.push({
        type: "log",
        content: args
          .map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
          )
          .join(" "),
        timestamp: new Date().toLocaleTimeString(),
      });
      setOutput((prev) => [...prev, ...logs]);
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const result = new Function(code)();

      if (result !== undefined) {
        logs.push({
          type: "result",
          content:
            typeof result === "object"
              ? JSON.stringify(result, null, 2)
              : String(result),
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (error) {
      logs.push({
        type: "error",
        content: error instanceof Error ? error.message : "An error occurred",
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      console.log = originalConsoleLog;
      setOutput(logs);
      setIsExecuting(false);
    }
  }, [code]);

  useEffect(() => {
    if (autoRun) {
      autoRunRef.current = setInterval(executeCode, interval);
    } else {
      if (autoRunRef.current) clearInterval(autoRunRef.current);
    }
    return () => {
      if (autoRunRef.current) clearInterval(autoRunRef.current);
    };
  }, [autoRun, executeCode, interval]);

  const clearOutput = () => setOutput([]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200  ${
        theme === "dark"
          ? `bg-gradient-to-br ${colorPalettes[colorPalette][theme].bg} ${colorPalettes[colorPalette][theme].text}`
          : `bg-gradient-to-br ${colorPalettes[colorPalette][theme].bg} ${colorPalettes[colorPalette][theme].text}`
      }`}
    >
      <div
        className={`h-full grid ${
          isFullscreen ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        <div className="h-full flex flex-col">
          <Header
            theme={theme}
            colorPalette={colorPalette}
            onThemeChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            onCopy={copyCode}
            onDownload={downloadCode}
            autoRun={autoRun}
            onAutoRunChange={setAutoRun}
            interval={interval}
            onIntervalChange={(e) => setIntervalTime(Number(e.target.value))}
            onExecute={executeCode}
            isExecuting={isExecuting}
          />
          <div className="relative flex-1">
            <Textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`absolute inset-0 font-mono resize-none  rounded-none h-[calc(94dvh)]
                ${
                  theme === "dark"
                    ? colorPalettes[colorPalette][theme].editor
                    : colorPalettes[colorPalette][theme].editor
                }
              `}
              style={{ fontSize: `${fontSize}px` }}
              placeholder="Write your JavaScript code here..."
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setFontSize(Math.max(10, fontSize - 2))}
              >
                A-
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              >
                A+
              </Button>
            </div>
            <ColorPalettePicker
              currentPalette={colorPalette}
              onPaletteChange={setColorPalette}
            />
          </div>
        </div>

        <Console
          theme={theme}
          colorPalette={colorPalette}
          output={output}
          onClear={clearOutput}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          outputRef={outputRef}
        />
      </div>
    </div>
  );
}

export default App;
