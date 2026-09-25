import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EventLocation = sequelize.define("EventLocation", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    }
}, {
    tableName: "event_locations",
    timestamps: true,
    underscored: true
});
