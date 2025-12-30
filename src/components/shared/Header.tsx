import { ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJourney } from '@/contexts/JourneyContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Figma image assets from: https://www.figma.com/design/B5H5AxzPnbGZc665ME1tAO/OX-UI-Kit2025?node-id=269-42612&m=dev
const egymLogo = "https://www.figma.com/api/mcp/asset/92821905-20f1-4507-a272-8cc0a91bf93f";
const gymImage = "https://www.figma.com/api/mcp/asset/01ff7d73-c0c5-4042-918b-7300c8c3c595";
const chevronDown = "https://www.figma.com/api/mcp/asset/79aa0c4a-2a00-432a-a05b-ce7f16b4f29b";
const userAvatar = "https://www.figma.com/api/mcp/asset/01ff7d73-c0c5-4042-918b-7300c8c3c595";

interface HeaderProps {
  isSimulatorOpen?: boolean;
  onToggleSimulator?: () => void;
}

export function Header({}: HeaderProps = {}) {
  const { currentJourney } = useJourney();
  
  const handleViewChecklist = () => {
    if (!currentJourney) return;
    
    const url = `/checklist?journeyId=${currentJourney.id}`;
    window.open(url, '_blank');
  };
  
  const isChecklistDisabled = !currentJourney;
  
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
        {/* View Checklist Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewChecklist}
                  disabled={isChecklistDisabled}
                  className="gap-2"
                >
                  <ListChecks className="h-6 w-6" />
                  <span className="hidden sm:inline">View Checklist</span>
                </Button>
              </span>
            </TooltipTrigger>
            {isChecklistDisabled && (
              <TooltipContent>
                <p>Please select a journey to view the checklist</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

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
