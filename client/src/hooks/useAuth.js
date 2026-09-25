import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

function useAuth() {
    return useContext(AuthContext);
}

export default useAuth;
