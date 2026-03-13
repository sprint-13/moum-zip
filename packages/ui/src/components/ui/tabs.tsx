"use client";

import { cn } from "@ui/lib/utils";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { useCallback, useState } from "react";
import { UnderlineTabButton } from "./underline-tab-button";
import { TabsContext, useTabsContext } from "./use-tabs-context";

type TabsSize = "small" | "large";

// Root 컴포넌트
interface TabsRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  defaultTab: string; // 탭 기본값
  onTabChange?: (value: string) => void; // 탭 변경 시 콜백
}

interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: TabsSize;
}

interface TabsTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  children: ReactNode;
  value: string;
  size?: TabsSize;
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  value: string;
}

const TabsRoot = ({ children, defaultTab, onTabChange, className, ...props }: TabsRootProps) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  const changeTab = useCallback(
    (value: string) => {
      setSelectedTab(value);
      onTabChange?.(value);
    },
    [onTabChange],
  );

  return (
    <TabsContext.Provider value={{ selectedTab, changeTab }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, size = "small", className, ...props }: TabsListProps) => {
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

const TabsTrigger = ({ children, value, size = "small", className, onClick, ...props }: TabsTriggerProps) => {
  const { selectedTab, changeTab } = useTabsContext();
  const isActive = selectedTab === value;

  const handleTabClick = () => {
    changeTab(value);
  };

  return (
    <UnderlineTabButton
      variant={isActive ? "active" : "default"}
      size={size}
      className={className}
      onClick={(event) => {
        handleTabClick();
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
