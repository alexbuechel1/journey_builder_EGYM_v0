import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <label className={cn("relative inline-flex items-center cursor-pointer", className)}>
        <input
          type="checkbox"
          className="sr-only peer appearance-none"
          ref={ref}
          checked={checked}
          {...props}
        />
        <div
          className="w-11 h-6 bg-muted rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2 peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-primary rtl:peer-checked:after:-translate-x-full peer-checked:after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
        />
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }

