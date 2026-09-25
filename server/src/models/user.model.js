import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM("consumer", "entrepreneur", "admin"),
        allowNull: false,
        defaultValue: "consumer"
    },
    is_email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "users",
    timestamps: true,
    underscored: true
});
