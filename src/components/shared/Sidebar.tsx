import { Route } from 'lucide-react';

// Figma image assets from: https://www.figma.com/design/B5H5AxzPnbGZc665ME1tAO/OX-UI-Kit2025?node-id=269-42612&m=dev
// Mapping: Members & Staff -> EGYM settings, Gym Inventory -> Gym inventory, Analytics -> Analytics
const settingsIcon = "https://www.figma.com/api/mcp/asset/1d488141-24fb-40fa-a602-452b75be0795";
const inboxIcon = "https://www.figma.com/api/mcp/asset/b49d7e0e-2f19-4663-a09a-785ec5bc93b2";
const analyticsIcon = "https://www.figma.com/api/mcp/asset/b043534b-517b-44ea-ad9d-75b8ab58043b";
const fitnessHubIcon = "https://www.figma.com/api/mcp/asset/8b32116c-5c7c-428a-8f37-ad0607e47071";
const smartStrengthIcon = "https://www.figma.com/api/mcp/asset/b30bbca4-40bd-4fe7-ae6c-9115b2d35faa";
const smartFlexIcon = "https://www.figma.com/api/mcp/asset/7c359ecf-fa61-47fb-aa3f-fa823aad80ad";
const smartCardioIcon = "https://www.figma.com/api/mcp/asset/59a978e8-39ca-453e-b992-e1a7ae21fd2a";
const memberAppIcon = "https://www.figma.com/api/mcp/asset/054e352f-5934-4a77-a72d-1f98bcbcc99f";
const trainerAppIcon = "https://www.figma.com/api/mcp/asset/73db1358-4bae-40fc-8677-341de437fc0c";
const supportIcon = "https://www.figma.com/api/mcp/asset/48be70f9-6a38-4d5b-95bc-8e255936b107";
const educationIcon = "https://www.figma.com/api/mcp/asset/5423afde-a5d3-4a37-a488-7376f5a95837";
const marketingIcon = "https://www.figma.com/api/mcp/asset/c8009177-b6aa-421f-a6e1-ddb2325bc1de";

interface SidebarTabProps {
  icon: string | React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarTab({ icon, label, active = false }: SidebarTabProps) {
  const isIconComponent = typeof icon !== 'string';
  
  return (
    <div
      className={`flex gap-2 h-10 items-center p-2 rounded-lg w-full transition-colors cursor-pointer hover:bg-secondary/50 ${
        active ? 'bg-secondary' : 'bg-card'
      }`}
    >
      <div className="shrink-0 size-5 flex items-center justify-center">
        {isIconComponent ? (
          icon
        ) : (
          <img src={icon as string} alt={label} className="size-full" />
        )}
      </div>
      <p className="flex-1 text-base leading-6 tracking-[0.3px] font-medium text-foreground truncate">
        {label}
      </p>
    </div>
  );
}

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
}

function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="flex flex-col gap-[2px] items-start w-full">
      {title && (
        <p className="text-xs leading-4 tracking-[0.5px] font-normal text-foreground h-4">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="bg-card border-r border-border flex flex-col gap-6 items-start px-5 py-6 w-[230px] h-full overflow-y-auto">
      {/* Location Section */}
      <SidebarSection>
        <SidebarTab icon={<Route className="size-full text-foreground" />} label="Journey Builder" active />
        <SidebarTab icon={settingsIcon} label="EGYM settings" />
        <SidebarTab icon={inboxIcon} label="Gym inventory" />
        <SidebarTab icon={analyticsIcon} label="Analytics" />
      </SidebarSection>

      {/* Products Section */}
      <SidebarSection title="Products">
        <SidebarTab icon={fitnessHubIcon} label="Fitness Hub" />
        <SidebarTab icon={smartStrengthIcon} label="Smart Strength" />
        <SidebarTab icon={smartFlexIcon} label="Smart Flex" />
        <SidebarTab icon={smartCardioIcon} label="Smart Cardio" />
        <SidebarTab icon={memberAppIcon} label="Member App" />
        <SidebarTab icon={trainerAppIcon} label="Trainer App" />
      </SidebarSection>

      {/* Support & Resources Section */}
      <SidebarSection title="Support & Resources">
        <SidebarTab icon={supportIcon} label="Support" />
        <SidebarTab icon={educationIcon} label="Education" />
        <SidebarTab icon={marketingIcon} label="Marketing" />
      </SidebarSection>
    </div>
  );
}
