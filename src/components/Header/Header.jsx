import React, { useRef, useEffect, useContext, useState } from "react";
import {
    Container,
    Row,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink as TabNavLink,
} from "reactstrap";
import { NavLink as RouterNavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import classnames from "classnames";

import logo from "../../assets/images/logo.png";
import "./Header.css";
import { BASE_URL } from "../../utils/config";
import { AuthContext } from "./../../context/AuthContext";

import ChangePasswordForm from "../Profile/ChangePasswordForm";
import UserHistory from "../Profile/UserHistory";
import CustomModal from "../Profile/CustomModal";

const nav__links = [
    { path: "/home", display: "Inicio" },
    { path: "/about", display: "Acerca de" },
    { path: "/tours", display: "Tours" },
    { path: "/Contact", display: "Contacto" },
];

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("1");
    const [bookingCount, setBookingCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);

    const [bookingList, setBookingList] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [customModalOpen, setCustomModalOpen] = useState(false);

    const headerRef = useRef(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { user, dispatch } = useContext(AuthContext);

    const toggleModal = () => setModalOpen((prev) => !prev);

    const logout = () => {
        dispatch({ type: "LOGOUT" });
        navigate("/");
    };

    useEffect(() => {
        const fetchUserStats = async () => {
            if (modalOpen && user?._id) {
                try {
                    const [bookingRes, reviewRes] = await Promise.all([
                        axios.get(`${BASE_URL}/booking/user/${user._id}`),
                        axios.get(`${BASE_URL}/review/user/${user._id}`),
                    ]);
                    setBookingCount(bookingRes.data.data.length || 0);
                    setBookingList(bookingRes.data.data || []);
                    setReviewCount(reviewRes.data.data.length || 0);
                } catch (error) {
                    setBookingList([]);
                    setBookingCount(0);
                    setReviewCount(0);
                }
            }
        };
        fetchUserStats();
    }, [modalOpen, user]);

    useEffect(() => {
        const stickyHeaderFunc = () => {
            if (
                document.body.scrollTop > 80 ||
                document.documentElement.scrollTop > 80
            ) {
                headerRef.current.classList.add("sticky__header");
            } else {
                headerRef.current.classList.remove("sticky__header");
            }
        };
        window.addEventListener("scroll", stickyHeaderFunc);
        return () => window.removeEventListener("scroll", stickyHeaderFunc);
    }, []);

    const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

    // Al cerrar el modal de reserva, reabrimos el modal de perfil si venías de ahí
    const handleCloseCustomModal = () => {
        setCustomModalOpen(false);
        setSelectedBooking(null);
        setTimeout(() => setModalOpen(true), 100); // Vuelve a mostrar el modal de perfil
    };

    const handleBookingDeleted = (deletedId) => {
        setBookingList((prev) => prev.filter((b) => b._id !== deletedId));
        handleCloseCustomModal();
    };

    return (
        <header className="header" ref={headerRef}>
            <Container>
                <Row>
                    <nav className="wrapper d-flex align-items-center justify-content-between">
                        <div className="logo">
                            <img src={logo} alt="logo" />
                        </div>
                        <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                            <ul className="menu d-flex align-items-center gap-5">
                                {nav__links.map((item, index) => (
                                    <li className="nav__item" key={index}>
                                        <RouterNavLink
                                            to={item.path}
                                            className={({ isActive }) =>
                                                isActive ? "active__link" : ""
                                            }
                                        >
                                            {item.display}
                                        </RouterNavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="nav__right d-flex align-items-center gap-4">
                            <div className="nav__btn d-flex align-items-center gap-4">
                                {user ? (
                                    <div
                                        className="user-dropdown"
                                        onMouseEnter={() => setDropdownOpen(true)}
                                        onMouseLeave={() => setDropdownOpen(false)}
                                    >
                                        <h5 className="mb-0 user-name" style={{ cursor: "pointer", fontWeight: 600 }}>
                                            {user.username} <i className="ri-arrow-down-s-line"></i>
                                        </h5>
                                        {dropdownOpen && (
                                            <div className="dropdown-menu show">
                                                <button className="dropdown-item" onClick={toggleModal}>
                                                    Perfil
                                                </button>
                                                <button
                                                    className="dropdown-item text-danger"
                                                    onClick={logout}
                                                >
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <Button className="btn secondary__btn">
                                            <Link to="/login">Acceder</Link>
                                        </Button>
                                        <Button className="btn primary__btn">
                                            <Link to="/register">Registrar</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                            <span className="mobile__menu" onClick={toggleMenu}>
                                <i className="ri-menu-line"></i>
                            </span>
                        </div>
                    </nav>
                </Row>
            </Container>

            {/* Modal de perfil */}
            <Modal isOpen={modalOpen} toggle={toggleModal} fade={true} backdrop={!customModalOpen}>
                <ModalHeader toggle={toggleModal}>Perfil de Usuario</ModalHeader>
                <ModalBody>
                    <Nav tabs>
                        <NavItem>
                            <TabNavLink
                                className={classnames({ active: activeTab === "1" })}
                                onClick={() => setActiveTab("1")}
                            >
                                Perfil
                            </TabNavLink>
                        </NavItem>
                        <NavItem>
                            <TabNavLink
                                className={classnames({ active: activeTab === "2" })}
                                onClick={() => setActiveTab("2")}
                            >
                                Cambiar Contraseña
                            </TabNavLink>
                        </NavItem>
                        <NavItem>
                            <TabNavLink
                                className={classnames({ active: activeTab === "3" })}
                                onClick={() => setActiveTab("3")}
                            >
                                Historial
                            </TabNavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab} className="mt-3">
                        <TabPane tabId="1">
                            <p><strong>Usuario:</strong> {user?.username}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            {user?.isVerified ? (
                                <span style={{ color: "green", fontWeight: 600 }}>
                                    <i className="ri-checkbox-circle-line" /> Verificado
                                </span>
                            ) : (
                                <>
                                    <span style={{ color: "red", fontWeight: 600 }}>
                                        <i className="ri-close-circle-line" /> No verificado
                                    </span>
                                    <Button
                                        className="btn btn-warning mt-2"
                                        style={{ fontWeight: 600 }}
                                        onClick={async () => {
                                            try {
                                                await axios.post(
                                                    `${BASE_URL}/usermobile/resend-verification`,
                                                    {},
                                                    { withCredentials: true }
                                                );
                                                alert("Correo reenviado. Revisa tu bandeja.");
                                                setTimeout(async () => {
                                                    const res = await axios.get(`${BASE_URL}/usermobile/me`, {
                                                        withCredentials: true,
                                                    });
                                                    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
                                                }, 3000);
                                            } catch {
                                                alert("Error al reenviar correo.");
                                            }
                                        }}
                                    >
                                        Verificar correo
                                    </Button>
                                </>
                            )}
                        </TabPane>
                        <TabPane tabId="2">
                            <ChangePasswordForm />
                        </TabPane>
                        <TabPane tabId="3">
                            <UserHistory
                                bookingCount={bookingCount}
                                reviewCount={reviewCount}
                                bookingList={bookingList}
                                onBookingClick={(booking) => {
                                    setModalOpen(false); // Cierra el modal de perfil
                                    setTimeout(() => {
                                        setSelectedBooking(booking);
                                        setCustomModalOpen(true);
                                    }, 250); // Delay para animación
                                }}
                            />
                        </TabPane>
                    </TabContent>
                </ModalBody>
            </Modal>

            {/* Modal de detalle/descarga de reserva */}
            <CustomModal
                isOpen={customModalOpen}
                onRequestClose={handleCloseCustomModal}
                booking={selectedBooking}
                onBookingDeleted={handleBookingDeleted}
            />
        </header>
    );
};

export default Header;
