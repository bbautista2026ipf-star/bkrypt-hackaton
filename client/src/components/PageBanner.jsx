import PropTypes from "prop-types";

// Encabezado de cada vista con los colores del afiche: fucsia, etiqueta amarilla y trama de puntos
function PageBanner({ title, lead, tag, children }) {
    return (
        <section className="page-banner py-4 py-lg-5 mb-4">
            <div className="container fade-in-up">
                {tag ? <p className="banner-tag mb-2">{tag}</p> : null}
                <h1 className="display-6 mb-2">{title}</h1>
                {lead ? <p className="lead mb-0">{lead}</p> : null}
                {children ? <div className="d-flex flex-wrap gap-2 mt-3">{children}</div> : null}
            </div>
        </section>
    );
}

PageBanner.propTypes = {
    title: PropTypes.string.isRequired,
    lead: PropTypes.string,
    tag: PropTypes.string,
    children: PropTypes.node
};

export default PageBanner;
