// src/pages/EmailVerified.jsx
import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";

export default function EmailVerified() {
    const navigate = useNavigate();

    useEffect(() => {
        const updateUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${BASE_URL}/usermobile/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const updatedUser = res.data.user;
                localStorage.setItem('user', JSON.stringify(updatedUser));
                // Si usas contexto: setUser(updatedUser);
            } catch (error) {
                console.error("Error al actualizar datos del usuario:", error);
            }
        };

        updateUserInfo();
    }, []);

    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
            <h2>✅ ¡Correo verificado correctamente!</h2>
            <p>Tu cuenta ha sido actualizada. Si no ves los cambios, actualiza la página o vuelve a iniciar sesión.</p>
            <button
                onClick={() => navigate("/home")}
                style={{
                    marginTop: "1.5rem",
                    padding: "0.7rem 1.5rem",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "1rem"
                }}
            >
                Ir al inicio
            </button>
        </div>
    );
}
