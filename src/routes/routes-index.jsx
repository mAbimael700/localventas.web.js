import "../styles.css";
import { Index } from "../pages/index.jsx";
import { Signup } from "../pages/sign-up.jsx";
import { Error404 } from "@/pages/error-404.jsx";
import { SelectPlanPage } from "../pages/select-plan-page.jsx";
import AuthenticationPage from "../pages/log-in.jsx";
import { Outlet } from "react-router-dom";
import ImageUpload from "../components/form/image-upload.jsx";
import ProtectedRoute from "../components/protected-route/protected-route.jsx";
import { UserNavbar } from "../components/user/user-navbar.jsx";
import { MyAccountMenu } from "../pages/personal-account/my-account-menu.jsx";
import { SidebarNav } from "../components/form/form-sidebar-multistep.jsx";
import { MyAccountMenuIndex } from "../pages/personal-account/my-account-index.jsx";
import { SolicitudesEmpleoMenu } from "../pages/personal-account/solicitudes-empleo/solicitudes-empleo-menu.jsx";
import { SolicitudesEmpleoIndividual } from "../pages/personal-account/solicitudes-empleo/solicitudes-empleo-individual.jsx";

export const routesIndex = [
  {
    errorElement: <Error404 />,
    path: "/",
    element: (
      <>
        <Index />
      </>
    ),
  },
  {
    path: "signup",
    element: <Outlet />,
    children: [
      {
        index: true,
        element: (
          <>
            <Signup />
          </>
        ),
      },
      {
        path: "select-plan",
        element: <SelectPlanPage />,
      },
    ],
  },
  {
    path: "login",
    element: (
      <>
        <AuthenticationPage />
      </>
    ),
  },
  {
    path: "test",
    element: (
      <div>
        <ImageUpload />
      </div>
    ),
  },
  {
    path: "my-account",
    element: <MyAccountMenu />,
    children: [
      {
        index: true,
        element: <MyAccountMenuIndex />,
      },
      {
        path: "notifications",
      },
      {
        path: "solicitudes-empleo",
        
        children: [
          {index: true, element:  <SolicitudesEmpleoMenu />},
          { path: ":solicitudId", element: <SolicitudesEmpleoIndividual /> },
        ],
      },
    ],
  },
];
