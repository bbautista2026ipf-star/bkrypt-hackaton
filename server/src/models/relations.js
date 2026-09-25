import { User } from "./user.model.js";
import { EntrepreneurProfile } from "./entrepreneur_profile.model.js";
import { Product } from "./product.model.js";
import { EventLocation } from "./event_location.model.js";
import { Schedule } from "./schedule.model.js";
import { Review } from "./review.model.js";
import { EntrepreneurEventLocation } from "./entrepreneur_event_location.model.js";

// Los alias describen qué representa el modelo destino desde el punto de vista del modelo origen
export const setupRelations = () => {
    // User 1:1 EntrepreneurProfile
    User.hasOne(EntrepreneurProfile, {
        foreignKey: "user_id",
        as: "entrepreneurProfile",
        onDelete: "CASCADE"
    });
    EntrepreneurProfile.belongsTo(User, {
        foreignKey: "user_id",
        as: "owner"
    });

    // EntrepreneurProfile 1:N Product
    EntrepreneurProfile.hasMany(Product, {
        foreignKey: "entrepreneur_profile_id",
        as: "products",
        onDelete: "CASCADE"
    });
    Product.belongsTo(EntrepreneurProfile, {
        foreignKey: "entrepreneur_profile_id",
        as: "entrepreneur"
    });

    // EntrepreneurProfile 1:N Schedule
    EntrepreneurProfile.hasMany(Schedule, {
        foreignKey: "entrepreneur_profile_id",
        as: "schedules",
        onDelete: "CASCADE"
    });
    Schedule.belongsTo(EntrepreneurProfile, {
        foreignKey: "entrepreneur_profile_id",
        as: "entrepreneur"
    });

    // EventLocation 1:N Schedule
    EventLocation.hasMany(Schedule, {
        foreignKey: "event_location_id",
        as: "schedules",
        onDelete: "CASCADE"
    });
    Schedule.belongsTo(EventLocation, {
        foreignKey: "event_location_id",
        as: "location"
    });

    // User 1:N Review
    User.hasMany(Review, {
        foreignKey: "user_id",
        as: "reviews",
        onDelete: "CASCADE"
    });
    Review.belongsTo(User, {
        foreignKey: "user_id",
        as: "author"
    });

    // Product 1:N Review
    Product.hasMany(Review, {
        foreignKey: "product_id",
        as: "reviews",
        onDelete: "CASCADE"
    });
    Review.belongsTo(Product, {
        foreignKey: "product_id",
        as: "product"
    });

    // EntrepreneurProfile N:M EventLocation a través de EntrepreneurEventLocation
    EntrepreneurProfile.belongsToMany(EventLocation, {
        through: EntrepreneurEventLocation,
        foreignKey: "entrepreneur_profile_id",
        otherKey: "event_location_id",
        as: "fairs",
        onDelete: "CASCADE"
    });
    EventLocation.belongsToMany(EntrepreneurProfile, {
        through: EntrepreneurEventLocation,
        foreignKey: "event_location_id",
        otherKey: "entrepreneur_profile_id",
        as: "entrepreneurs",
        onDelete: "CASCADE"
    });
};
