/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import { Console } from "./components/layout/Console";
import { Header } from "./components/layout/Header";
import { colorPalettes } from "./theme";

import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

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
  const [
    colorPalette,
    //  setColorPalette
  ] = useState("default");
  const outputRef = useRef<HTMLDivElement>(null);
  const autoRunRef = useRef<NodeJS.Timeout | null>(null);
  const editorRef: any = useRef(null);

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
      setOutput((prev) => ({ ...prev, ...logs }));
      if (window.innerWidth < 1000) {
        scrollTo({
          behavior: "smooth",
          top: 800,
        });
      }
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
    console.log("output", output);
  }, [output]);
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

  const formatCode = () => {
    const formattedCode = code
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
    setCode(formattedCode);
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
        <div className="h-screen lg:h-full flex flex-col">
          <Header
            theme={theme}
            colorPalette={colorPalette}
            onThemeChange={() => setTheme(theme === "light" ? "dark" : "light")}
            onCopy={copyCode}
            onDownload={downloadCode}
            autoRun={autoRun}
            onAutoRunChange={setAutoRun}
            interval={interval}
            onIntervalChange={(e) => setIntervalTime(Number(e.target.value))}
            onExecute={executeCode}
            isExecuting={isExecuting}
          />
          <div className="relative flex-1 ">
            <MonacoEditor
              width={"100%"}
              height={"100%"}
              language="javascript" // Use JavaScript language for JS features
              // theme={theme === "dark" ? "vs-dark" : "vs"} // Switch between dark and light theme
              value={code}
              theme={theme == "dark" ? "vs-dark" : "vs"}
              // theme={"vs-dark"}
              options={{
                selectOnLineNumbers: true,
                roundedSelection: true,
                readOnly: false,
                cursorBlinking: "smooth",
                automaticLayout: true,
                fontLigatures: true,
                fontFamily: "monospace",
                fontSize: fontSize,

                // formatOnPaste: true,
                // formatOnType: true,
                // model: monaco.editor.createModel("", "javascript"),
                // hover: {
                //   enabled: true,
                // },
                // minimap: {
                //   enabled: false,
                // },
                // "semanticHighlighting.enabled": true, // Enable semantic highlighting
                // bracketPairColorization: {
                //   independentColorPoolPerBracketType: true,
                //   enabled: true,
                // },
                // autoClosingBrackets: "always",
                // suggest: {
                //   filterGraceful: true,
                //   showFunctions: true,
                //   showVariables: true,
                //   showMethods: true,
                //   // showTypes: true,
                //   showClasses: true,
                //   showEnums: true,
                //   showInterfaces: true,
                // },
                // quickSuggestions: {
                //   other: true,
                //   comments: true,
                //   strings: true,
                // },
              }}
              onChange={(newValue) => setCode(newValue)}
              editorDidMount={(editor) => {
                editorRef.current = editor;
                // Additional Monaco settings if needed
              }}
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
              <Button size="sm" variant="ghost" onClick={formatCode}>
                Format
              </Button>
            </div>
            {/* <ColorPalettePicker
              currentPalette={colorPalette}
              onPaletteChange={setColorPalette}
            /> */}
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
