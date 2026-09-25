import { useState } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import PageBanner from "../components/PageBanner.jsx";
import AdminEntrepreneurRequests from "../components/AdminEntrepreneurRequests.jsx";
import AdminPresenceRequests from "../components/AdminPresenceRequests.jsx";
import AdminEvents from "../components/AdminEvents.jsx";
import AdminEventLocations from "../components/AdminEventLocations.jsx";
import AdminReportedOpinions from "../components/AdminReportedOpinions.jsx";

const TABS = [
    { id: "entrepreneur-requests", label: "Solicitudes de emprendedor", Panel: AdminEntrepreneurRequests },
    { id: "presence-requests", label: "Solicitudes de presencia", Panel: AdminPresenceRequests },
    { id: "events", label: "Eventos", Panel: AdminEvents },
    { id: "locations", label: "Ubicaciones de ferias", Panel: AdminEventLocations },
    { id: "reported-opinions", label: "Opiniones reportadas", Panel: AdminReportedOpinions }
];

// Panel del administrador (creador de la plataforma). Cada sección pide sus datos a rutas /api/admin que exigen rol admin.
function AdminPage() {
    useDocumentTitle("Administración");
    const [activeTabId, setActiveTabId] = useState(TABS[0].id);
    const activeTab = TABS.find((tab) => tab.id === activeTabId);
    const ActivePanel = activeTab.Panel;

    return (
        <>
            <PageBanner tag="Administración" title="Panel de administración" lead="Aprobá emprendedores, habilitá eventos y moderá las opiniones reportadas." />
            <div className="container">
                <ul className="nav nav-pills flex-column flex-md-row gap-2 mb-4" role="tablist">
                    {TABS.map((tab) => (
                        <li className="nav-item" role="presentation" key={tab.id}>
                            <button
                                type="button"
                                id={`tab-${tab.id}`}
                                className={`nav-link w-100${tab.id === activeTabId ? " active" : ""}`}
                                role="tab"
                                aria-selected={tab.id === activeTabId}
                                aria-controls={`panel-${tab.id}`}
                                onClick={() => setActiveTabId(tab.id)}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
                <section id={`panel-${activeTab.id}`} role="tabpanel" aria-labelledby={`tab-${activeTab.id}`} className="fade-in-up" key={activeTab.id}>
                    <h2 className="visually-hidden">{activeTab.label}</h2>
                    <ActivePanel />
                </section>
            </div>
        </>
    );
}

export default AdminPage;
