// CheckoutFlow.jsx
import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { countries } from "countries-list";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { saveShippingInfo } from "../../slices/cartSlice";
import { createOrder } from "../../actions/orderActions";
import axios from "axios";

// ---------------- CheckoutSteps Component ----------------
export function CheckoutSteps({ shipping, confirmOrder, payment }) {
  return (
    <div className="checkout-progress d-flex justify-content-center mt-5">
      {shipping ? (
        <Link to="/shipping">
          <div className="triangle2-active"></div>
          <div className="step active-step">Shipping Info</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="/shipping">
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Shipping Info</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}

      {confirmOrder ? (
        <Link to="/order/confirm">
          <div className="triangle2-active"></div>
          <div className="step active-step">Confirm Order</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="/order/confirm">
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Confirm Order</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}

      {payment ? (
        <Link to="/payment">
          <div className="triangle2-active"></div>
          <div className="step active-step">Payment</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="/payment">
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Payment</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}
    </div>
  );
}

// ---------------- Shipping Component ----------------
export function Shipping() {
  const { shippingInfo = {} } = useSelector(state => state.cartState);
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

  const validateShipping = () => {
    if (!address || !city || !state || !country || !phoneNo || !postalCode) {
      toast.error("Please fill the shipping information", { position: toast.POSITION.BOTTOM_CENTER });
      return false;
    }
    return true;
  };

  const submitHandler = e => {
    e.preventDefault();
    if (!validateShipping()) return;
    dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country, state }));
    navigate("/order/confirm");
  };

  return (
    <Fragment>
      <CheckoutSteps shipping />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg">
            <h1 className="mb-4">Shipping Info</h1>

            <input type="text" placeholder="Address" className="form-control mb-2" value={address} onChange={e => setAddress(e.target.value)} required />
            <input type="text" placeholder="City" className="form-control mb-2" value={city} onChange={e => setCity(e.target.value)} required />
            <input type="text" placeholder="Phone" className="form-control mb-2" value={phoneNo} onChange={e => setPhoneNo(e.target.value)} required />
            <input type="text" placeholder="State" className="form-control mb-2" value={state} onChange={e => setState(e.target.value)} required />
            <input type="number" placeholder="Postal Code" className="form-control mb-2" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
            <select className="form-control mb-3" value={country} onChange={e => setCountry(e.target.value)} required>
              {countryList.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>

            <button className="btn btn-block py-3" type="submit">CONTINUE</button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

// ---------------- ConfirmOrder Component ----------------
export function ConfirmOrder() {
  const { shippingInfo, items: cartItems } = useSelector(state => state.cartState);
  const { user } = useSelector(state => state.authState);
  const navigate = useNavigate();

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const processPayment = () => {
    sessionStorage.setItem("orderInfo", JSON.stringify({ orderItems: cartItems, shippingInfo, itemsPrice, shippingPrice, taxPrice, totalPrice: Math.round(totalPrice) }));
    navigate("/payment");
  };

  return (
    <Fragment>
      <CheckoutSteps shipping confirmOrder />
      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 order-confirm">
          <h4 className="mb-3">Shipping Info</h4>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
          <p><b>Address:</b> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}</p>
          <hr />
          <h4>Your Cart Items:</h4>
          {cartItems.map(item => (
            <div key={item.product} className="cart-item my-1">
              <div className="row">
                <div className="col-4 col-lg-2">
                  <img src={item.image} alt={item.name} width="65" height="45" />
                </div>
                <div className="col-5 col-lg-6"><Link to={`/product/${item.product}`}>{item.name}</Link></div>
                <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                  <p>{item.quantity} x ${item.price} = <b>${item.quantity * item.price}</b></p>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>

        <div className="col-12 col-lg-3 my-4">
          <div id="order_summary">
            <h4>Order Summary</h4>
            <p>Subtotal: <span className="order-summary-values">${itemsPrice}</span></p>
            <p>Shipping: <span className="order-summary-values">${shippingPrice}</span></p>
            <p>Tax: <span className="order-summary-values">${taxPrice}</span></p>
            <hr />
            <p>Total: <span className="order-summary-values">${totalPrice}</span></p>
            <button className="btn btn-primary btn-block" onClick={processPayment}>Proceed to Payment</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

// ---------------- Payment Component ----------------
export function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.authState);
  const { items, shippingInfo } = useSelector(state => state.cartState);

  const orderInfo = sessionStorage.getItem("orderInfo") ? JSON.parse(sessionStorage.getItem("orderInfo")) : null;
  if (!orderInfo) { navigate("/cart"); return null; }

  const paymentData = { amount: Math.round(orderInfo.totalPrice) };
  const order = { orderItems: items, shippingInfo, ...orderInfo };

  const submitHandler = async e => {
    e.preventDefault();
    document.querySelector("#pay_btn").disabled = true;

    try {
      const { data } = await axios.post("/api/v1/payment/process", paymentData, { headers: { "Content-Type": "application/json" } });
      const result = await stripe.confirmCardPayment(data.client_secret, { payment_method: { card: elements.getElement(CardNumberElement), billing_details: { name: user.name, email: user.email, address: shippingInfo } } });

      if (result.error) {
        toast.error(result.error.message);
        document.querySelector("#pay_btn").disabled = false;
      } else if (result.paymentIntent.status === "succeeded") {
        order.paymentInfo = { id: result.paymentIntent.id, status: result.paymentIntent.status };
        dispatch(createOrder(order));
        sessionStorage.removeItem("orderInfo");
        navigate("/order/success");
      }
    } catch (error) {
      document.querySelector("#pay_btn").disabled = false;
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <Fragment>
      <CheckoutSteps shipping confirmOrder payment />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Card Info</h1>
            <div className="form-group"><label>Card Number</label><CardNumberElement className="form-control" /></div>
            <div className="form-group"><label>Expiry Date</label><CardExpiryElement className="form-control" /></div>
            <div className="form-group"><label>CVC</label><CardCvcElement className="form-control" /></div>
            <button id="pay_btn" type="submit" className="btn btn-block py-3" disabled={!stripe}>Pay ₹{orderInfo.totalPrice}</button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

// ---------------- OrderSuccess Component ----------------
export function OrderSuccess() {
  return (
    <div className="row justify-content-center">
      <div className="col-6 mt-5 text-center">
        <img src="/images/success.png" alt="Order Success" width="200" height="200" className="my-5 d-block mx-auto" />
        <h2>Your Order has been placed successfully.</h2>
        <Link to="/orders">Go to Orders</Link>
      </div>
    </div>
  );
}
