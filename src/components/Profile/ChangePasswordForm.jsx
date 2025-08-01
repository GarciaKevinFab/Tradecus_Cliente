import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/config";
import { MdVisibility, MdVisibilityOff, MdLockReset } from "react-icons/md";

const ChangePasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(""); // "success" | "error"
    const [loading, setLoading] = useState(false);

    const toggleShowPassword = () => setShowPassword((v) => !v);

    const validatePassword = (pw) =>
        pw.length >= 8 && /\d/.test(pw) && /[A-Za-z]/.test(pw);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        setMessage("");
        if (newPassword !== confirmPassword) {
            setStatus("error");
            setMessage("Las nuevas contraseñas no coinciden.");
            return;
        }
        if (!validatePassword(newPassword)) {
            setStatus("error");
            setMessage("La contraseña debe tener al menos 8 caracteres y combinar letras y números.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user")); // o desde AuthContext

        try {
            setLoading(true);
            const res = await axios.post(
                `${BASE_URL}/usermobile/change-password`,
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            setStatus("success");
            setMessage(res.data.message || "Contraseña cambiada exitosamente.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setStatus("error");
            setMessage(err.response?.data?.message || "Error al cambiar la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                maxWidth: 400,
                margin: "0 auto",
                padding: "1.5rem 1.5rem 1.2rem 1.5rem",
                borderRadius: 14,
                background: "#f7fafc",
                boxShadow: "0 1px 6px 0 #e5e9f1"
            }}
            autoComplete="off"
        >
            <h5 style={{
                marginBottom: 18,
                color: "#2176FF",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 19
            }}>
                <MdLockReset /> Cambiar contraseña
            </h5>

            <div style={{ marginBottom: 15 }}>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: 8,
                        border: "1px solid #d0d7e5",
                        marginBottom: 8,
                        fontSize: 15
                    }}
                />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: 8,
                        border: "1px solid #d0d7e5",
                        marginBottom: 8,
                        fontSize: 15
                    }}
                />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirmar nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "11px 12px",
                        borderRadius: 8,
                        border: "1px solid #d0d7e5",
                        marginBottom: 6,
                        fontSize: 15
                    }}
                />

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 7,
                    fontSize: "1rem"
                }}>
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={toggleShowPassword}
                        style={{ accentColor: "#2176FF" }}
                        id="showpass"
                    />
                    <label htmlFor="showpass" style={{ cursor: "pointer" }}>
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />} Mostrar contraseñas
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    background: "#2176FF",
                    color: "#fff",
                    border: "none",
                    borderRadius: 7,
                    padding: "10px 0",
                    width: "100%",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 1px 3px 0 #e2e9f6"
                }}
            >
                {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>

            {message && (
                <div style={{
                    marginTop: 13,
                    color: status === "success" ? "#168a3b" : "#fc4242",
                    fontWeight: 600,
                    fontSize: "1.02rem",
                    textAlign: "center"
                }}>
                    {message}
                </div>
            )}

            <div style={{
                marginTop: 16,
                fontSize: "0.94rem",
                color: "#999",
                textAlign: "center"
            }}>
                La contraseña debe tener al menos 8 caracteres y contener letras y números.
            </div>
        </form>
    );
};

export default ChangePasswordForm;
