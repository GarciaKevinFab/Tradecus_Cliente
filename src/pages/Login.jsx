import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import loginImg from '../assets/images/login.png';
import userIcon from '../assets/images/user.png';
import { AuthContext } from './../context/AuthContext';
import { BASE_URL } from './../utils/config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [credentials, setCredentials] = useState({
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

        if (!credentials.email || !credentials.password) {
            toast.error("Todos los campos son obligatorios.");
            return;
        }

        // Validación básica de email (no deja que el usuario meta basura)
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(credentials.email)) {
            toast.error("Por favor, ingresa un correo válido.");
            return;
        }

        setLoading(true);
        dispatch({ type: 'LOGIN_START' });

        try {
            const res = await fetch(`${BASE_URL}/usermobile/login`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(credentials),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message || "Credenciales incorrectas.");
                dispatch({ type: "LOGIN_FAILURE", payload: result.message });
            } else {
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: {
                        ...result.data,
                        token: result.token
                    }
                });
                toast.success("Bienvenido 👋");
                navigate("/");
            }
        } catch (err) {
            toast.error("Error de conexión. Intenta más tarde.");
            dispatch({ type: "LOGIN_FAILURE", payload: err.message });
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
                                <img src={loginImg} alt="" />
                            </div>

                            <div className="login__form">
                                <div className="user">
                                    <img src={userIcon} alt="" />
                                </div>

                                <h2>Acceder</h2>

                                <Form onSubmit={handleClick}>
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
                                        {loading ? "Ingresando..." : "Ingresar"}
                                    </Button>
                                </Form>
                                <p>¿No tienes una cuenta? <Link to='/register'>Registrar</Link></p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Login;
