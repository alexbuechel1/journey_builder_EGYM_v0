import type { ReactNode } from 'react';

interface PhoneShellProps {
  children: ReactNode;
}

export function PhoneShell({ children }: PhoneShellProps) {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="relative w-full max-w-[375px]">
        {/* Phone Frame */}
        <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-[3rem] p-3 shadow-2xl">
          {/* Screen Bezel */}
          <div className="bg-black rounded-[2.5rem] p-1.5 relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10" />
            
            {/* Screen */}
            <div className="bg-background rounded-[2rem] overflow-hidden min-h-[700px] max-h-[800px] flex flex-col">
              {/* Status Bar */}
              <div className="bg-background px-6 pt-12 pb-3 flex items-center justify-between text-marginal-25 font-medium text-foreground border-b border-border/50">
                <div className="font-semibold">9:41</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-2.5 border-2 border-foreground rounded-sm" />
                  <div className="w-1.5 h-1.5 bg-foreground rounded-full" />
                  <div className="w-6 h-3 border border-foreground rounded-sm flex items-center justify-end pr-0.5">
                    <div className="w-4 h-2 bg-foreground rounded-sm" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-5">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

