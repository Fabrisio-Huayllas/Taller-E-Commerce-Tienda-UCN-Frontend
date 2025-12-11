"use client";

import { useEffect, useState } from "react";

interface DebugPanelProps {
  title: string;
  data: unknown;
}

export function DebugPanel({ title, data }: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl + Shift + D para toggle debug
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!isDev || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-auto bg-gray-900 text-green-400 p-4 rounded-lg shadow-xl border border-green-500 z-[9999] font-mono text-xs">
      <div className="flex justify-between items-center mb-2 border-b border-green-500 pb-2">
        <span className="font-bold text-sm">{title}</span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      </div>
      <pre className="whitespace-pre-wrap break-all">
        {JSON.stringify(data, null, 2)}
      </pre>
      <div className="mt-2 pt-2 border-t border-green-500 text-gray-400 text-[10px]">
        Press Ctrl+Shift+D to toggle
      </div>
    </div>
  );
}
