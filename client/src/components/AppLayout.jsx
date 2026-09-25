import { Outlet } from "react-router";
import AppHeader from "./AppHeader.jsx";
import AppFooter from "./AppFooter.jsx";

function AppLayout() {
    return (
        <>
            <a className="skip-link" href="#contenido">Saltar al contenido</a>
            <AppHeader />
            <main id="contenido" tabIndex={-1}>
                <Outlet />
            </main>
            <AppFooter />
        </>
    );
}

export default AppLayout;
