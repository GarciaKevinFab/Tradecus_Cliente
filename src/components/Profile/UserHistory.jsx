// src/components/Profile/UserHistory.jsx
import React from "react";

const UserHistory = ({ bookingCount, reviewCount }) => {
    return (
        <div>
            <p><strong>Reservas realizadas:</strong> {bookingCount}</p>
            <p><strong>Reseñas publicadas:</strong> {reviewCount}</p>
            <p style={{ fontSize: "0.9rem", color: "#777" }}>
                En el futuro podrás ver el detalle completo de tu historial aquí.
            </p>
        </div>
    );
};

export default UserHistory;
