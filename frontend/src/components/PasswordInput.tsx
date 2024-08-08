"use client";

import { createElement, forwardRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Box } from "./ui/box";

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Box className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("hide-password-toggle pr-10", className)}
          ref={ref}
          {...props}
          defaultValue=''
        />
        <Button
          type="button"
          tabIndex={-1}
          variant="ghost"
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {createElement(showPassword ? EyeIcon : EyeOffIcon, {
            className: "h-6 w-6",
          })}
        </Button>
        {/* hides browsers password toggles */}
				<style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
      </Box>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
