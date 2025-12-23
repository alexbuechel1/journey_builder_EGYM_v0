// Figma image assets
const homeIcon = "https://www.figma.com/api/mcp/asset/92a07ea9-fc71-44e3-83e2-99bc4826b21e";
const technologyIcon = "https://www.figma.com/api/mcp/asset/5d0eb1f1-2658-460b-912b-82451d398f08";
const wellpassIcon = "https://www.figma.com/api/mcp/asset/30910f22-78e0-4d29-ae3c-1a8ec8913529";

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <button className="flex flex-col items-center justify-center h-[52px] w-full">
      <div
        className={`flex items-center justify-center rounded-lg size-9 transition-colors ${
          active ? 'bg-secondary' : 'bg-card'
        }`}
      >
        <div className="size-4 flex items-center justify-center">
          <img src={icon} alt={label} className="size-full" />
        </div>
      </div>
      <p className="text-xs leading-4 tracking-[0.5px] font-medium text-foreground mt-1">
        {label}
      </p>
    </button>
  );
}

export function SideNav() {
  return (
    <div className="bg-card flex items-start justify-center px-[10px] py-6 w-[85px] h-full">
      <div className="flex flex-col gap-8 items-center w-full">
        <NavItem icon={homeIcon} label="Home" />
        <NavItem icon={technologyIcon} label="Technology" active />
        <NavItem icon={wellpassIcon} label="Wellpass" />
      </div>
    </div>
  );
}
