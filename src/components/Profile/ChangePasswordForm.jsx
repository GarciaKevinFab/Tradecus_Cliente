import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/config";

const ChangePasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Las nuevas contraseñas no coinciden");
            return;
        }

        try {
            const res = await axios.post(
                `${BASE_URL}/usermobile/change-password`,
                { currentPassword, newPassword },
                { withCredentials: true }
            );
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error al cambiar la contraseña");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5>Cambiar contraseña</h5>
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
            />
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <label>
                <input type="checkbox" onChange={toggleShowPassword} /> Mostrar contraseñas
            </label>
            <button type="submit">Actualizar contraseña</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default ChangePasswordForm;
