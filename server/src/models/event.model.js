import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// Fecha concreta de una feria, habilitada por el administrador en una de las ubicaciones cargadas (event_locations)
export const Event = sequelize.define("Event", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    event_location_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    starts_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    ends_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    // Campo derivado, no se persiste: siempre refleja el estado actual sin necesidad de un cron
    is_active_now: {
        type: DataTypes.VIRTUAL,
        get() {
            const now = new Date();
            return now >= this.getDataValue("starts_at") && now <= this.getDataValue("ends_at");
        }
    }
}, {
    tableName: "events",
    timestamps: true,
    underscored: true
});
