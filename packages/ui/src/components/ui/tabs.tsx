"use client";

import { cn } from "@ui/lib/utils";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { useCallback, useState } from "react";
import { UnderlineTabButton } from "./underline-tab-button";
import { TabsContext, type TabsSize, useTabsContext } from "./use-tabs-context";

// Root 컴포넌트
interface TabsRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  defaultTab: string; // 탭 기본값
  onTabChange?: (value: string) => void; // 탭 변경 시 콜백
  size?: TabsSize;
}

interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface TabsTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  children: ReactNode;
  value: string;
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  value: string;
}

const TabsRoot = ({ children, defaultTab, onTabChange, size = "small", className, ...props }: TabsRootProps) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  const changeTab = useCallback(
    (value: string) => {
      setSelectedTab(value);
      onTabChange?.(value);
    },
    [onTabChange],
  );

  return (
    <TabsContext.Provider value={{ selectedTab, changeTab, size }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className, ...props }: TabsListProps) => {
  const { size } = useTabsContext();

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn("flex items-end", size === "small" ? "w-fit" : "w-full", className)}
      {...props}
    >
      <div className="flex w-fit items-center">{children}</div>

      {size === "large" ? <div aria-hidden="true" className="h-0.5 flex-1 bg-neutral-200" /> : null}
    </div>
  );
};

const TabsTrigger = ({ children, value, className, onClick, ...props }: TabsTriggerProps) => {
  const { selectedTab, changeTab, size } = useTabsContext();
  const isActive = selectedTab === value;

  return (
    <UnderlineTabButton
      type="button"
      variant={isActive ? "active" : "default"}
      size={size}
      className={className}
      onClick={(event) => {
        changeTab(value);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </UnderlineTabButton>
  );
};

const TabsContent = ({ children, value, className, ...props }: TabsContentProps) => {
  const { selectedTab } = useTabsContext();

  if (selectedTab !== value) {
    return null;
  }

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
