import PropTypes from "prop-types";
import GoogleFairsMap from "./GoogleFairsMap.jsx";

// La clave se define en VITE_GOOGLE_MAPS_API_KEY (client/.env), nunca en el código
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function FairsMap({ fairs, selectedFairId = null, onSelectFair }) {
    if (!GOOGLE_MAPS_API_KEY) {
        return (
            <p className="alert alert-info" role="status">
                El mapa interactivo no está disponible en este momento. Podés elegir la feria desde la lista.
            </p>
        );
    }
    return <GoogleFairsMap apiKey={GOOGLE_MAPS_API_KEY} fairs={fairs} selectedFairId={selectedFairId} onSelectFair={onSelectFair} />;
}

FairsMap.propTypes = {
    fairs: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedFairId: PropTypes.string,
    onSelectFair: PropTypes.func.isRequired
};

export default FairsMap;
