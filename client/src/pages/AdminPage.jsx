import { useState } from "react";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import PageBanner from "../components/PageBanner.jsx";
import AdminEventLocations from "../components/AdminEventLocations.jsx";
import AdminProducts from "../components/AdminProducts.jsx";

const TABS = [
    { id: "locations", label: "Ferias", Panel: AdminEventLocations },
    { id: "products", label: "Moderación de productos", Panel: AdminProducts }
];

// Panel del administrador: gestiona las ferias y modera productos (el backend solo acepta estas acciones de su rol)
function AdminPage() {
    useDocumentTitle("Administración");
    const [activeTabId, setActiveTabId] = useState(TABS[0].id);
    const activeTab = TABS.find((tab) => tab.id === activeTabId);
    const ActivePanel = activeTab.Panel;

    return (
        <>
            <PageBanner tag="Administración" title="Panel de administración" lead="Habilitá las ferias donde los emprendedores cargan sus horarios y retirá los productos que no correspondan." />
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
