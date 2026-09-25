import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Review = sequelize.define("Review", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    comment: {
        type: DataTypes.TEXT
    }
}, {
    tableName: "reviews",
    timestamps: true,
    underscored: true,
    // Una calificación por usuario por producto (si vuelve a calificar, se actualiza la existente)
    indexes: [
        { unique: true, fields: ["user_id", "product_id"] }
    ]
});
