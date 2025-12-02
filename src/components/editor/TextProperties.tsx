import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextPropertiesProps {
  textContent: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  textAlign: string;
  textDecoration: string;
  fontStyle: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: string;
  textShadow: string;
  opacity: string;
  onTextContentChange: (value: string) => void;
  onTextColorChange: (value: string) => void;
  onBackgroundColorChange: (value: string) => void;
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: string) => void;
  onFontWeightChange: (value: string) => void;
  onTextAlignChange: (value: string) => void;
  onTextDecorationChange: (value: string) => void;
  onFontStyleChange: (value: string) => void;
  onLineHeightChange: (value: string) => void;
  onLetterSpacingChange: (value: string) => void;
  onTextTransformChange: (value: string) => void;
  onTextShadowChange: (value: string) => void;
  onOpacityChange: (value: string) => void;
}

export const TextProperties = ({
  textContent,
  textColor,
  backgroundColor,
  fontFamily,
  fontSize,
  fontWeight,
  textAlign,
  textDecoration,
  fontStyle,
  lineHeight,
  letterSpacing,
  textTransform,
  textShadow,
  opacity,
  onTextContentChange,
  onTextColorChange,
  onBackgroundColorChange,
  onFontFamilyChange,
  onFontSizeChange,
  onFontWeightChange,
  onTextAlignChange,
  onTextDecorationChange,
  onFontStyleChange,
  onLineHeightChange,
  onLetterSpacingChange,
  onTextTransformChange,
  onTextShadowChange,
  onOpacityChange,
}: TextPropertiesProps) => {
  const fonts = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana", 
    "Courier New", "Comic Sans MS", "Impact", "Trebuchet MS", "Palatino",
    "Garamond", "Bookman", "Lucida Sans", "Monaco", "Tahoma"
  ];

  const textShadowPresets = [
    { label: "None", value: "none" },
    { label: "Subtle", value: "1px 1px 2px rgba(0,0,0,0.2)" },
    { label: "Medium", value: "2px 2px 4px rgba(0,0,0,0.3)" },
    { label: "Strong", value: "3px 3px 6px rgba(0,0,0,0.4)" },
    { label: "Glow", value: "0 0 10px rgba(255,255,255,0.8)" },
    { label: "Neon", value: "0 0 5px #fff, 0 0 10px #fff, 0 0 15px currentColor" },
  ];

  return (
    <div className="space-y-4">
      {/* Text Content */}
      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase">Content</Label>
        <Textarea
          value={textContent}
          onChange={(e) => onTextContentChange(e.target.value)}
          placeholder="Enter text..."
          rows={3}
          className="mt-1.5"
        />
      </div>

      <Separator />

      {/* Colors */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Colors</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Text</Label>
            <div className="flex gap-1 mt-1">
              <Input
                type="color"
                value={textColor}
                onChange={(e) => onTextColorChange(e.target.value)}
                className="w-10 h-8 p-0.5 cursor-pointer"
              />
              <Input
                type="text"
                value={textColor}
                onChange={(e) => onTextColorChange(e.target.value)}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Background</Label>
            <div className="flex gap-1 mt-1">
              <Input
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="w-10 h-8 p-0.5 cursor-pointer"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="flex-1 h-8 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Typography */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Typography</Label>
        
        <div>
          <Label className="text-xs">Font Family</Label>
          <Select value={fontFamily} onValueChange={onFontFamilyChange}>
            <SelectTrigger className="mt-1 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Size (px)</Label>
            <Input
              type="number"
              value={fontSize}
              onChange={(e) => onFontSizeChange(e.target.value)}
              min="8"
              max="200"
              className="mt-1 h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Weight</Label>
            <Select value={fontWeight} onValueChange={onFontWeightChange}>
              <SelectTrigger className="mt-1 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">Thin</SelectItem>
                <SelectItem value="200">Extra Light</SelectItem>
                <SelectItem value="300">Light</SelectItem>
                <SelectItem value="400">Normal</SelectItem>
                <SelectItem value="500">Medium</SelectItem>
                <SelectItem value="600">Semi Bold</SelectItem>
                <SelectItem value="700">Bold</SelectItem>
                <SelectItem value="800">Extra Bold</SelectItem>
                <SelectItem value="900">Black</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Line Height</Label>
            <Input
              type="text"
              value={lineHeight}
              onChange={(e) => onLineHeightChange(e.target.value)}
              placeholder="1.5"
              className="mt-1 h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Letter Spacing</Label>
            <Input
              type="text"
              value={letterSpacing}
              onChange={(e) => onLetterSpacingChange(e.target.value)}
              placeholder="0px"
              className="mt-1 h-8 text-xs"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Text Style */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Style</Label>
        
        {/* Quick Style Buttons */}
        <div className="flex gap-1">
          <Button
            variant={fontWeight === "700" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onFontWeightChange(fontWeight === "700" ? "400" : "700")}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant={fontStyle === "italic" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onFontStyleChange(fontStyle === "italic" ? "normal" : "italic")}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant={textDecoration === "underline" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onTextDecorationChange(textDecoration === "underline" ? "none" : "underline")}
          >
            <Underline className="w-4 h-4" />
          </Button>
          <Button
            variant={textDecoration === "line-through" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onTextDecorationChange(textDecoration === "line-through" ? "none" : "line-through")}
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div>
          <Label className="text-xs">Alignment</Label>
          <div className="flex gap-1 mt-1">
            <Button
              variant={textAlign === "left" ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onTextAlignChange("left")}
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={textAlign === "center" ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onTextAlignChange("center")}
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant={textAlign === "right" ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onTextAlignChange("right")}
            >
              <AlignRight className="w-4 h-4" />
            </Button>
            <Button
              variant={textAlign === "justify" ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onTextAlignChange("justify")}
            >
              <AlignJustify className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Text Transform */}
        <div>
          <Label className="text-xs">Transform</Label>
          <Select value={textTransform} onValueChange={onTextTransformChange}>
            <SelectTrigger className="mt-1 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="uppercase">UPPERCASE</SelectItem>
              <SelectItem value="lowercase">lowercase</SelectItem>
              <SelectItem value="capitalize">Capitalize</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Effects */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Effects</Label>
        
        <div>
          <Label className="text-xs">Text Shadow</Label>
          <Select value={textShadow} onValueChange={onTextShadowChange}>
            <SelectTrigger className="mt-1 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {textShadowPresets.map((preset) => (
                <SelectItem key={preset.label} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Opacity</Label>
            <span className="text-xs text-muted-foreground">{Math.round(parseFloat(opacity) * 100)}%</span>
          </div>
          <Slider
            value={[parseFloat(opacity) * 100]}
            onValueChange={([value]) => onOpacityChange((value / 100).toString())}
            min={0}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};
