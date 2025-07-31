import React from "react";

const UserHistory = ({
    bookingCount,
    reviewCount,
    bookingList = [],
    onBookingClick,
}) => {
    return (
        <div>
            <p><strong>Reservas realizadas:</strong> {bookingCount}</p>
            <p><strong>Reseñas publicadas:</strong> {reviewCount}</p>

            <h6>Mis reservas</h6>
            {bookingList.length === 0 && (
                <p style={{ color: "#888" }}>No tienes reservas.</p>
            )}

            <ul style={{ maxHeight: 220, overflowY: "auto", paddingLeft: 0 }}>
                {bookingList.map((booking) => (
                    <li
                        key={booking._id}
                        style={{ listStyle: "none", marginBottom: 10 }}
                    >
                        <button
                            style={{
                                background: "#f0f0f0",
                                border: "none",
                                borderRadius: 5,
                                padding: "7px 14px",
                                width: "100%",
                                textAlign: "left",
                                cursor: "pointer",
                                fontWeight: 500,
                            }}
                            onClick={() => onBookingClick(booking)}
                        >
                            {booking.tourName}{" "}
                            <span style={{ fontSize: "0.87rem", color: "#555" }}>
                                {new Date(booking.bookAt).toLocaleDateString()}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            <p style={{ fontSize: "0.9rem", color: "#777" }}>
                Haz clic en una reserva para ver el detalle y descargar tu nota de pedido.
            </p>
        </div>
    );
};

export default UserHistory;
