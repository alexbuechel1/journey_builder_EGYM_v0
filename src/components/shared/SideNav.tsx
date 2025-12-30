// Figma image assets from: https://www.figma.com/design/B5H5AxzPnbGZc665ME1tAO/OX-UI-Kit2025?node-id=269-42612&m=dev
const homeIcon = "https://www.figma.com/api/mcp/asset/75b4d14d-bc11-49ba-b168-9759ce1d8e0e";
const technologyIcon = "https://www.figma.com/api/mcp/asset/8939fe61-d14f-4d68-bf8b-7bf84e7605fd";
const wellpassIcon = "https://www.figma.com/api/mcp/asset/00a7d1ee-ee39-4675-a42d-38c9a38aa3e6";

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
