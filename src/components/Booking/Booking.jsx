import React, { useState, useContext, useEffect } from "react";
import "./booking.css";
import Payment from "../Payment/Payment.jsx";
import IdentityField from '../Identity/IdentityField.jsx';
import LoginModal from "../Login-Modal/LoginModal.jsx";
import { Form, FormGroup, ListGroup, ListGroupItem } from "reactstrap";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from "../../utils/config";
import 'react-toastify/dist/ReactToastify.css';

const Booking = ({ tour, avgRating }) => {
    const { price, reviews, title, maxGroupSize } = tour;
    const { user } = useContext(AuthContext);

    const [booking, setBooking] = useState({
        userId: "",
        userEmail: "",
        tourName: title,
        phone: "",
        guestSize: "1",
        bookAt: "",
        tourType: "group",
    });

    const [tourType, setTourType] = useState('group');
    const [quantity, setQuantity] = useState(1);
    const [dni, setDni] = useState([""]);
    const [userData, setUserData] = useState([{}]);
    const [documentTypes, setDocumentTypes] = useState(["dni"]);

    const [currentGuests, setCurrentGuests] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    // Sincroniza usuario
    useEffect(() => {
        if (user) {
            setBooking(prev => ({
                ...prev,
                userId: user._id,
                userEmail: user.email
            }));
        }
    }, [user]);

    // Ajusta arrays según cantidad de personas
    useEffect(() => {
        const guestNum = Number(booking.guestSize);
        setDni(new Array(guestNum).fill(""));
        setUserData(new Array(guestNum).fill({}));
        setDocumentTypes(new Array(guestNum).fill("dni"));
        setQuantity(guestNum);
    }, [booking.guestSize]);

    // Carga la cantidad actual de reservas para este tour
    useEffect(() => {
        if (tour?._id) {
            axios.get(`${BASE_URL}/booking/count/${tour._id}`).then(res => {
                setCurrentGuests(res.data);
            }).catch(() => {
                setCurrentGuests(0); // fallback
            });
        }
    }, [tour]);

    // Validación de documento
    const isValidLength = (doc, type) =>
        (type === "dni" && doc.length === 8) || (type === "carnet" && doc.length === 9);

    const allDocumentsValid = dni.every((d, i) => d && isValidLength(d, documentTypes[i]));
    const allUserDataValid = userData.every(d => d?.nombres && d?.apellidoPaterno && d?.apellidoMaterno);
    const isValidPhone = /^\d{9}$/.test(booking.phone);
    const isValidDate = booking.bookAt && new Date(booking.bookAt) >= new Date().setHours(0, 0, 0, 0);
    const isBookingDataValid = allDocumentsValid && allUserDataValid && isValidDate && isValidPhone;

    // Cambia tipo de tour y ajusta máximo permitido
    const handleTourTypeChange = (e) => {
        const value = e.target.value;
        setTourType(value);
        setBooking(prev => ({
            ...prev,
            tourType: value,
            guestSize: value === "private" ? "1" : prev.guestSize
        }));
    };

    // Valida cantidad de personas
    const handleGuestSizeChange = (e) => {
        const value = Number(e.target.value);
        const remaining = maxGroupSize - currentGuests;

        if (tourType === 'private') {
            if (value < 1 || value > 2) {
                toast.error('Para un tour privado, debe haber entre 1 y 2 personas.');
                return;
            }
        } else {
            if (value < 1) {
                toast.error('Debe haber al menos 1 persona.');
                return;
            }
            if (value > remaining) {
                toast.error(`Solo quedan ${remaining} asientos disponibles.`);
                return;
            }
        }
        setBooking(prev => ({ ...prev, guestSize: value }));
    };

    const handlePhoneChange = (e) => {
        const val = e.target.value.replace(/\D/, '');
        setBooking(prev => ({ ...prev, phone: val }));
        if (val.length === 9) {
            toast.success('Teléfono válido.');
        }
    };

    const handleBookAtChange = (e) => {
        const value = e.target.value;
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (isNaN(date) || date < today) {
            toast.error('Por favor ingresa una fecha válida y futura.');
            return;
        }
        setBooking(prev => ({ ...prev, bookAt: value }));
        toast.success('Fecha válida seleccionada.');
    };

    // Previene avanzar si no está todo ok
    const handleTryBooking = () => {
        if (!user) {
            toast.error("Debes iniciar sesión para continuar.");
            setIsModalOpen(true);
            return false;
        }
        if (!isBookingDataValid) {
            toast.error("Completa correctamente todos los campos antes de reservar.");
            return false;
        }
        return true;
    };

    // Cálculo total
    const totalAmount = Number(price) * (tourType === 'private' ? 4 : 1) * Number(quantity);

    return (
        <div className="booking">
            <div className="booking__top d-flex align-items-center justify-content-between">
                <h3>S/.{price} <span>/por persona</span></h3>
                <span className="tour__rating d-flex align-items-center">
                    <i className="ri-star-s-fill"></i>{avgRating === 0 ? null : avgRating} ({reviews?.length})
                </span>
            </div>

            <div className="booking__form">
                <h5 className="text-center">INFORMACIÓN DE RESERVA</h5>
                <Form className="booking__info-form" onSubmit={e => e.preventDefault()}>
                    <FormGroup>
                        <h5>Tipo de tour</h5>
                        <select value={tourType} onChange={handleTourTypeChange}>
                            <option value="group">Tour grupal</option>
                            <option value="private">Tour privado</option>
                        </select>
                    </FormGroup>

                    <FormGroup>
                        <h5>N° de Personas</h5>
                        <input
                            type="number"
                            min="1"
                            max={tourType === "private" ? "2" : Math.max(1, maxGroupSize - currentGuests)}
                            value={booking.guestSize}
                            onChange={handleGuestSizeChange}
                        />
                        {tourType !== "private" && (
                            <div className="text-muted" style={{ fontSize: 12 }}>
                                Máximo disponible: {Math.max(0, maxGroupSize - currentGuests)}
                            </div>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <input
                            type="number"
                            placeholder="Teléfono (9 dígitos)"
                            value={booking.phone}
                            onChange={handlePhoneChange}
                        />
                        {!isValidPhone && booking.phone.length === 9 &&
                            <span className="text-danger" style={{ fontSize: 12 }}>Número inválido.</span>}
                    </FormGroup>

                    <FormGroup>
                        <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={booking.bookAt}
                            onChange={handleBookAtChange}
                        />
                    </FormGroup>

                    {quantity > 0 && [...Array(quantity)].map((_, i) => (
                        <IdentityField
                            key={i}
                            index={i}
                            dni={dni}
                            setDni={setDni}
                            userData={userData}
                            setUserData={setUserData}
                            documentTypes={documentTypes}
                            setDocumentTypes={setDocumentTypes}
                        />
                    ))}
                </Form>
            </div>

            <div className="booking__botton">
                <ListGroup>
                    <ListGroupItem className="border-0 px-0">
                        <h5>S/.{price} <i className="ri-close-line"></i> {quantity} persona{quantity > 1 ? 's' : ''}</h5>
                        <span>S/.{totalAmount}</span>
                    </ListGroupItem>
                    <ListGroupItem className="border-0 px-0 total">
                        <h5>Total</h5>
                        <span>S/.{totalAmount}</span>
                    </ListGroupItem>
                </ListGroup>

                <Payment
                    tour={tour}
                    quantity={quantity}
                    totalPrice={totalAmount}
                    booking={booking}
                    user={user}
                    handleOpenModal={toggleModal}
                    dni={dni}
                    userData={userData}
                    canBuy={isBookingDataValid}
                    onTryBooking={handleTryBooking}
                />
            </div>

            <LoginModal isModalOpen={isModalOpen} toggleModal={toggleModal} />
        </div>
    );
};

export default Booking;
