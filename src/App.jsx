import {useState, useEffect} from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import styled from "styled-components";

import {NavbarInfo} from "./components/info-navbar";
import {Index} from "./pages/index";
import {Signin} from "./pages/log-in.jsx";
import {Dashboard} from "@/pages/dashboard/dashboard-layout";
import {ProductosMenu} from "@/pages/dashboard/productos-menu";
import {VentasMenu} from "@/pages/dashboard/ventas-menu";
import {PagosMenu} from "@/pages/dashboard/pagos-menu";

import "./styles.css";
import {Toaster} from "@/components/ui/toaster.jsx";

const Container = styled.div`
    color: var(--darker);
`;

function App() {
    const [navbarColor, setNavbarColor] = useState("default");
    const [navbarBackgroundColor, setNavbarBackgroundColor] = useState("default");
    const location = useLocation();

    useEffect(() => {
        // Determina el color del navbar en función de la ruta actual

        if (location.pathname === "/") {
            setNavbarColor("#fff");
            setNavbarBackgroundColor("#A61E1E");
        } else {
            setNavbarColor("default");
            setNavbarBackgroundColor("default"); // Color predeterminado
        }
    }, [location.pathname]);

    return (
        <Container>
            <Toaster/>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <NavbarInfo
                                backgroundColor={navbarBackgroundColor}
                                color={navbarColor}
                            />
                            <Index/>
                        </>
                    }
                />
                <Route
                    path="/signin"
                    element={
                        <>
                            <NavbarInfo
                                backgroundColor={navbarBackgroundColor}
                                color={navbarColor}
                            />
                            <Signin/>
                        </>
                    }
                />
                <Route
                    path="/services"
                    element={
                        <>

                            <Dashboard/>
                        </>
                    }
                />

                <Route
                    path="/ventas"
                    element={
                        <Dashboard>
                            <VentasMenu/>
                        </Dashboard>
                    }
                />
                <Route
                    path="/productos"
                    element={
                        <Dashboard>
                            <ProductosMenu/>
                        </Dashboard>
                    }
                ></Route>
                <Route path="/login" element={<h1/>}/>
                <Route
                    path="/pagos"
                    element={
                        <Dashboard>
                            <PagosMenu/>
                        </Dashboard>
                    }
                />
                <Route path="/pedidos" element={<Dashboard/>}/>
            </Routes>
        </Container>
    );
}

export default App;
