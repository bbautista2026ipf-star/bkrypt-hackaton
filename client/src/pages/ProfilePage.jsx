import { Link } from "react-router";
import useAuth from "../hooks/useAuth.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import PageBanner from "../components/PageBanner.jsx";
import EmailVerificationNotice from "../components/EmailVerificationNotice.jsx";
import EntrepreneurRequestStatus from "../components/EntrepreneurRequestStatus.jsx";
import BusinessProfileForm from "../components/BusinessProfileForm.jsx";
import { PATHS, ROLE_LABELS, ROLES } from "../lib/constants.js";

function ProfilePage() {
    useDocumentTitle("Mi perfil");
    const { user, role, entrepreneurProfile, entrepreneurRequest } = useAuth();
    const hasPendingRequest = entrepreneurRequest?.status === "pending";

    return (
        <>
            <PageBanner tag={ROLE_LABELS[role]} title={`Hola, ${user.name}`} lead={user.email} />
            <div className="container">
                {user.is_email_verified ? null : (
                    <EmailVerificationNotice reason="Tu correo todavía no está verificado." />
                )}

                {role === ROLES.admin ? (
                    <section className="card card-body" aria-labelledby="admin-title">
                        <h2 id="admin-title" className="h4">Administración de la plataforma</h2>
                        <p>Desde el panel revisás solicitudes de emprendedores, habilitás eventos y moderás opiniones reportadas.</p>
                        <div><Link className="btn btn-primary" to={PATHS.admin}>Ir al panel</Link></div>
                    </section>
                ) : null}

                {role === ROLES.entrepreneur && entrepreneurProfile ? (
                    <section className="card card-body" aria-labelledby="business-title">
                        <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
                            <h2 id="business-title" className="h4 mb-0">Datos de {entrepreneurProfile.brand_name}</h2>
                            <div className="d-flex flex-wrap gap-2">
                                <Link className="btn btn-outline-primary" to={PATHS.myCatalog}>Mi catálogo</Link>
                                <Link className="btn btn-outline-primary" to={PATHS.entrepreneur(entrepreneurProfile.id)}>Ver mi perfil público</Link>
                            </div>
                        </div>
                        <BusinessProfileForm />
                    </section>
                ) : null}

                {role === ROLES.consumer ? (
                    <section className="card card-body" aria-labelledby="become-entrepreneur-title">
                        <h2 id="become-entrepreneur-title" className="h4">¿Tenés un emprendimiento?</h2>
                        {entrepreneurRequest ? <EntrepreneurRequestStatus request={entrepreneurRequest} /> : null}
                        {hasPendingRequest ? null : (
                            <>
                                <p>Completá los datos de tu emprendimiento sin crear otra cuenta. La administración revisa la solicitud y, al aprobarla, podés publicar tu catálogo.</p>
                                <BusinessProfileForm />
                            </>
                        )}
                    </section>
                ) : null}
            </div>
        </>
    );
}

export default ProfilePage;
