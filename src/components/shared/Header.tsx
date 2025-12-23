import { Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Figma image assets
const egymLogo = "https://www.figma.com/api/mcp/asset/78c42b99-f78f-4dc1-9ad9-93048bd98710";
const gymImage = "https://www.figma.com/api/mcp/asset/bb2912ff-5561-4346-b69b-3f72866d3d8c";
const chevronDown = "https://www.figma.com/api/mcp/asset/9b208332-cae9-4fe8-a55b-6405ed8e8814";
const userAvatar = "https://www.figma.com/api/mcp/asset/a6fdd0aa-c530-4c96-bcd9-ed97f5730cfa";

interface HeaderProps {
  isSimulatorOpen: boolean;
  onToggleSimulator: () => void;
}

export function Header({ isSimulatorOpen, onToggleSimulator }: HeaderProps) {
  return (
    <div className="bg-card border-b border-border h-[60px] flex items-center gap-[28px] px-[28px]">
      {/* EGYM Logo - Left Aligned */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="h-[18px] w-[99px] flex items-center">
          <img src={egymLogo} alt="EGYM" className="h-full w-full object-contain" />
        </div>
      </div>

      {/* Location Selector - Center Aligned (takes remaining space) */}
      <button className="flex-1 flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
        <div className="border border-border rounded-sm size-[30px] bg-muted flex items-center justify-center overflow-hidden shrink-0">
          <img src={gymImage} alt="Gym" className="size-full object-cover rounded-sm" />
        </div>
        <p className="text-body-100 text-foreground whitespace-nowrap">
          Holmes Place Boutique - Berlin Friedrichshain
        </p>
        <div className="flex items-center justify-center size-6 rounded-full shrink-0">
          <img src={chevronDown} alt="Dropdown" className="size-5" />
        </div>
      </button>

      {/* Right Side Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Simulator Toggle Button */}
        <Button
          variant={isSimulatorOpen ? "default" : "outline"}
          size="sm"
          onClick={onToggleSimulator}
          className="gap-2"
          title={isSimulatorOpen ? "Close Simulator" : "Open Simulator"}
        >
          {isSimulatorOpen ? (
            <>
              <X className="h-6 w-6" />
              <span className="hidden sm:inline">Close Simulator</span>
            </>
          ) : (
            <>
              <Smartphone className="h-6 w-6" />
              <span className="hidden sm:inline">Open Simulator</span>
            </>
          )}
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <div className="relative size-[30px]">
            <img src={userAvatar} alt="User" className="size-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
