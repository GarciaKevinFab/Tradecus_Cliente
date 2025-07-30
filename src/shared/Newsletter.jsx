import React, { useState } from 'react';
import './newsletter.css';
import axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import maleTourist from '../assets/images/male-tourist.png';
import { BASE_URL } from "../utils/config";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validación de email básica
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailRegex.test(email)) {
            toast.error("Por favor ingresa un correo válido.");
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${BASE_URL}/subscribe`, { email });
            toast.success('¡Gracias por suscribirte!');
            setEmail('');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message || 'Este correo ya está suscrito.');
            } else {
                toast.error('Algo salió mal. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='newsletter'>
            <Container>
                <Row>
                    <Col lg='6'>
                        <div className="newsletter__content">
                            <h2>
                                Suscríbete para recibir Ofertas.
                            </h2>
                            <div className="newsletter__input">
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="email"
                                        placeholder='Ingrese su email'
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                    <button className="btn newsletter__btn" type="submit" disabled={loading}>
                                        {loading ? "Enviando..." : "Suscribir"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </Col>
                    <Col lg='6'>
                        <div className="newsletter__img">
                            <img src={maleTourist} alt="" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Newsletter;
