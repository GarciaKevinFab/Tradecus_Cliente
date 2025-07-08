import React from "react";
import { Button } from "reactstrap";
import { BASE_URL } from "../../utils/config";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment = ({ tour, quantity, totalPrice, booking, user, handleOpenModal, dni, userData, canBuy }) => {

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^9[0-9]{8}$/;
    return phoneNumberRegex.test(phoneNumber);
  }

  const handlePayment = async () => {
    try {
      if (!user) {
        return handleOpenModal(); // Abrir login
      }

      if (dni.some((val) => val === "") || userData.some((data) => Object.keys(data).length === 0)) {
        toast.error("Por favor, completa todos los campos de DNI y nombre.");
        return;
      }

      if (!isValidPhoneNumber(booking.phone.toString())) {
        toast.error('Por favor ingresa un número de teléfono válido.');
        return;
      }

      if (!booking.phone || !booking.bookAt || !booking.guestSize) {
        return toast.error("Por favor, completa todos los campos requeridos.");
      }

      toast.success('Validación correcta. Generando link de pago...');

      // 👉 Generar link de pago AHORA
      const response = await fetch(`${BASE_URL}/mercadopago/create_payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: { title: tour.title },
          quantity: parseInt(quantity, 10),
          totalPrice,
          guests: userData,
        }),
      });

      if (!response.ok) throw new Error("Error al crear la preferencia de pago");

      const data = await response.json();
      if (data.init_point) {
        toast.success("Redirigiendo a MercadoPago...");
        window.open(data.init_point, "_blank");
      } else {
        toast.error("No se pudo generar el enlace de pago.");
      }

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="payment">
      <Button
        className="btn primary__btn w-100 mt-4"
        onClick={handlePayment}
        disabled={!canBuy}
      >
        COMPRAR
      </Button>
    </div>
  );
};

export default Payment;
