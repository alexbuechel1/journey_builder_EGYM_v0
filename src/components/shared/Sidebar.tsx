import { Route } from 'lucide-react';

// Figma image assets
const settingsIcon = "https://www.figma.com/api/mcp/asset/4e041138-296c-45df-b5f9-8cea64692b94";
const inboxIcon = "https://www.figma.com/api/mcp/asset/3f64054c-8f75-4da4-9efd-e04d0faf91a0";
const analyticsIcon = "https://www.figma.com/api/mcp/asset/a2392eda-3d35-404b-a616-a4e0d9d82a89";
const fitnessHubIcon = "https://www.figma.com/api/mcp/asset/b4ef17ec-c6e4-493b-8f2a-f950e6c214b2";
const smartStrengthIcon = "https://www.figma.com/api/mcp/asset/cda7135a-2391-462b-846c-26e6864c928c";
const smartFlexIcon = "https://www.figma.com/api/mcp/asset/e4671a5c-c20b-4e3c-ba97-027d5e1e2ac2";
const smartCardioIcon = "https://www.figma.com/api/mcp/asset/10e1c663-aa81-4b85-9bd3-e28834f5c1c2";
const memberAppIcon = "https://www.figma.com/api/mcp/asset/476a42b8-aab1-4790-a540-1680249e641e";
const trainerAppIcon = "https://www.figma.com/api/mcp/asset/15a9e6a1-abf0-43e2-a243-da9bb0a407de";
const supportIcon = "https://www.figma.com/api/mcp/asset/60cc173d-ffaa-42b2-962b-da7cd015849e";
const educationIcon = "https://www.figma.com/api/mcp/asset/316f1fd9-db34-49e5-a6ec-b619743932f0";
const marketingIcon = "https://www.figma.com/api/mcp/asset/0f43ccf1-de67-4d30-b401-490178451449";

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
