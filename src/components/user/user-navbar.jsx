import React from "react";
import { Link } from "react-router-dom";
import { UserNav } from "../dashboard/user-nav";
import { cn } from "../../lib/utils";

export const UserNavbar = ({className}) => {
  return (
    <nav className={cn("flex items-center justify-between w-screen py-1.5 px-6", className)}>
      <Link to={"/"} className="title">
        LOCALVENTAS
      </Link>
      <UserNav/>
    </nav>
  );
};
