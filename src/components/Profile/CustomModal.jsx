import React, { useRef } from "react";
import Modal from "react-modal";
import moment from "moment";
import { MdClose, MdDownload } from "react-icons/md";
import html2pdf from "html2pdf.js/dist/html2pdf.bundle";

// Asegúrate de tener 'react-modal', 'moment', 'html2pdf.js' y 'react-icons' instalados

Modal.setAppElement('#root');

const CustomModal = ({ isOpen, onRequestClose, booking = {}, onBookingDeleted }) => {
    const pdfRef = useRef();

    if (!booking) return null;

    const handleDownloadPDF = () => {
        if (!pdfRef.current) return;
        const opt = {
            margin: 0.5,
            filename: `NotaPedido_${booking._id || "reserva"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
        };
        html2pdf().from(pdfRef.current).set(opt).save();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Detalle de la Reserva"
            overlayClassName="ReactModal__Overlay"
            className="ReactModal__Content"
            style={{
                content: {
                    maxWidth: 480,
                    margin: "auto",
                    borderRadius: 12,
                    padding: "1.8rem 1.5rem"
                }
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 700 }}>Detalle de la Reserva</h2>
                <button onClick={onRequestClose} style={{
                    background: "transparent", border: "none", fontSize: 22, cursor: "pointer"
                }}>
                    <MdClose />
                </button>
            </div>
            <hr />

            <div ref={pdfRef} style={{ padding: "0.5rem 0" }}>
                <p><b>Tour:</b> {booking.tourName || "--"}</p>
                <p><b>Tipo:</b> {booking.tourType || "--"}</p>
                <p><b>Fecha reserva:</b> {booking.bookAt ? moment(booking.bookAt).format("LLL") : "--"}</p>
                <p><b>Número invitados:</b> {booking.guestSize || "--"}</p>
                <p><b>Email:</b> {booking.userEmail || "--"}</p>
                <p><b>Teléfono:</b> {booking.phone || "--"}</p>
                <p><b>Total:</b> <span style={{ fontWeight: 700 }}>S/. {booking.price ?? "--"}</span></p>
            </div>

            <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                    onClick={handleDownloadPDF}
                    style={{
                        background: "#2176FF", color: "#fff", border: "none",
                        borderRadius: 5, padding: "7px 16px", cursor: "pointer", fontWeight: 600
                    }}
                >
                    <MdDownload style={{ verticalAlign: "middle", marginRight: 6 }} /> Descargar PDF
                </button>
                <button
                    onClick={onRequestClose}
                    style={{
                        background: "#f3f3f3", color: "#333", border: "none",
                        borderRadius: 5, padding: "7px 16px", cursor: "pointer", fontWeight: 500
                    }}
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    );
};

export default CustomModal;
