import { colorPalettes } from "@/theme";
import { Palette } from "lucide-react";
import { Button } from "../ui/button";

interface ColorPalettePickerProps {
  currentPalette: string;
  onPaletteChange: (palette: string) => void;
}

// Color Palette Picker Component
export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
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
