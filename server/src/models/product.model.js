import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    entrepreneur_profile_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    // ENUM cerrado para que los filtros por categoría no se rompan por errores de tipeo o mayúsculas
    category: {
        type: DataTypes.ENUM("alimentos", "artesanias", "indumentaria", "cosmetica", "otros"),
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 }
    },
    // Se deriva del stock en lugar de guardarse: así nunca puede figurar disponible un producto con stock 0
    is_available: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.getDataValue("stock") > 0;
        }
    }
}, {
    tableName: "products",
    timestamps: true,
    underscored: true
});
