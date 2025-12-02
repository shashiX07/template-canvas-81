import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, RotateCw, FlipHorizontal, FlipVertical } from "lucide-react";

interface ImagePropertiesProps {
  imageWidth: string;
  imageHeight: string;
  imageFit: string;
  imageBorderRadius: string;
  imageOpacity: string;
  imageFilter: string;
  imageBorder: string;
  imageShadow: string;
  imageRotation: string;
  imageFlipH: boolean;
  imageFlipV: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageWidthChange: (value: string) => void;
  onImageHeightChange: (value: string) => void;
  onImageFitChange: (value: string) => void;
  onImageBorderRadiusChange: (value: string) => void;
  onImageOpacityChange: (value: string) => void;
  onImageFilterChange: (value: string) => void;
  onImageBorderChange: (value: string) => void;
  onImageShadowChange: (value: string) => void;
  onImageRotationChange: (value: string) => void;
  onImageFlipHChange: (value: boolean) => void;
  onImageFlipVChange: (value: boolean) => void;
}

export const ImageProperties = ({
  imageWidth,
  imageHeight,
  imageFit,
  imageBorderRadius,
  imageOpacity,
  imageFilter,
  imageBorder,
  imageShadow,
  imageRotation,
  imageFlipH,
  imageFlipV,
  onImageUpload,
  onImageWidthChange,
  onImageHeightChange,
  onImageFitChange,
  onImageBorderRadiusChange,
  onImageOpacityChange,
  onImageFilterChange,
  onImageBorderChange,
  onImageShadowChange,
  onImageRotationChange,
  onImageFlipHChange,
  onImageFlipVChange,
}: ImagePropertiesProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filterPresets = [
    { label: "None", value: "none" },
    { label: "Grayscale", value: "grayscale(100%)" },
    { label: "Sepia", value: "sepia(100%)" },
    { label: "Blur", value: "blur(2px)" },
    { label: "Brightness", value: "brightness(1.2)" },
    { label: "Contrast", value: "contrast(1.2)" },
    { label: "Saturate", value: "saturate(1.5)" },
    { label: "Hue Rotate", value: "hue-rotate(90deg)" },
    { label: "Invert", value: "invert(100%)" },
    { label: "Vintage", value: "sepia(50%) contrast(90%) brightness(90%)" },
    { label: "Dramatic", value: "contrast(150%) saturate(120%)" },
    { label: "Fade", value: "opacity(80%) saturate(80%)" },
  ];

  const shadowPresets = [
    { label: "None", value: "none" },
    { label: "Small", value: "0 2px 4px rgba(0,0,0,0.1)" },
    { label: "Medium", value: "0 4px 8px rgba(0,0,0,0.15)" },
    { label: "Large", value: "0 8px 16px rgba(0,0,0,0.2)" },
    { label: "XL", value: "0 12px 24px rgba(0,0,0,0.25)" },
    { label: "Inner", value: "inset 0 2px 4px rgba(0,0,0,0.1)" },
    { label: "Glow", value: "0 0 20px rgba(255,255,255,0.5)" },
  ];

  const borderPresets = [
    { label: "None", value: "none" },
    { label: "Thin", value: "1px solid #000" },
    { label: "Medium", value: "2px solid #000" },
    { label: "Thick", value: "4px solid #000" },
    { label: "Dashed", value: "2px dashed #000" },
    { label: "Dotted", value: "2px dotted #000" },
    { label: "Double", value: "4px double #000" },
    { label: "White Frame", value: "4px solid #fff" },
  ];

  return (
    <div className="space-y-4">
      {/* Upload */}
      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase">Replace Image</Label>
        <Button
          variant="outline"
          className="w-full mt-1.5 h-9"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose Image
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageUpload}
        />
      </div>

      <Separator />

      {/* Dimensions */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Dimensions</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Width</Label>
            <Input
              type="text"
              value={imageWidth}
              onChange={(e) => onImageWidthChange(e.target.value)}
              placeholder="100% or 300px"
              className="mt-1 h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Height</Label>
            <Input
              type="text"
              value={imageHeight}
              onChange={(e) => onImageHeightChange(e.target.value)}
              placeholder="auto or 200px"
              className="mt-1 h-8 text-xs"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs">Object Fit</Label>
          <Select value={imageFit} onValueChange={onImageFitChange}>
            <SelectTrigger className="mt-1 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Cover</SelectItem>
              <SelectItem value="contain">Contain</SelectItem>
              <SelectItem value="fill">Fill</SelectItem>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="scale-down">Scale Down</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Transform */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Transform</Label>
        
        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Rotation</Label>
            <span className="text-xs text-muted-foreground">{imageRotation}deg</span>
          </div>
          <Slider
            value={[parseInt(imageRotation) || 0]}
            onValueChange={([value]) => onImageRotationChange(value.toString())}
            min={0}
            max={360}
            step={1}
            className="mt-2"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={imageFlipH ? "default" : "outline"}
            size="sm"
            className="flex-1 h-8"
            onClick={() => onImageFlipHChange(!imageFlipH)}
          >
            <FlipHorizontal className="w-4 h-4 mr-1" />
            Flip H
          </Button>
          <Button
            variant={imageFlipV ? "default" : "outline"}
            size="sm"
            className="flex-1 h-8"
            onClick={() => onImageFlipVChange(!imageFlipV)}
          >
            <FlipVertical className="w-4 h-4 mr-1" />
            Flip V
          </Button>
        </div>
      </div>

      <Separator />

      {/* Border & Radius */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Border</Label>
        
        <div>
          <Label className="text-xs">Border Style</Label>
          <Select value={imageBorder} onValueChange={onImageBorderChange}>
            <SelectTrigger className="mt-1 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {borderPresets.map((preset) => (
                <SelectItem key={preset.label} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Border Radius</Label>
            <span className="text-xs text-muted-foreground">{imageBorderRadius}</span>
          </div>
          <Slider
            value={[parseInt(imageBorderRadius) || 0]}
            onValueChange={([value]) => onImageBorderRadiusChange(value + "px")}
            min={0}
            max={50}
            step={1}
            className="mt-2"
          />
        </div>
      </div>

      <Separator />

      {/* Effects */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Effects</Label>
        
        <div>
          <Label className="text-xs">Filter</Label>
          <Select value={imageFilter} onValueChange={onImageFilterChange}>
            <SelectTrigger className="mt-1 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterPresets.map((preset) => (
                <SelectItem key={preset.label} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Shadow</Label>
          <Select value={imageShadow} onValueChange={onImageShadowChange}>
            <SelectTrigger className="mt-1 h-8 text-xs">
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

        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Opacity</Label>
            <span className="text-xs text-muted-foreground">{Math.round(parseFloat(imageOpacity) * 100)}%</span>
          </div>
          <Slider
            value={[parseFloat(imageOpacity) * 100]}
            onValueChange={([value]) => onImageOpacityChange((value / 100).toString())}
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
