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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarIcon } from "@radix-ui/react-icons";
import { cn } from "../../lib/utils";

export const MyAccountMenuIndex = () => {
  const { getUser } = useAuth();
  const userInfo = getUser();

  return (
    <div className="">
      <Card className="p-5 rounded-sm flex items-center gap-2">
        <div className="relative">
          <div
            className={cn(
              "after:content-['+'] after:flex after:place-items-center after:p-1 after:h-5 after:w-5 after:text-primary-foreground  after:rounded-full after:absolute after:right-0 after:top-0  after:bg-primary z-10"
            )}
          >
            <Avatar className="h-20 w-20">
              <AvatarImage src={userInfo.photo} alt={userInfo.nombre} />
              <AvatarFallback>
                <AvatarIcon className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <CardHeader>
          <CardTitle>{userInfo.nombre}</CardTitle>
          <CardDescription>{userInfo.correo_electronico}</CardDescription>
        </CardHeader>
      </Card>


      
    </div>
  );
};
