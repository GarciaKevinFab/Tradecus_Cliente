import React, { useRef, useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import moment from "moment";
import { MdClose, MdDownload } from "react-icons/md";
import html2pdf from "html2pdf.js/dist/html2pdf.bundle";

const COLORS = {
    primary: "#2176FF",
    danger: "#fc4242",
    accent: "#168a3b",
    bgSoft: "#F7FAFC",
    textLight: "#666",
    border: "#E4E6EF"
};

const labelStyle = {
    minWidth: 140,
    fontWeight: 500,
    color: "#343",
    fontSize: "1.03rem",
    display: "inline-block",
    paddingRight: 6
};
const valueStyle = {
    fontWeight: 600,
    color: "#1d1d1d",
    fontSize: "1.09rem"
};

// --- NUEVO: Estilos solo para PDF ---
const PDF_CONTAINER_STYLE = {
    background: "#fff",
    borderRadius: 18,
    border: `1.8px solid #e3e8ef`,
    width: "700px",
    minHeight: "750px",
    margin: "0 auto",
    padding: "2.3rem 2.2rem 1.5rem 2.2rem",
    fontFamily: "'Segoe UI', Arial, sans-serif"
};

const WEB_CONTAINER_STYLE = {
    background: "#fff",
    borderRadius: 14,
    border: `1.2px solid #e3e8ef`,
    width: "100%",
    maxWidth: 500,
    margin: "0 auto",
    padding: "1.2rem 1.1rem 1.1rem 1.1rem",
    fontFamily: "'Segoe UI', Arial, sans-serif"
};

const CustomModal = ({ isOpen, onRequestClose, booking }) => {
    const pdfRef = useRef();
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !booking || !booking._id) return null;

    // --- PDF Download que cambia el estilo solo para exportar ---
    const handleDownloadPDF = async () => {
        setError(null);
        if (!pdfRef.current) {
            setError("No hay datos para descargar.");
            return;
        }
        setDownloading(true);
        try {
            // 1. Añade clase "pdf-export" solo mientras generas PDF
            pdfRef.current.classList.add("pdf-export");
            // 2. Haz la exportación
            const opt = {
                margin: 0,
                filename: `NotaPedido_${booking._id || "reserva"}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "pt", format: "a4", orientation: "portrait" }
            };
            await html2pdf().from(pdfRef.current).set(opt).save();
        } catch (err) {
            setError("Error al generar el PDF.");
        } finally {
            // 3. Quita la clase (vuelve al estilo modal normal)
            pdfRef.current.classList.remove("pdf-export");
            setDownloading(false);
        }
    };

    // --- Usamos el estilo correcto según si está en exportación PDF o no ---

    return (
        <Modal isOpen={isOpen} toggle={onRequestClose} centered fade={true}>
            <ModalHeader
                toggle={onRequestClose}
                style={{
                    background: COLORS.bgSoft,
                    borderBottom: `1px solid ${COLORS.border}`,
                    fontWeight: 800,
                    fontSize: "1.2rem"
                }}
            >
                <MdDownload style={{ marginRight: 8, color: COLORS.primary, fontSize: 21 }} />
                Detalle de la Reserva
            </ModalHeader>
            <ModalBody style={{ background: "#fff", padding: "1.3rem 0.4rem 1.1rem 0.4rem" }}>
                <div
                    ref={pdfRef}
                    style={WEB_CONTAINER_STYLE}
                >
                    {/* --- PDF Y MODAL, ambos usan este contenido --- */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 15
                    }}>
                        <img
                            src={require("../../assets/images/logo.png")}
                            alt="Logo"
                            style={{ width: 40, height: 40, borderRadius: 7, objectFit: "contain" }}
                        />
                        <div style={{ textAlign: "right" }}>
                            <span style={{
                                fontWeight: 900, fontSize: 18.5, color: COLORS.primary, letterSpacing: ".07em"
                            }}>NOTA DE PEDIDO</span>
                            <div style={{ fontSize: 12, color: "#999" }}>
                                N° {booking._id.slice(-8).toUpperCase()}
                            </div>
                        </div>
                    </div>
                    <hr style={{ border: "none", borderTop: "1.3px solid #e4e6ef", margin: "6px 0 12px 0" }} />
                    {/* Datos principales */}
                    <div style={{ fontSize: 15.7, marginBottom: 16 }}>
                        <div style={{ display: "flex", marginBottom: 10 }}>
                            <span style={labelStyle}>Tour:</span>
                            <span style={valueStyle}>{booking.tourName || <span style={{ color: COLORS.danger }}>Sin nombre</span>}</span>
                        </div>
                        <div style={{ display: "flex", marginBottom: 10 }}>
                            <span style={labelStyle}>Tipo:</span>
                            <span style={valueStyle}>{booking.tourType || "--"}</span>
                        </div>
                        <div style={{ display: "flex", marginBottom: 10 }}>
                            <span style={labelStyle}>Fecha reserva:</span>
                            <span style={valueStyle}>{booking.bookAt ? moment(booking.bookAt).format("LL") : "--"}</span>
                        </div>
                        <div style={{ display: "flex", marginBottom: 10 }}>
                            <span style={labelStyle}>Número invitados:</span>
                            <span style={valueStyle}>{booking.guestSize ?? "--"}</span>
                        </div>
                        <div style={{ display: "flex", marginBottom: 10 }}>
                            <span style={labelStyle}>Email:</span>
                            <span style={valueStyle}>{booking.userEmail || "--"}</span>
                        </div>
                        <div style={{ display: "flex", marginBottom: 12 }}>
                            <span style={labelStyle}>Teléfono:</span>
                            <span style={valueStyle}>{booking.phone || "--"}</span>
                        </div>
                        <hr style={{ border: "none", borderTop: "1.2px dashed #d3e2d7", margin: "10px 0 10px 0" }} />
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center"
                        }}>
                            <span style={{
                                color: COLORS.accent, fontWeight: 800, fontSize: 18, marginRight: 10
                            }}>
                                Total:
                            </span>
                            <span style={{
                                color: COLORS.accent, fontWeight: 900, fontSize: 23, letterSpacing: ".04em"
                            }}>
                                S/. {booking.price ?? "--"}
                            </span>
                        </div>
                    </div>
                    <div style={{
                        marginTop: 20,
                        textAlign: "center",
                        fontSize: 14,
                        color: "#888",
                        fontStyle: "italic"
                    }}>
                        Gracias por tu reserva. <br />
                        Presenta este comprobante al inicio del tour.<br />
                        <span style={{ fontSize: 11.5, color: "#bbb" }}>
                            (Emitido el {moment().format("LL")})
                        </span>
                    </div>
                </div>

                {error && (
                    <div style={{ color: COLORS.danger, marginBottom: 8, marginTop: 6, fontWeight: 600, fontSize: "1rem" }}>
                        {error}
                    </div>
                )}
                <div style={{
                    marginTop: 18,
                    display: "flex",
                    gap: 12,
                    justifyContent: "flex-end",
                    flexWrap: "wrap"
                }}>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        style={{
                            background: COLORS.primary,
                            color: "#fff",
                            border: "none",
                            borderRadius: 7,
                            padding: "10px 20px",
                            cursor: downloading ? "not-allowed" : "pointer",
                            fontWeight: 700,
                            fontSize: "1.04rem",
                            boxShadow: "0 1px 5px 0 #d6d7e6"
                        }}
                    >
                        <MdDownload style={{ verticalAlign: "middle", marginRight: 7, fontSize: 20 }} />
                        {downloading ? "Descargando..." : "Descargar PDF"}
                    </button>
                    <button
                        onClick={onRequestClose}
                        style={{
                            background: "#f3f3f3",
                            color: "#333",
                            border: "none",
                            borderRadius: 7,
                            padding: "10px 20px",
                            fontWeight: 600,
                            fontSize: "1.04rem",
                            boxShadow: "0 1px 3px 0 #ececec"
                        }}
                    >
                        <MdClose style={{ verticalAlign: "middle", marginRight: 7, fontSize: 20 }} />
                        Cerrar
                    </button>
                </div>
                <div style={{ textAlign: "center", color: COLORS.textLight, marginTop: 10, fontSize: "0.94rem" }}>
                    Descarga y guarda tu comprobante.<br />
                    <span style={{ fontSize: "0.81rem" }}>
                        ¿Problemas? <b>Contacta soporte</b>
                    </span>
                </div>

                {/* --- SOLO PARA PDF: ESTILOS FORZADOS --- */}
                <style>{`
                    .pdf-export {
                        width: 700px !important;
                        min-height: 750px !important;
                        max-width: 100% !important;
                        box-shadow: none !important;
                        border-radius: 18px !important;
                        padding: 2.3rem 2.2rem 1.5rem 2.2rem !important;
                        font-size: 1.15rem !important;
                    }
                `}</style>
            </ModalBody>
        </Modal>
    );
};

export default CustomModal;
