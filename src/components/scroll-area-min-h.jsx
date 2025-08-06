import React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { cn } from "../lib/utils";
import "./scroll-area.css";

const TAGS = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

const ScrollAreaDemo = React.forwardRef(
  ({ className, viewportClassName, children, ...props }, ref) => (
    <ScrollArea.Root
      ref={ref}
      {...props}
      className={cn("ScrollAreaRoot", className)}
    >
      <ScrollArea.Viewport className={cn("ScrollAreaViewport mr-3 ", viewportClassName)}>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="ScrollAreaScrollbar"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="ScrollAreaThumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        className="ScrollAreaScrollbar"
        orientation="horizontal"
      >
        <ScrollArea.Thumb className="ScrollAreaThumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="ScrollAreaCorner" />
    </ScrollArea.Root>
  )
);

ScrollAreaDemo.displayName = ScrollArea.Root.displayName;

export default ScrollAreaDemo;
