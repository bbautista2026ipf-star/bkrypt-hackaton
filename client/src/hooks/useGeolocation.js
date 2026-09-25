import { useEffect, useState } from "react";

const POSITION_OPTIONS = { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 };

const IDLE = { status: "idle", coords: null };
const LOCATING = { status: "locating", coords: null };
const UNAVAILABLE = { status: "unavailable", coords: null };

const isGeolocationSupported = () => "geolocation" in navigator;

// status: "idle" | "locating" | "granted" | "denied" | "unavailable"
function useGeolocation(enabled) {
    const [lastResult, setLastResult] = useState(null);

    useEffect(() => {
        if (!enabled || !isGeolocationSupported()) {
            return undefined;
        }
        let isCurrent = true;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (isCurrent) {
                    setLastResult({ status: "granted", coords: { lat: position.coords.latitude, lng: position.coords.longitude } });
                }
            },
            (error) => {
                if (isCurrent) {
                    setLastResult({ status: error.code === error.PERMISSION_DENIED ? "denied" : "unavailable", coords: null });
                }
            },
            POSITION_OPTIONS
        );
        return () => {
            isCurrent = false;
        };
    }, [enabled]);

    if (!enabled) {
        return IDLE;
    }
    if (!isGeolocationSupported()) {
        return UNAVAILABLE;
    }
    return lastResult ?? LOCATING;
}

export default useGeolocation;
