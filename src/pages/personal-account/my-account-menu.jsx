import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "../../auth/auth-provider";
import { UserNavbar } from "../../components/user/user-navbar";
import ProtectedRoute from "../../components/protected-route/protected-route";
import { SidebarNav } from "../../components/form/form-sidebar";

export const MyAccountMenu = () => {
  const sidebarNavItems = [
    {
      title: "Perfil",
      href: "/my-account",
    },
    {
      title: "Notificaciones",
      href: "/my-account/notifications",
    },

    { title: "Solicitudes de empleo", href: "/my-account/solicitudes-empleo" },
  ];

  return (
    <div>
      <UserNavbar className="bg-primary text-primary-foreground pb-3" />

      <div className="grid grid-cols-4 w-screen ">
        <aside className="col-span-4 md:col-span-1 py-5 space-y-3 px-5">
          <h1 className="font-semibold text-lg">Mi cuenta</h1>

          <SidebarNav items={sidebarNavItems} />
        </aside>

        <main className="col-span-4 md:col-span-3 flex justify-center bg-accent py-10 min-h-[93vh]">
          <section className="w-[70%]">
            <ProtectedRoute />
          </section>
        </main>
      </div>
    </div>
  );
};
