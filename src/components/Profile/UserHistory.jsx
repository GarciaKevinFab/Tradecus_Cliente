import React from "react";

const COLORS = {
    primary: "#2176FF",
    accent: "#168a3b",
    grayText: "#6C757D",
    soft: "#F7FAFC",
    border: "#E4E6EF"
};

const UserHistory = ({
    bookingCount,
    reviewCount,
    bookingList = [],
    onBookingClick,
}) => {
    return (
        <div
            style={{
                background: COLORS.soft,
                borderRadius: 13,
                boxShadow: "0 1px 7px 0 #eaecef",
                padding: "1.3rem 1.2rem 1rem 1.2rem",
                marginTop: 10
            }}
        >
            <div style={{
                display: "flex",
                gap: 18,
                marginBottom: 18,
                alignItems: "center"
            }}>
                <span style={{
                    background: "#e3f2fd",
                    color: COLORS.primary,
                    fontWeight: 700,
                    fontSize: "1.08rem",
                    borderRadius: 7,
                    padding: "6px 18px"
                }}>
                    Reservas: {bookingCount}
                </span>
                <span style={{
                    background: "#e8f5e9",
                    color: COLORS.accent,
                    fontWeight: 700,
                    fontSize: "1.08rem",
                    borderRadius: 7,
                    padding: "6px 18px"
                }}>
                    Reseñas: {reviewCount}
                </span>
            </div>

            <div style={{
                fontWeight: 600,
                fontSize: "1.06rem",
                color: "#233"
            }}>
                Mis reservas
            </div>

            {bookingList.length === 0 && (
                <div style={{
                    color: COLORS.grayText,
                    margin: "15px 0 15px 0",
                    padding: "18px 0",
                    borderRadius: 7,
                    textAlign: "center",
                    background: "#f5f5f5"
                }}>
                    <span role="img" aria-label="empty">🗂️</span>
                    <br />
                    No tienes reservas aún.<br />
                    ¡Reserva un tour para estrenar tu historial!
                </div>
            )}

            <ul style={{
                maxHeight: 220,
                overflowY: "auto",
                paddingLeft: 0,
                margin: "0 0 10px 0"
            }}>
                {bookingList.map((booking) => (
                    <li
                        key={booking._id}
                        style={{ listStyle: "none", marginBottom: 9 }}
                    >
                        <button
                            style={{
                                background: "#fff",
                                border: `1.2px solid ${COLORS.border}`,
                                borderRadius: 8,
                                padding: "10px 16px",
                                width: "100%",
                                textAlign: "left",
                                cursor: "pointer",
                                fontWeight: 500,
                                fontSize: "1.08rem",
                                color: "#252525",
                                transition: "background .16s, box-shadow .16s",
                                boxShadow: "0 1px 2px #f0f3fa",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                            onClick={() => {
                                if (onBookingClick) onBookingClick(booking);
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.background = "#f2f8fd";
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = "#fff";
                            }}
                        >
                            <span style={{
                                fontWeight: 600,
                                color: COLORS.primary
                            }}>
                                {booking.tourName}
                            </span>
                            <span style={{
                                fontSize: "0.99rem",
                                color: COLORS.grayText,
                                fontWeight: 500,
                                marginLeft: 20
                            }}>
                                {new Date(booking.bookAt).toLocaleDateString()}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            <div style={{
                fontSize: "0.93rem",
                color: COLORS.grayText,
                marginTop: 8,
                textAlign: "center"
            }}>
                Haz clic en una reserva para ver el detalle y descargar tu nota de pedido.
            </div>
        </div>
    );
};

export default UserHistory;
