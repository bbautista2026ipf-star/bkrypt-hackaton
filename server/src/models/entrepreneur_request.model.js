import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { businessAttributes } from "./entrepreneur_profile.model.js";

export const ENTREPRENEUR_REQUEST_STATUSES = ["pending", "approved", "rejected"];

// Solicitud para pasar a rol emprendedor: el perfil y el cambio de rol solo existen cuando el administrador la aprueba
export const EntrepreneurRequest = sequelize.define("EntrepreneurRequest", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    ...businessAttributes,
    // Lista de ids de ferias guardada como texto JSON: DataTypes.JSON se comporta distinto en MariaDB (XAMPP) y MySQL
    event_location_ids: {
        type: DataTypes.TEXT,
        get() {
            return JSON.parse(this.getDataValue("event_location_ids") || "[]");
        },
        set(value) {
            this.setDataValue("event_location_ids", JSON.stringify(Array.isArray(value) ? [...new Set(value)] : []));
        }
    },
    status: {
        type: DataTypes.ENUM(...ENTREPRENEUR_REQUEST_STATUSES),
        allowNull: false,
        defaultValue: "pending"
    },
    rejection_reason: {
        type: DataTypes.STRING(500)
    },
    reviewed_at: {
        type: DataTypes.DATE
    }
}, {
    tableName: "entrepreneur_requests",
    timestamps: true,
    underscored: true
});
