import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const PRESENCE_REQUEST_STATUSES = ["pending", "approved", "rejected"];

// Solicitud de un emprendedor para estar presente en un evento; solo las aprobadas se muestran al público
export const PresenceRequest = sequelize.define("PresenceRequest", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    event_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    entrepreneur_profile_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(...PRESENCE_REQUEST_STATUSES),
        allowNull: false,
        defaultValue: "pending"
    },
    reviewed_at: {
        type: DataTypes.DATE
    }
}, {
    tableName: "presence_requests",
    timestamps: true,
    underscored: true
    // El índice único del par (evento, emprendedor) lo crea la relación belongsToMany en relations.js
});
