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
    entrepreneur_profile_id: {
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
    },
    image_url: {
        type: DataTypes.STRING
    }
}, {
    tableName: "reviews",
    timestamps: true,
    underscored: true,
    // Una reseña por consumidor por emprendedor
    indexes: [
        { unique: true, fields: ["user_id", "entrepreneur_profile_id"] }
    ]
});
