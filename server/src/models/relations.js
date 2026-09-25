import { User } from "./user.model.js";
import { EntrepreneurProfile } from "./entrepreneur_profile.model.js";
import { EntrepreneurRequest } from "./entrepreneur_request.model.js";
import { Product } from "./product.model.js";
import { EventLocation } from "./event_location.model.js";
import { Event } from "./event.model.js";
import { PresenceRequest } from "./presence_request.model.js";
import { Review } from "./review.model.js";
import { Opinion } from "./opinion.model.js";
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

    // User 1:N EntrepreneurRequest
    User.hasMany(EntrepreneurRequest, {
        foreignKey: "user_id",
        as: "entrepreneurRequests",
        onDelete: "CASCADE"
    });
    EntrepreneurRequest.belongsTo(User, {
        foreignKey: "user_id",
        as: "applicant"
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

    // EventLocation 1:N Event
    EventLocation.hasMany(Event, {
        foreignKey: "event_location_id",
        as: "events",
        onDelete: "CASCADE"
    });
    Event.belongsTo(EventLocation, {
        foreignKey: "event_location_id",
        as: "location"
    });

    // User (administrador) 1:N Event
    User.hasMany(Event, {
        foreignKey: "created_by",
        as: "createdEvents",
        onDelete: "RESTRICT"
    });
    Event.belongsTo(User, {
        foreignKey: "created_by",
        as: "creator"
    });

    // Event 1:N PresenceRequest
    Event.hasMany(PresenceRequest, {
        foreignKey: "event_id",
        as: "presenceRequests",
        onDelete: "CASCADE"
    });
    PresenceRequest.belongsTo(Event, {
        foreignKey: "event_id",
        as: "event"
    });

    // EntrepreneurProfile 1:N PresenceRequest
    EntrepreneurProfile.hasMany(PresenceRequest, {
        foreignKey: "entrepreneur_profile_id",
        as: "presenceRequests",
        onDelete: "CASCADE"
    });
    PresenceRequest.belongsTo(EntrepreneurProfile, {
        foreignKey: "entrepreneur_profile_id",
        as: "entrepreneur"
    });

    // Event N:M EntrepreneurProfile a través de PresenceRequest: crea el índice único que impide solicitar dos veces el mismo evento
    Event.belongsToMany(EntrepreneurProfile, {
        through: PresenceRequest,
        foreignKey: "event_id",
        otherKey: "entrepreneur_profile_id",
        uniqueKey: "presence_event_entrepreneur_unique",
        as: "entrepreneurs"
    });
    EntrepreneurProfile.belongsToMany(Event, {
        through: PresenceRequest,
        foreignKey: "entrepreneur_profile_id",
        otherKey: "event_id",
        uniqueKey: "presence_event_entrepreneur_unique",
        as: "events"
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

    // User 1:N Opinion
    User.hasMany(Opinion, {
        foreignKey: "user_id",
        as: "opinions",
        onDelete: "CASCADE"
    });
    Opinion.belongsTo(User, {
        foreignKey: "user_id",
        as: "author"
    });

    // EntrepreneurProfile 1:N Opinion
    EntrepreneurProfile.hasMany(Opinion, {
        foreignKey: "entrepreneur_profile_id",
        as: "opinions",
        onDelete: "CASCADE"
    });
    Opinion.belongsTo(EntrepreneurProfile, {
        foreignKey: "entrepreneur_profile_id",
        as: "entrepreneur"
    });

    // EntrepreneurProfile N:M EventLocation a través de EntrepreneurEventLocation
    // uniqueKey: el nombre autogenerado del índice único supera el límite de 64 caracteres de MySQL
    EntrepreneurProfile.belongsToMany(EventLocation, {
        through: EntrepreneurEventLocation,
        foreignKey: "entrepreneur_profile_id",
        otherKey: "event_location_id",
        uniqueKey: "entrepreneur_fair_unique",
        as: "fairs",
        onDelete: "CASCADE"
    });
    EventLocation.belongsToMany(EntrepreneurProfile, {
        through: EntrepreneurEventLocation,
        foreignKey: "event_location_id",
        otherKey: "entrepreneur_profile_id",
        uniqueKey: "entrepreneur_fair_unique",
        as: "entrepreneurs",
        onDelete: "CASCADE"
    });
};
