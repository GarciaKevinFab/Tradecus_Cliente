import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FormGroup } from "reactstrap";
import { Spinner } from "reactstrap"; // de reactstrap, para el loading
import { BASE_URL } from "../../utils/config";

const DniField = ({ index, dni, setDni, userData, setUserData }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [validationStatus, setValidationStatus] = useState(null); // "success", "error", null

    useEffect(() => {
        const fetchDniData = async () => {
            const currentDni = dni[index];
            if (currentDni && currentDni.length === 8) {
                setIsLoading(true);
                setValidationStatus(null);
                try {
                    const response = await axios.get(`${BASE_URL}/dni/getDniData/${currentDni}`);
                    if (response.data?.nombres && response.data?.apellidoPaterno && response.data?.apellidoMaterno) {
                        setUserData((prev) => {
                            const updated = [...prev];
                            updated[index] = response.data;
                            return updated;
                        });
                        setValidationStatus("success");
                        toast.success(`DNI ${currentDni} validado correctamente.`);
                    } else {
                        setValidationStatus("error");
                        toast.error("Datos incompletos para el DNI ingresado.");
                    }
                } catch (error) {
                    setValidationStatus("error");
                    toast.error("Error al validar el DNI.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchDniData();
    }, [index, dni, setUserData]);

    return (
        <FormGroup className="d-flex align-items-center gap-2">
            <input
                type="number"
                placeholder={`DNI Persona ${index + 1}`}
                value={dni[index] || ''}
                onChange={(e) => {
                    const temp = [...dni];
                    temp[index] = e.target.value;
                    setDni(temp);
                }}
                className={`form-control ${validationStatus === "success" ? "is-valid" :
                        validationStatus === "error" ? "is-invalid" : ""
                    }`}
            />

            {isLoading && <Spinner size="sm" color="primary" />}
            {validationStatus === "success" && <i className="ri-checkbox-circle-fill text-success fs-5"></i>}
            {validationStatus === "error" && <i className="ri-close-circle-fill text-danger fs-5"></i>}
        </FormGroup>

    );
};

export default DniField;
