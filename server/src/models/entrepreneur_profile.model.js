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
    // Si no tiene local, el emprendedor indica las ferias a las que asiste (tabla entrepreneur_event_locations)
    has_store: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    store_address: {
        type: DataTypes.STRING
    },
    store_latitude: {
        type: DataTypes.DECIMAL(10, 8)
    },
    store_longitude: {
        type: DataTypes.DECIMAL(11, 8)
    }
}, {
    tableName: "entrepreneur_profiles",
    timestamps: true,
    underscored: true
});
