import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const OPINION_COMMENT_MAX_LENGTH = 500;

// Opinión sobre la experiencia con un emprendedor (muro del perfil); las reseñas de cada producto viven en Review
export const Opinion = sequelize.define("Opinion", {
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
        type: DataTypes.STRING(OPINION_COMMENT_MAX_LENGTH),
        allowNull: false
    },
    // El emprendedor no puede borrar opiniones ajenas: solo reportarlas para que las revise el administrador
    is_reported: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    report_reason: {
        type: DataTypes.STRING
    },
    reported_at: {
        type: DataTypes.DATE
    }
}, {
    tableName: "opinions",
    timestamps: true,
    underscored: true,
    // Una opinión por usuario por emprendedor (si vuelve a opinar, se actualiza la existente)
    indexes: [
        { unique: true, fields: ["user_id", "entrepreneur_profile_id"] }
    ]
});
