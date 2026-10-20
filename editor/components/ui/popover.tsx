"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "@/editor/utils/ui";
import { useOverlayOpenChange } from "./use-overlay-open-change";

function Popover({
	open,
	onOpenChange,
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
	const handleOpenChange = useOverlayOpenChange({
		open,
		onOpenChange,
	});
	return (
		<PopoverPrimitive.Root
			open={open}
			onOpenChange={handleOpenChange}
			{...props}
		/>
	);
}

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverClose = PopoverPrimitive.Close;

const PopoverContent = React.forwardRef<
	React.ElementRef<typeof PopoverPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, style, ...props }, ref) => (
	<PopoverPrimitive.Portal>
		<PopoverPrimitive.Content
			ref={ref}
			align={align}
			sideOffset={sideOffset}
			className={cn(
				"z-250 w-72 overflow-hidden rounded-md border bg-popover p-4 text-popover-foreground shadow-[0_0_10px_rgba(0,0,0,0.15)] outline-hidden",
				className,
			)}
			style={{
				// Solid fill so portaled overlays never paint as a transparent layer
				// above the WebGPU preview / editor panels.
				backgroundColor: "var(--popover, var(--background, #ffffff))",
				...style,
			}}
			{...props}
		/>
	</PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose };
