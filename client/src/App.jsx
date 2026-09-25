import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ROLES } from "./lib/constants.js";
import AppLayout from "./components/AppLayout.jsx";
import RequireSession from "./components/RequireSession.jsx";
import LoadingState from "./components/LoadingState.jsx";
import HomePage from "./pages/HomePage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import EntrepreneurProfilePage from "./pages/EntrepreneurProfilePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import MyCatalogPage from "./pages/MyCatalogPage.jsx";
import ForbiddenPage from "./pages/ForbiddenPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Mapa (Leaflet), agenda (FullCalendar) y administración se descargan solo cuando se visitan
const MapPage = lazy(() => import("./pages/MapPage.jsx"));
const AgendaPage = lazy(() => import("./pages/AgendaPage.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));
const ProductEditorPage = lazy(() => import("./pages/ProductEditorPage.jsx"));

// Las rutas de gestión exigen sesión y rol; el backend vuelve a validar el rol en cada acción que modifica datos
function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Suspense fallback={<LoadingState message="Cargando la página..." />}>
                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="catalogo" element={<CatalogPage />} />
                            <Route path="productos/:productId" element={<ProductDetailPage />} />
                            <Route path="mapa" element={<MapPage />} />
                            <Route path="agenda" element={<AgendaPage />} />
                            <Route path="emprendedores/:entrepreneurId" element={<EntrepreneurProfilePage />} />
                            <Route path="ingresar" element={<LoginPage />} />
                            <Route path="registro" element={<RegisterPage />} />
                            <Route path="perfil" element={<RequireSession><ProfilePage /></RequireSession>} />
                            <Route path="mi-catalogo" element={<RequireSession roles={[ROLES.entrepreneur]}><MyCatalogPage /></RequireSession>} />
                            <Route path="mi-catalogo/nuevo" element={<RequireSession roles={[ROLES.entrepreneur]}><ProductEditorPage /></RequireSession>} />
                            <Route path="mi-catalogo/:productId/editar" element={<RequireSession roles={[ROLES.entrepreneur]}><ProductEditorPage /></RequireSession>} />
                            <Route path="admin" element={<RequireSession roles={[ROLES.admin]}><AdminPage /></RequireSession>} />
                            <Route path="sin-permisos" element={<ForbiddenPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
