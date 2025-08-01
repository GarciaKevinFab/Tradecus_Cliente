import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/config";
import { toast } from "react-toastify";

const IdentityField = ({
    index,
    dni,
    setDni,
    userData,
    setUserData,
    documentTypes,
    setDocumentTypes
}) => {
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    // Cuando el usuario cambia el tipo de documento
    const handleTypeChange = (e) => {
        const updatedTypes = [...documentTypes];
        updatedTypes[index] = e.target.value;
        setDocumentTypes(updatedTypes);
        setIsValid(false);
        // Limpiar el campo de documento al cambiar de tipo
        const updatedDni = [...dni];
        updatedDni[index] = "";
        setDni(updatedDni);
    };

    // Cuando escribe en el input
    const handleChange = (e) => {
        let value = e.target.value;
        // Solo dejar números
        value = value.replace(/\D/g, "");
        const updatedDni = [...dni];
        updatedDni[index] = value;
        setDni(updatedDni);
        setIsValid(false);
    };

    // Cuando sale del input
    const handleBlur = async () => {
        const value = dni[index];
        const type = documentTypes[index];

        if (!value) {
            toast.warn("El campo no puede estar vacío.");
            return;
        }

        if (type === "dni" && value.length !== 8) {
            toast.warn("El DNI debe tener 8 dígitos.");
            return;
        }

        if (type === "carnet" && value.length !== 9) {
            toast.warn("El Carnet debe tener 9 dígitos.");
            return;
        }

        setLoading(true);

        try {
            if (type === "dni") {
                const response = await axios.get(`${BASE_URL}/dni/getDniData/${value}`);
                if (response.data?.nombres) {
                    const updatedUserData = [...userData];
                    updatedUserData[index] = response.data;
                    setUserData(updatedUserData);
                    setIsValid(true);
                    toast.success(`✅ DNI ${value} validado correctamente.`, { autoClose: 2000 });
                } else {
                    toast.error("No se encontró información para ese DNI.");
                    setIsValid(false);
                }
            } else if (type === "carnet") {
                const response = await axios.get(`${BASE_URL}/cee/getCeeData/${value}`);
                if (response.data?.success && response.data?.data?.nombres) {
                    const updatedUserData = [...userData];
                    updatedUserData[index] = {
                        nombres: response.data.data.nombres,
                        apellidoPaterno: response.data.data.apellido_paterno,
                        apellidoMaterno: response.data.data.apellido_materno
                    };
                    setUserData(updatedUserData);
                    setIsValid(true);
                    toast.success(`✅ Carnet ${value} validado correctamente.`, { autoClose: 2000 });
                } else {
                    toast.error("No se encontró información para ese Carnet.");
                    setIsValid(false);
                }
            }
        } catch (err) {
            if (err.response) {
                toast.error("La consulta falló. ¿El documento es válido? ¿La API está disponible?");
            } else {
                toast.error("Error de conexión. Verifica tu internet.");
            }
            setIsValid(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
            <select
                value={documentTypes[index]}
                onChange={handleTypeChange}
                disabled={loading}
                style={{ marginRight: 10, padding: 5 }}
            >
                <option value="dni">DNI</option>
                <option value="carnet">Carnet de Extranjería</option>
            </select>
            <input
                type="text"
                maxLength={documentTypes[index] === "dni" ? 8 : 9}
                value={dni[index]}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={documentTypes[index] === "dni" ? "DNI Persona" : "Carnet Persona"}
                disabled={loading}
                style={{ padding: 5, width: 150, marginRight: 10 }}
            />
            {loading && (
                <span style={{ color: "orange", marginLeft: 5, fontWeight: "bold" }}>Validando...</span>
            )}
            {isValid && !loading && (
                <span style={{ color: "green", marginLeft: 5, fontWeight: "bold" }}>✔️ Validado</span>
            )}
        </div>
    );
};

export default IdentityField;
