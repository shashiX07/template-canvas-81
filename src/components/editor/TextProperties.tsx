import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

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
  // Advanced properties
  wordSpacing?: string;
  textIndent?: string;
  textOverflow?: string;
  whiteSpace?: string;
  onWordSpacingChange?: (value: string) => void;
  onTextIndentChange?: (value: string) => void;
  onTextOverflowChange?: (value: string) => void;
  onWhiteSpaceChange?: (value: string) => void;
  // Gradient
  useGradient?: boolean;
  gradientType?: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientAngle?: string;
  onUseGradientChange?: (value: boolean) => void;
  onGradientTypeChange?: (value: string) => void;
  onGradientStartChange?: (value: string) => void;
  onGradientEndChange?: (value: string) => void;
  onGradientAngleChange?: (value: string) => void;
  // Pseudo classes
  hoverColor?: string;
  hoverBgColor?: string;
  onHoverColorChange?: (value: string) => void;
  onHoverBgColorChange?: (value: string) => void;
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
  // Advanced
  wordSpacing = "0px",
  textIndent = "0px",
  textOverflow = "clip",
  whiteSpace = "normal",
  onWordSpacingChange,
  onTextIndentChange,
  onTextOverflowChange,
  onWhiteSpaceChange,
  // Gradient
  useGradient = false,
  gradientType = "linear",
  gradientStart = "#ff0000",
  gradientEnd = "#0000ff",
  gradientAngle = "90",
  onUseGradientChange,
  onGradientTypeChange,
  onGradientStartChange,
  onGradientEndChange,
  onGradientAngleChange,
  // Pseudo
  hoverColor = "",
  hoverBgColor = "",
  onHoverColorChange,
  onHoverBgColorChange,
}: TextPropertiesProps) => {
  const [activeTab, setActiveTab] = useState("basic");

  const fonts = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana", 
    "Courier New", "Comic Sans MS", "Impact", "Trebuchet MS", "Palatino",
    "Garamond", "Bookman", "Lucida Sans", "Monaco", "Tahoma",
    "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
    "Playfair Display", "Merriweather", "Source Sans Pro"
  ];

  const textShadowPresets = [
    { label: "None", value: "none" },
    { label: "Subtle", value: "1px 1px 2px rgba(0,0,0,0.2)" },
    { label: "Medium", value: "2px 2px 4px rgba(0,0,0,0.3)" },
    { label: "Strong", value: "3px 3px 6px rgba(0,0,0,0.4)" },
    { label: "Glow", value: "0 0 10px rgba(255,255,255,0.8)" },
    { label: "Neon", value: "0 0 5px #fff, 0 0 10px #fff, 0 0 15px currentColor" },
    { label: "3D Effect", value: "1px 1px 0px #ccc, 2px 2px 0px #bbb, 3px 3px 0px #aaa" },
    { label: "Long Shadow", value: "2px 2px 0 #999, 4px 4px 0 #888, 6px 6px 0 #777" },
    { label: "Outline", value: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" },
  ];

  const gradientPresets = [
    { label: "Sunset", start: "#ff512f", end: "#f09819" },
    { label: "Ocean", start: "#2193b0", end: "#6dd5ed" },
    { label: "Purple", start: "#834d9b", end: "#d04ed6" },
    { label: "Forest", start: "#134e5e", end: "#71b280" },
    { label: "Fire", start: "#f12711", end: "#f5af19" },
    { label: "Night", start: "#0f2027", end: "#2c5364" },
    { label: "Rainbow", start: "#ff0000", end: "#8000ff" },
  ];

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 h-8">
          <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
          <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
          <TabsTrigger value="gradient" className="text-xs">Gradient</TabsTrigger>
          <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
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
          </div>
        </TabsContent>

        <TabsContent value="style" className="space-y-4 mt-4">
          {/* Quick Style Buttons */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground uppercase">Quick Styles</Label>
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

          <Separator />

          {/* Text Properties */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground uppercase">Spacing</Label>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Word Spacing</Label>
                <Input
                  type="text"
                  value={wordSpacing}
                  onChange={(e) => onWordSpacingChange?.(e.target.value)}
                  placeholder="0px"
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Text Indent</Label>
                <Input
                  type="text"
                  value={textIndent}
                  onChange={(e) => onTextIndentChange?.(e.target.value)}
                  placeholder="0px"
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Transform & Overflow */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground uppercase">Transform</Label>
            <div>
              <Label className="text-xs">Text Transform</Label>
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

            <div>
              <Label className="text-xs">Text Overflow</Label>
              <Select value={textOverflow} onValueChange={(v) => onTextOverflowChange?.(v)}>
                <SelectTrigger className="mt-1 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clip">Clip</SelectItem>
                  <SelectItem value="ellipsis">Ellipsis (...)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">White Space</Label>
              <Select value={whiteSpace} onValueChange={(v) => onWhiteSpaceChange?.(v)}>
                <SelectTrigger className="mt-1 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="nowrap">No Wrap</SelectItem>
                  <SelectItem value="pre">Pre</SelectItem>
                  <SelectItem value="pre-wrap">Pre Wrap</SelectItem>
                  <SelectItem value="pre-line">Pre Line</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gradient" className="space-y-4 mt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground uppercase">Text Gradient</Label>
              <Switch
                checked={useGradient}
                onCheckedChange={(v) => onUseGradientChange?.(v)}
              />
            </div>

            {useGradient && (
              <>
                <div>
                  <Label className="text-xs">Gradient Type</Label>
                  <Select value={gradientType} onValueChange={(v) => onGradientTypeChange?.(v)}>
                    <SelectTrigger className="mt-1 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="radial">Radial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Start Color</Label>
                    <div className="flex gap-1 mt-1">
                      <Input
                        type="color"
                        value={gradientStart}
                        onChange={(e) => onGradientStartChange?.(e.target.value)}
                        className="w-10 h-8 p-0.5 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={gradientStart}
                        onChange={(e) => onGradientStartChange?.(e.target.value)}
                        className="flex-1 h-8 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">End Color</Label>
                    <div className="flex gap-1 mt-1">
                      <Input
                        type="color"
                        value={gradientEnd}
                        onChange={(e) => onGradientEndChange?.(e.target.value)}
                        className="w-10 h-8 p-0.5 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={gradientEnd}
                        onChange={(e) => onGradientEndChange?.(e.target.value)}
                        className="flex-1 h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {gradientType === "linear" && (
                  <div>
                    <div className="flex justify-between">
                      <Label className="text-xs">Angle</Label>
                      <span className="text-xs text-muted-foreground">{gradientAngle}°</span>
                    </div>
                    <Slider
                      value={[parseInt(gradientAngle)]}
                      onValueChange={([v]) => onGradientAngleChange?.(v.toString())}
                      min={0}
                      max={360}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                )}

                <Separator />

                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase">Presets</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {gradientPresets.map((preset) => (
                      <button
                        key={preset.label}
                        className="h-8 rounded border hover:ring-2 ring-primary transition-all"
                        style={{
                          background: `linear-gradient(90deg, ${preset.start}, ${preset.end})`
                        }}
                        onClick={() => {
                          onGradientStartChange?.(preset.start);
                          onGradientEndChange?.(preset.end);
                        }}
                        title={preset.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <Label className="text-xs">Preview</Label>
                  <div
                    className="mt-2 p-4 rounded border text-center font-bold text-lg"
                    style={{
                      background: gradientType === "linear"
                        ? `linear-gradient(${gradientAngle}deg, ${gradientStart}, ${gradientEnd})`
                        : `radial-gradient(circle, ${gradientStart}, ${gradientEnd})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Gradient Text
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4 mt-4">
          {/* Text Shadow */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground uppercase">Text Shadow</Label>
            <Select value={textShadow} onValueChange={onTextShadowChange}>
              <SelectTrigger className="h-8 text-xs">
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

          <Separator />

          {/* Opacity */}
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

          <Separator />

          {/* Pseudo Classes */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground uppercase">Hover States</Label>
            <p className="text-xs text-muted-foreground">Define colors when user hovers</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Hover Text Color</Label>
                <div className="flex gap-1 mt-1">
                  <Input
                    type="color"
                    value={hoverColor || textColor}
                    onChange={(e) => onHoverColorChange?.(e.target.value)}
                    className="w-10 h-8 p-0.5 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={hoverColor}
                    onChange={(e) => onHoverColorChange?.(e.target.value)}
                    placeholder="inherit"
                    className="flex-1 h-8 text-xs"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Hover Background</Label>
                <div className="flex gap-1 mt-1">
                  <Input
                    type="color"
                    value={hoverBgColor || backgroundColor}
                    onChange={(e) => onHoverBgColorChange?.(e.target.value)}
                    className="w-10 h-8 p-0.5 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={hoverBgColor}
                    onChange={(e) => onHoverBgColorChange?.(e.target.value)}
                    placeholder="inherit"
                    className="flex-1 h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
