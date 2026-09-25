import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// Tabla intermedia de la relación N:M entre emprendedores y ferias
export const EntrepreneurEventLocation = sequelize.define("EntrepreneurEventLocation", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    entrepreneur_profile_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    event_location_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    tableName: "entrepreneur_event_locations",
    timestamps: true,
    underscored: true,
    indexes: [
        { unique: true, fields: ["entrepreneur_profile_id", "event_location_id"] }
    ]
});
