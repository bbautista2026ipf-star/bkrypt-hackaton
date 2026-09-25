import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Schedule = sequelize.define("Schedule", {
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
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    // Campo derivado, no se persiste: siempre refleja el estado actual sin necesidad de un cron
    is_active_now: {
        type: DataTypes.VIRTUAL,
        get() {
            const now = new Date();
            return now >= this.getDataValue("start_time") && now <= this.getDataValue("end_time");
        }
    }
}, {
    tableName: "schedules",
    timestamps: true,
    underscored: true
});
