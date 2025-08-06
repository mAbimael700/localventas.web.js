import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export const TabsMenu = ({ tabs }) => {


  return (
    <>
      <Tabs className="space-y-4 pb-8">
        <TabsList defaultValue={""}>
          {tabs.map((tab, i) => (
            <TabsTrigger asChild value={tab.value.toString()} key={`${tab.value}-${i}`}>
              <Link to={tab.path.toString()}>
                {tab.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="space-y-4">
          <Outlet />
        </div>
      </Tabs>
    </>
  );
};
