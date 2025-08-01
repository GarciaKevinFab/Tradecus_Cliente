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

    const handleTypeChange = (e) => {
        const updatedTypes = [...documentTypes];
        updatedTypes[index] = e.target.value;
        setDocumentTypes(updatedTypes);
        setIsValid(false);
        const updatedDni = [...dni];
        updatedDni[index] = "";
        setDni(updatedDni);
    };

    const handleChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        const updatedDni = [...dni];
        updatedDni[index] = value;
        setDni(updatedDni);
        setIsValid(false);
    };

    const handleBlur = async () => {
        const value = dni[index];
        const type = documentTypes[index];

        if (!value) {
            toast.warn("Por favor, ingresa el número de documento.", { autoClose: 2500 });
            return;
        }
        if (type === "dni" && value.length !== 8) {
            toast.warn("El DNI debe contener 8 dígitos numéricos.", { autoClose: 2500 });
            return;
        }
        if (type === "carnet" && value.length !== 9) {
            toast.warn("El Carnet de Extranjería debe contener 9 dígitos numéricos.", { autoClose: 2500 });
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
                    toast.error("No se encontró un registro válido para el DNI ingresado. Verifica el número e inténtalo nuevamente.", { autoClose: 3500 });
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
                    toast.error("No se encontró un registro válido para el Carnet ingresado. Verifica el número e inténtalo nuevamente.", { autoClose: 3500 });
                    setIsValid(false);
                }
            }
        } catch (err) {
            if (err.response) {
                toast.error("No se pudo verificar el documento en este momento. Por favor, intenta más tarde.", { autoClose: 3500 });
            } else {
                toast.error("Error de conexión. Verifica tu acceso a internet e inténtalo nuevamente.", { autoClose: 3500 });
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
