import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Type,
  Link,
  Copy,
  Trash2,
  Sparkles
} from "lucide-react";

interface FloatingToolbarProps {
  position: { x: number; y: number };
  visible: boolean;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onStrikethrough: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onColorChange: (color: string) => void;
  onFontSizeChange: (size: string) => void;
  onCopy: () => void;
  onDelete: () => void;
  onAddAnimation: (animation: string) => void;
  currentColor: string;
  currentFontSize: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

const textAnimations = [
  { label: "Fade In", value: "fade-in", css: "animation: fadeIn 0.5s ease-out forwards;" },
  { label: "Slide Up", value: "slide-up", css: "animation: slideUp 0.5s ease-out forwards;" },
  { label: "Typewriter", value: "typewriter", css: "animation: typewriter 2s steps(40) forwards;" },
  { label: "Bounce", value: "bounce", css: "animation: bounce 1s ease infinite;" },
  { label: "Pulse", value: "pulse", css: "animation: pulse 2s ease-in-out infinite;" },
  { label: "Wave", value: "wave", css: "animation: wave 1.5s ease-in-out infinite;" },
  { label: "Glow", value: "glow", css: "animation: glow 2s ease-in-out infinite alternate;" },
  { label: "None", value: "none", css: "animation: none;" },
];

export const FloatingToolbar = ({
  position,
  visible,
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onColorChange,
  onFontSizeChange,
  onCopy,
  onDelete,
  onAddAnimation,
  currentColor,
  currentFontSize,
  isBold,
  isItalic,
  isUnderline,
}: FloatingToolbarProps) => {
  const [localColor, setLocalColor] = useState(currentColor);
  const [localSize, setLocalSize] = useState(currentFontSize);

  useEffect(() => {
    setLocalColor(currentColor);
  }, [currentColor]);

  useEffect(() => {
    setLocalSize(currentFontSize);
  }, [currentFontSize]);

  if (!visible) return null;

  return (
    <div
      className="fixed z-50 flex items-center gap-1 p-1.5 bg-popover border rounded-lg shadow-lg animate-in fade-in zoom-in-95"
      style={{
        left: position.x,
        top: position.y - 50,
        transform: "translateX(-50%)",
      }}
    >
      {/* Text Formatting */}
      <div className="flex items-center gap-0.5 border-r pr-1.5">
        <Button
          variant={isBold ? "default" : "ghost"}
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onBold}
        >
          <Bold className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant={isItalic ? "default" : "ghost"}
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onItalic}
        >
          <Italic className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant={isUnderline ? "default" : "ghost"}
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onUnderline}
        >
          <Underline className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onStrikethrough}
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 border-r pr-1.5">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onAlignLeft}>
          <AlignLeft className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onAlignCenter}>
          <AlignCenter className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onAlignRight}>
          <AlignRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Color Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 relative">
            <Palette className="w-3.5 h-3.5" />
            <div
              className="absolute bottom-0 left-1 right-1 h-1 rounded"
              style={{ backgroundColor: localColor }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="space-y-2">
            <Input
              type="color"
              value={localColor}
              onChange={(e) => {
                setLocalColor(e.target.value);
                onColorChange(e.target.value);
              }}
              className="w-full h-8 cursor-pointer"
            />
            <div className="grid grid-cols-6 gap-1">
              {["#000000", "#ffffff", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280", "#1f2937", "#064e3b"].map(
                (color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setLocalColor(color);
                      onColorChange(color);
                    }}
                  />
                )
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Font Size */}
      <div className="flex items-center gap-1 border-r pr-1.5 pl-1">
        <Type className="w-3 h-3 text-muted-foreground" />
        <Input
          type="number"
          value={localSize}
          onChange={(e) => {
            setLocalSize(e.target.value);
            onFontSizeChange(e.target.value);
          }}
          className="w-12 h-7 text-xs p-1"
          min="8"
          max="200"
        />
      </div>

      {/* Animations */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Sparkles className="w-3.5 h-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-1">
          <div className="space-y-0.5">
            {textAnimations.map((anim) => (
              <Button
                key={anim.value}
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 text-xs"
                onClick={() => onAddAnimation(anim.css)}
              >
                {anim.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Actions */}
      <div className="flex items-center gap-0.5 pl-1">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onCopy}>
          <Copy className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
