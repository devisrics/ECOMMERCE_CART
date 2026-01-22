// CheckoutFlow.jsx
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { countries } from "countries-list";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { saveShippingInfo } from "../../slices/cartSlice";
import { createOrder } from "../../actions/orderActions";
import axios from "axios";

/* =======================
   CheckoutSteps Component
======================= */
export function CheckoutSteps({ shipping, confirmOrder, payment }) {
  return (
    <div className="checkout-progress d-flex justify-content-center mt-5">
      <Link to="/shipping">
        <div className={shipping ? "triangle2-active" : "triangle2-incomplete"} />
        <div className={`step ${shipping ? "active-step" : "incomplete"}`}>
          Shipping Info
        </div>
        <div className={shipping ? "triangle-active" : "triangle-incomplete"} />
      </Link>

      <Link to="/order/confirm">
        <div className={confirmOrder ? "triangle2-active" : "triangle2-incomplete"} />
        <div className={`step ${confirmOrder ? "active-step" : "incomplete"}`}>
          Confirm Order
        </div>
        <div className={confirmOrder ? "triangle-active" : "triangle-incomplete"} />
      </Link>

      <Link to="/payment">
        <div className={payment ? "triangle2-active" : "triangle2-incomplete"} />
        <div className={`step ${payment ? "active-step" : "incomplete"}`}>
          Payment
        </div>
        <div className={payment ? "triangle-active" : "triangle-incomplete"} />
      </Link>
    </div>
  );
}

/* =======================
   validateShipping (EXPORT)
======================= */
export const validateShipping = ({
  address,
  city,
  state,
  country,
  phoneNo,
  postalCode,
}) => {
  if (!address || !city || !state || !country || !phoneNo || !postalCode) {
    toast.error("Please fill the shipping information", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    return false;
  }
  return true;
};

/* =======================
   Shipping Component
======================= */
export default function Shipping() {
  const { shippingInfo = {} } = useSelector((state) => state.cartState);

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode || "");
  const [country, setCountry] = useState(shippingInfo.country || "IN");
  const [state, setState] = useState(shippingInfo.state || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const countryList = Object.entries(countries).map(([code, data]) => ({
    code,
    name: data.name,
  }));

  const submitHandler = (e) => {
    e.preventDefault();

    if (
      !validateShipping({
        address,
        city,
        state,
        country,
        phoneNo,
        postalCode,
      })
    )
      return;

    dispatch(
      saveShippingInfo({
        address,
        city,
        phoneNo,
        postalCode,
        country,
        state,
      })
    );

    navigate("/order/confirm");
  };

  return (
    <Fragment>
      <CheckoutSteps shipping />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg">
            <h1 className="mb-4">Shipping Info</h1>

            <input className="form-control mb-2" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <input className="form-control mb-2" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <input className="form-control mb-2" placeholder="Phone" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
            <input className="form-control mb-2" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
            <input className="form-control mb-2" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />

            <select className="form-control mb-3" value={country} onChange={(e) => setCountry(e.target.value)}>
              {countryList.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>

            <button className="btn btn-block py-3">CONTINUE</button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

/* =======================
   ConfirmOrder Component
======================= */
export function ConfirmOrder() {
  const { shippingInfo, items } = useSelector((state) => state.cartState);
  const { user } = useSelector((state) => state.authState);
  const navigate = useNavigate();

  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const processPayment = () => {
    sessionStorage.setItem(
      "orderInfo",
      JSON.stringify({ itemsPrice, shippingPrice, taxPrice, totalPrice })
    );
    navigate("/payment");
  };

  return (
    <Fragment>
      <CheckoutSteps shipping confirmOrder />
      <button onClick={processPayment}>Proceed to Payment</button>
    </Fragment>
  );
}

/* =======================
   Payment Component
======================= */
export function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authState);
  const { items, shippingInfo } = useSelector((state) => state.cartState);

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const submitHandler = async (e) => {
    e.preventDefault();

    const paymentData = {
      amount: Math.round(orderInfo.totalPrice * 100),
    };

    const { data } = await axios.post("/api/v1/payment/process", paymentData);

    const result = await stripe.confirmCardPayment(data.client_secret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: user.name,
          email: user.email,
          address: shippingInfo,
        },
      },
    });

    if (result.paymentIntent.status === "succeeded") {
      dispatch(createOrder({ orderItems: items, shippingInfo, paymentInfo: result.paymentIntent }));
      navigate("/order/success");
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <CardNumberElement />
      <CardExpiryElement />
      <CardCvcElement />
      <button type="submit">Pay</button>
    </form>
  );
}
