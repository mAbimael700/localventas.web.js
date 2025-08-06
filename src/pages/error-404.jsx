import { NavbarInfo } from "../components/info-navbar";

export const Error404 = () => {
  return (
    <div className="flex items-center justify-center relative w-screen h-screen">
      <div className="absolute top-0 w-screen">
        <NavbarInfo></NavbarInfo>
      </div>
      <h1 className="text-4xl font-bold">Page not found</h1>
    </div>
  );
};
