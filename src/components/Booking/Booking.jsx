import React, { useState, useContext, useEffect } from "react";
import "./booking.css";
import Payment from "../Payment/Payment.jsx";
import IdentityField from '../Identity/IdentityField.jsx';
import LoginModal from "../Login-Modal/LoginModal.jsx";
import { Form, FormGroup, ListGroup, ListGroupItem } from "reactstrap";
import { AuthContext } from "../../context/AuthContext";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from "../../utils/config";

const Booking = ({ tour, avgRating }) => {
    const { price, reviews, title } = tour;
    const { user } = useContext(AuthContext);

    const [booking, setBooking] = useState({
        userId: "",
        userEmail: "",
        tourName: title,
        phone: "",
        guestSize: "1",
        bookAt: "",
    });

    const [tourType, setTourType] = useState('group');
    const [quantity, setQuantity] = useState(1);
    const [dni, setDni] = useState([""]);
    const [userData, setUserData] = useState([{}]);
    const [documentTypes, setDocumentTypes] = useState(["dni"]);

    const [maxGuests, setMaxGuests] = useState(0);
    const [currentGuests, setCurrentGuests] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    // 🔄 Sincroniza el user con booking una vez autenticado
    useEffect(() => {
        if (user) {
            setBooking((prev) => ({
                ...prev,
                userId: user._id,
                userEmail: user.email
            }));
        }
    }, [user]);

    useEffect(() => {
        setDni(new Array(booking.guestSize).fill(""));
        setUserData(new Array(booking.guestSize).fill({}));
        setDocumentTypes(new Array(booking.guestSize).fill("dni"));
        setQuantity(booking.guestSize);
    }, [booking.guestSize]);

    useEffect(() => {
        if (tour && tour._id) {
            axios.get(`${BASE_URL}/tours/${tour._id}`).then(res => {
                setMaxGuests(res.data.maxGroupSize);
            });
            axios.get(`${BASE_URL}/booking/count/${tour._id}`).then(res => {
                setCurrentGuests(res.data);
            });
        }
    }, [tour]);

    const handleGuestSizeChange = (e) => {
        const value = Number(e.target.value);
        if (tourType === 'private' && (value < 1 || value > 2)) {
            toast.error('Para un tour privado, debe haber entre 1 y 2 personas.');
            return;
        }
        if (value > (maxGuests - currentGuests)) {
            toast.error(`Solo quedan ${maxGuests - currentGuests} asientos disponibles.`);
            return;
        }
        setBooking((prev) => ({ ...prev, guestSize: value }));
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
        setBooking((prev) => ({ ...prev, bookAt: value }));
        toast.success('Fecha válida seleccionada.');
    };

    const totalAmount = Number(price) * (tourType === 'private' ? 4 : 1) * Number(quantity);

    const isValidLength = (doc, type) =>
        (type === "dni" && doc.length === 8) || (type === "carnet" && doc.length === 9);

    const allDocumentsValid = dni.every((d, i) => d && isValidLength(d, documentTypes[i]));
    const allUserDataValid = userData.every(d => d?.nombres && d?.apellidoPaterno && d?.apellidoMaterno);

    const isBookingDataValid =
        allDocumentsValid &&
        allUserDataValid &&
        booking.bookAt &&
        /^\d{9}$/.test(booking.phone);

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
                <Form className="booking__info-form" onSubmit={(e) => e.preventDefault()}>
                    <FormGroup>
                        <h5>Tipo de tour</h5>
                        <select
                            value={tourType}
                            onChange={(e) => {
                                setTourType(e.target.value);
                                setBooking((prev) => ({ ...prev, tourType: e.target.value }));
                            }}
                        >
                            <option value="group">Tour grupal</option>
                            <option value="private">Tour privado</option>
                        </select>
                    </FormGroup>


                    <FormGroup>
                        <h5>N° de Personas</h5>
                        <input
                            type="number"
                            min="1"
                            value={booking.guestSize}
                            onChange={handleGuestSizeChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <input
                            type="number"
                            placeholder="Teléfono"
                            onChange={(e) => setBooking((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                    </FormGroup>

                    <FormGroup>
                        <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
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
                />
            </div>

            <LoginModal isModalOpen={isModalOpen} toggleModal={toggleModal} />
        </div>
    );
};

export default Booking;
