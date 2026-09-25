import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EntrepreneurProfile = sequelize.define("EntrepreneurProfile", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true // refuerza la relación 1:1 con User
    },
    brand_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    biography: {
        type: DataTypes.TEXT
    },
    whatsapp_number: {
        type: DataTypes.STRING
    },
    verification_document_url: {
        type: DataTypes.STRING
    },
    // Sello de confianza, solo un admin puede activarlo
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "entrepreneur_profiles",
    timestamps: true,
    underscored: true
});
