import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import registerImg from '../assets/images/register.png';
import userIcon from '../assets/images/user.png';
import { AuthContext } from './../context/AuthContext';
import { BASE_URL } from './../utils/config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

    const handleChange = e => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async e => {
        e.preventDefault();

        // Validaciones front-end: vacíos
        if (!credentials.username || !credentials.email || !credentials.password) {
            toast.error("Todos los campos son obligatorios.");
            return;
        }

        // Validación de email
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(credentials.email)) {
            toast.error("Por favor, ingresa un correo válido.");
            return;
        }

        // Validación de contraseña fuerte (mínimo 6 caracteres)
        if (credentials.password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        // Validación de username decente
        if (credentials.username.length < 3) {
            toast.error("El nombre de usuario debe tener al menos 3 caracteres.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/usermobile/register`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const result = await res.json();

            if (res.status === 400) {
                toast.error(result.message || "El nombre de usuario o correo electrónico ya existen.");
            } else if (!res.ok) {
                toast.error("Error al registrar. Intenta de nuevo.");
            } else {
                dispatch({ type: "REGISTER_SUCCESS" });
                toast.success("Usuario creado correctamente. Inicia sesión.");
                navigate("/login");
            }
        } catch (err) {
            toast.error("Ha ocurrido un error. Por favor intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <Container>
                <Row>
                    <Col lg='8' className="m-auto">
                        <div className="login__container d-flex justify-content-between">
                            <div className="login__img">
                                <img src={registerImg} alt="" />
                            </div>

                            <div className="login__form">
                                <div className="user">
                                    <img src={userIcon} alt="" />
                                </div>

                                <h2>Registrarte</h2>

                                <Form onSubmit={handleClick}>
                                    <FormGroup>
                                        <input
                                            type="text"
                                            placeholder="Nombre de Usuario"
                                            required
                                            id="username"
                                            value={credentials.username}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            required
                                            id="email"
                                            value={credentials.email}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </FormGroup>
                                    <FormGroup className="position-relative">
                                        <input
                                            type={passwordShown ? "text" : "password"}
                                            placeholder="Contraseña"
                                            required
                                            id="password"
                                            value={credentials.password}
                                            onChange={handleChange}
                                            className="form-control"
                                            disabled={loading}
                                        />
                                        <i
                                            onClick={togglePasswordVisibility}
                                            className="position-absolute top-50 end-0 translate-middle-y"
                                            style={{ cursor: 'pointer', marginRight: '10px' }}
                                            tabIndex={0}
                                            aria-label={passwordShown ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {passwordShown ? <FaEye /> : <FaEyeSlash />}
                                        </i>
                                    </FormGroup>

                                    <Button className="btn secondary__btn auth__btn" type="submit" disabled={loading}>
                                        {loading ? "Registrando..." : "Registrarte"}
                                    </Button>
                                </Form>
                                <p>¿Ya tienes una cuenta? <Link to='/login'>Ingresar</Link></p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Register;
