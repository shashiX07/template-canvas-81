import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VideoPropertiesProps {
  videoAutoplay: boolean;
  videoMuted: boolean;
  videoLoop: boolean;
  videoControls: boolean;
  videoWidth: string;
  videoHeight: string;
  videoBorderRadius: string;
  videoOpacity: string;
  videoFilter: string;
  videoShadow: string;
  videoPoster: string;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoAutoplayChange: (value: boolean) => void;
  onVideoMutedChange: (value: boolean) => void;
  onVideoLoopChange: (value: boolean) => void;
  onVideoControlsChange: (value: boolean) => void;
  onVideoWidthChange: (value: string) => void;
  onVideoHeightChange: (value: string) => void;
  onVideoBorderRadiusChange: (value: string) => void;
  onVideoOpacityChange: (value: string) => void;
  onVideoFilterChange: (value: string) => void;
  onVideoShadowChange: (value: string) => void;
  onVideoPosterChange: (value: string) => void;
}

export const VideoProperties = ({
  videoAutoplay,
  videoMuted,
  videoLoop,
  videoControls,
  videoWidth,
  videoHeight,
  videoBorderRadius,
  videoOpacity,
  videoFilter,
  videoShadow,
  videoPoster,
  onVideoUpload,
  onVideoAutoplayChange,
  onVideoMutedChange,
  onVideoLoopChange,
  onVideoControlsChange,
  onVideoWidthChange,
  onVideoHeightChange,
  onVideoBorderRadiusChange,
  onVideoOpacityChange,
  onVideoFilterChange,
  onVideoShadowChange,
  onVideoPosterChange,
}: VideoPropertiesProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const filterPresets = [
    { label: "None", value: "none" },
    { label: "Grayscale", value: "grayscale(100%)" },
    { label: "Sepia", value: "sepia(100%)" },
    { label: "Blur", value: "blur(2px)" },
    { label: "Brightness", value: "brightness(1.2)" },
    { label: "Contrast", value: "contrast(1.2)" },
    { label: "Saturate", value: "saturate(1.5)" },
    { label: "Vintage", value: "sepia(50%) contrast(90%)" },
  ];

  const shadowPresets = [
    { label: "None", value: "none" },
    { label: "Small", value: "0 2px 4px rgba(0,0,0,0.1)" },
    { label: "Medium", value: "0 4px 8px rgba(0,0,0,0.15)" },
    { label: "Large", value: "0 8px 16px rgba(0,0,0,0.2)" },
    { label: "XL", value: "0 12px 24px rgba(0,0,0,0.25)" },
  ];

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onVideoPosterChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Video */}
      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase">Replace Video</Label>
        <Button
          variant="outline"
          className="w-full mt-1.5 h-9"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose Video
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={onVideoUpload}
        />
      </div>

      <Separator />

      {/* Playback Controls */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Playback</Label>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm">Autoplay</Label>
            </div>
            <Switch checked={videoAutoplay} onCheckedChange={onVideoAutoplayChange} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {videoMuted ? (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              )}
              <Label className="text-sm">Muted</Label>
            </div>
            <Switch checked={videoMuted} onCheckedChange={onVideoMutedChange} />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">Loop</Label>
            <Switch checked={videoLoop} onCheckedChange={onVideoLoopChange} />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">Show Controls</Label>
            <Switch checked={videoControls} onCheckedChange={onVideoControlsChange} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Poster Image */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Poster Image</Label>
        <p className="text-xs text-muted-foreground">Thumbnail shown before video plays</p>
        <Button
          variant="outline"
          className="w-full h-9"
          onClick={() => posterInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Poster
        </Button>
        <input
          ref={posterInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePosterUpload}
        />
        {videoPoster && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <img src={videoPoster} alt="Poster" className="w-full h-full object-cover" />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-6 text-xs"
              onClick={() => onVideoPosterChange("")}
            >
              Remove
            </Button>
          </div>
        )}
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
              value={videoWidth}
              onChange={(e) => onVideoWidthChange(e.target.value)}
              placeholder="100% or 640px"
              className="mt-1 h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Height</Label>
            <Input
              type="text"
              value={videoHeight}
              onChange={(e) => onVideoHeightChange(e.target.value)}
              placeholder="auto or 360px"
              className="mt-1 h-8 text-xs"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Style */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase">Style</Label>
        
        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Border Radius</Label>
            <span className="text-xs text-muted-foreground">{videoBorderRadius}</span>
          </div>
          <Slider
            value={[parseInt(videoBorderRadius) || 0]}
            onValueChange={([value]) => onVideoBorderRadiusChange(value + "px")}
            min={0}
            max={50}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-xs">Filter</Label>
          <Select value={videoFilter} onValueChange={onVideoFilterChange}>
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
          <Select value={videoShadow} onValueChange={onVideoShadowChange}>
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
            <span className="text-xs text-muted-foreground">{Math.round(parseFloat(videoOpacity) * 100)}%</span>
          </div>
          <Slider
            value={[parseFloat(videoOpacity) * 100]}
            onValueChange={([value]) => onVideoOpacityChange((value / 100).toString())}
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
