import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link, Unlink } from "lucide-react";
import { useState } from "react";

interface SpacingPropertiesProps {
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  borderWidth: string;
  borderStyle: string;
  borderColor: string;
  borderRadius: string;
  boxShadow: string;
  display: string;
  position: string;
  onPaddingChange: (side: string, value: string) => void;
  onMarginChange: (side: string, value: string) => void;
  onBorderWidthChange: (value: string) => void;
  onBorderStyleChange: (value: string) => void;
  onBorderColorChange: (value: string) => void;
  onBorderRadiusChange: (value: string) => void;
  onBoxShadowChange: (value: string) => void;
  onDisplayChange: (value: string) => void;
  onPositionChange: (value: string) => void;
}

export const SpacingProperties = ({
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  borderWidth,
  borderStyle,
  borderColor,
  borderRadius,
  boxShadow,
  display,
  position,
  onPaddingChange,
  onMarginChange,
  onBorderWidthChange,
  onBorderStyleChange,
  onBorderColorChange,
  onBorderRadiusChange,
  onBoxShadowChange,
  onDisplayChange,
  onPositionChange,
}: SpacingPropertiesProps) => {
  const [paddingLinked, setPaddingLinked] = useState(false);
  const [marginLinked, setMarginLinked] = useState(false);

  const handlePaddingChange = (side: string, value: string) => {
    if (paddingLinked) {
      onPaddingChange("top", value);
      onPaddingChange("right", value);
      onPaddingChange("bottom", value);
      onPaddingChange("left", value);
    } else {
      onPaddingChange(side, value);
    }
  };

  const handleMarginChange = (side: string, value: string) => {
    if (marginLinked) {
      onMarginChange("top", value);
      onMarginChange("right", value);
      onMarginChange("bottom", value);
      onMarginChange("left", value);
    } else {
      onMarginChange(side, value);
    }
  };

  const shadowPresets = [
    { label: "None", value: "none" },
    { label: "Small", value: "0 1px 2px rgba(0,0,0,0.05)" },
    { label: "Medium", value: "0 4px 6px rgba(0,0,0,0.1)" },
    { label: "Large", value: "0 10px 15px rgba(0,0,0,0.1)" },
    { label: "XL", value: "0 20px 25px rgba(0,0,0,0.1)" },
    { label: "2XL", value: "0 25px 50px rgba(0,0,0,0.25)" },
    { label: "Inner", value: "inset 0 2px 4px rgba(0,0,0,0.06)" },
  ];

  return (
    <div className="space-y-4">
      {/* Padding */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground uppercase">Padding</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setPaddingLinked(!paddingLinked)}
          >
            {paddingLinked ? <Link className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Top</Label>
            <Input
              type="text"
              value={paddingTop}
              onChange={(e) => handlePaddingChange("top", e.target.value)}
              placeholder="0px"
              className="mt-1 h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Right</Label>
            <Input
              type="text"
              value={paddingRight}
              onChange={(e) => handlePaddingChange("right", e.target.value)}
              placeholder="0px"
              className="mt-1 h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Bottom</Label>
            <Input
              type="text"
              value={paddingBottom}
              onChange={(e) => handlePaddingChange("bottom", e.target.value)}
              placeholder="0px"
              className="mt-1 h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Left</Label>
            <Input
              type="text"
              value={paddingLeft}
              onChange={(e) => handlePaddingChange("left", e.target.value)}
              placeholder="0px"
              className="mt-1 h-7 text-xs"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Margin */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground uppercase">Margin</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setMarginLinked(!marginLinked)}
          >
            {marginLinked ? <Link className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Top</Label>
            <Input
              type="text"
              value={marginTop}
              onChange={(e) => handleMarginChange("top", e.target.value)}
              placeholder="0px"
              className="mt-1 h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Right</Label>
            <Input
              type="text"
              value={marginRight}
              onChange={(e) => handleMarginChange("right", e.target.value)}
              placeholder="0px"
              className="mt-1 h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Bottom</Label>
            <Input
              type="text"
              value={marginBottom}
              onChange={(e) => handleMarginChange("bottom", e.target.value)}
              placeholder="0px"
              className="mt-1 h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Left</Label>
            <Input
              type="text"
              value={marginLeft}
              onChange={(e) => handleMarginChange("left", e.target.value)}
              placeholder="0px"
              className="mt-1 h-7 text-xs"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Border */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Border</Label>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Width</Label>
            <Input
              type="text"
              value={borderWidth}
              onChange={(e) => onBorderWidthChange(e.target.value)}
              placeholder="0px"
              className="mt-1 h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Style</Label>
            <Select value={borderStyle} onValueChange={onBorderStyleChange}>
              <SelectTrigger className="mt-1 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
                <SelectItem value="double">Double</SelectItem>
                <SelectItem value="groove">Groove</SelectItem>
                <SelectItem value="ridge">Ridge</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-xs">Color</Label>
          <div className="flex gap-1 mt-1">
            <Input
              type="color"
              value={borderColor}
              onChange={(e) => onBorderColorChange(e.target.value)}
              className="w-10 h-7 p-0.5 cursor-pointer"
            />
            <Input
              type="text"
              value={borderColor}
              onChange={(e) => onBorderColorChange(e.target.value)}
              className="flex-1 h-7 text-xs"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Radius</Label>
            <span className="text-xs text-muted-foreground">{borderRadius}</span>
          </div>
          <Slider
            value={[parseInt(borderRadius) || 0]}
            onValueChange={([value]) => onBorderRadiusChange(value + "px")}
            min={0}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>
      </div>

      <Separator />

      {/* Box Shadow */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Shadow</Label>
        <Select value={boxShadow} onValueChange={onBoxShadowChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {shadowPresets.map((preset) => (
              <SelectItem key={preset.label} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Layout */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Layout</Label>
        
        <div>
          <Label className="text-xs">Display</Label>
          <Select value={display} onValueChange={onDisplayChange}>
            <SelectTrigger className="mt-1 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="block">Block</SelectItem>
              <SelectItem value="inline">Inline</SelectItem>
              <SelectItem value="inline-block">Inline Block</SelectItem>
              <SelectItem value="flex">Flex</SelectItem>
              <SelectItem value="inline-flex">Inline Flex</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Position</Label>
          <Select value={position} onValueChange={onPositionChange}>
            <SelectTrigger className="mt-1 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="static">Static</SelectItem>
              <SelectItem value="relative">Relative</SelectItem>
              <SelectItem value="absolute">Absolute</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
              <SelectItem value="sticky">Sticky</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
