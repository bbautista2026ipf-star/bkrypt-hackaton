import { Link } from "react-router";
import useAuth from "../hooks/useAuth.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import PageBanner from "../components/PageBanner.jsx";
import BusinessProfileForm from "../components/BusinessProfileForm.jsx";
import { PATHS, ROLE_LABELS, ROLES } from "../lib/constants.js";

function ProfilePage() {
    useDocumentTitle("Mi perfil");
    const { user, role, entrepreneurProfile } = useAuth();

    return (
        <>
            <PageBanner tag={ROLE_LABELS[role]} title={`Hola, ${user.name}`} lead={user.email} />
            <div className="container">
                {role === ROLES.admin ? (
                    <section className="card card-body" aria-labelledby="admin-title">
                        <h2 id="admin-title" className="h4">Administración de la plataforma</h2>
                        <p>Desde el panel gestionás las ferias y moderás los productos publicados.</p>
                        <div><Link className="btn btn-primary" to={PATHS.admin}>Ir al panel</Link></div>
                    </section>
                ) : null}

                {role === ROLES.entrepreneur && entrepreneurProfile ? (
                    <section className="card card-body" aria-labelledby="business-title">
                        <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
                            <h2 id="business-title" className="h4 mb-0">Datos de {entrepreneurProfile.brand_name}</h2>
                            <div className="d-flex flex-wrap gap-2">
                                <Link className="btn btn-outline-primary" to={PATHS.myCatalog}>Mi catálogo</Link>
                                <Link className="btn btn-outline-primary" to={PATHS.agenda}>Mis horarios</Link>
                                <Link className="btn btn-outline-primary" to={PATHS.entrepreneur(entrepreneurProfile.id)}>Ver mi perfil público</Link>
                            </div>
                        </div>
                        <BusinessProfileForm />
                    </section>
                ) : null}

                {role === ROLES.consumer ? (
                    <section className="card card-body" aria-labelledby="consumer-title">
                        <h2 id="consumer-title" className="h4">Tu cuenta de consumidor</h2>
                        <p className="mb-2">Podés buscar productos, ver las ferias en el mapa y la agenda, y calificar los productos que compraste.</p>
                        <p className="mb-0">
                            ¿Tenés un emprendimiento? El tipo de cuenta se elige al registrarse: creá una cuenta de emprendedor con otro correo para publicar tu catálogo.
                        </p>
                    </section>
                ) : null}
            </div>
        </>
    );
}

export default ProfilePage;
