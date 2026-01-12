import { Route } from 'lucide-react';

// Local assets stored in public/icons/ to avoid Figma URL expiry
// To update assets, run: npm run download-assets
// Note: Assets are SVGs but may be saved with different extensions
const settingsIcon = "/icons/settings.svg";
const inboxIcon = "/icons/inbox.svg";
const analyticsIcon = "/icons/analytics.svg";
const fitnessHubIcon = "/icons/fitness-hub.svg";
const smartStrengthIcon = "/icons/smart-strength.svg";
const smartFlexIcon = "/icons/smart-flex.svg";
const smartCardioIcon = "/icons/smart-cardio.svg";
const memberAppIcon = "/icons/member-app.svg";
const trainerAppIcon = "/icons/trainer-app.svg";
const supportIcon = "/icons/support.svg";
const educationIcon = "/icons/education.svg";
const marketingIcon = "/icons/marketing.svg";

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
