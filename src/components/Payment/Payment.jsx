import React, { useState } from "react";
import { Button } from "reactstrap";
import { BASE_URL } from "../../utils/config";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment = ({ tour, quantity, totalPrice, booking, user, handleOpenModal, dni, userData, canBuy }) => {

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^9[0-9]{8}$/;
    return phoneNumberRegex.test(phoneNumber);
  };

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      if (!user) return handleOpenModal();

      if (dni.some((val) => val === "") || userData.some((data) => Object.keys(data).length === 0)) {
        return toast.error("Por favor, completa todos los campos de DNI y nombre.");
      }

      if (!isValidPhoneNumber(booking.phone?.toString())) {
        return toast.error('Por favor ingresa un número de teléfono válido.');
      }

      if (!booking.phone || !booking.bookAt || !booking.guestSize) {
        return toast.error("Por favor, completa todos los campos requeridos.");
      }

      toast.success('Validación correcta. Creando reserva...');
      setLoading(true);

      // PRIMERO: Crear el booking en la BD
      const bookingRes = await fetch(`${BASE_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          ...booking,
          tourName: tour.title,
          tourType: booking.tourType || 'group',
          userId: user._id,
          userEmail: user.email,
          userData
        })
      });

      const bookingData = await bookingRes.json();

      if (!bookingRes.ok || !bookingData.data) {
        throw new Error("No se pudo crear la reserva.");
      }

      // LUEGO: Llamar a MercadoPago con todos los datos
      const response = await fetch(`${BASE_URL}/mercadopago/create_payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: { title: tour.title },
          quantity: parseInt(quantity, 10),
          totalPrice,
          guests: userData,
          user,
          tourId: tour._id,
          booking: bookingData.data, // ahora sí tienes el booking creado
          dni,
          userData
        }),
      });

      const data = await response.json();

      if (response.ok && data.init_point) {
        toast.success("Redirigiendo a MercadoPago...");
        window.open(data.init_point, "_blank");
      } else {
        toast.error("No se pudo generar el enlace de pago.");
      }

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment">
      <Button
        className="btn primary__btn w-100 mt-4"
        onClick={handlePayment}
        disabled={!canBuy || loading}
      >
        {loading ? "Procesando..." : "COMPRAR"}
      </Button>
    </div>
  );
};

export default Payment;
