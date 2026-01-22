import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useElements,
    useStripe
} from "@stripe/react-stripe-js";
import CheckoutSteps from "./CheckoutStep";
import { createOrder } from "../../actions/orderActions";
import { toast } from "react-toastify";

export default function Payment() {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.authState);
    const { items: cartItems, shippingInfo } = useSelector(state => state.cartState);

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo") || "null");

    // Redirect if no order info (prevents blank page)
    if (!orderInfo) {
        navigate("/cart");
        return null;
    }

    const order = {
        orderItems: cartItems,
        shippingInfo,
        itemsPrice: orderInfo.itemsPrice,
        shippingPrice: orderInfo.shippingPrice,
        taxPrice: orderInfo.taxPrice,
        totalPrice: orderInfo.totalPrice
    };

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100) // Stripe expects amount in cents/paise
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const payBtn = document.querySelector("#pay_btn");
        payBtn.disabled = true;

        try {
            // Get client_secret from backend
            const { data } = await axios.post("/api/v1/payment/process", paymentData, {
                headers: { "Content-Type": "application/json" }
            });

            const result = await stripe.confirmCardPayment(data.client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.postalCode,
                            country: shippingInfo.country
                        }
                    }
                }
            });

            if (result.error) {
                toast.error(result.error.message);
                payBtn.disabled = false;
            } else if (result.paymentIntent.status === "succeeded") {
                order.paymentInfo = {
                    id: result.paymentIntent.id,
                    status: result.paymentIntent.status
                };

                dispatch(createOrder(order));
                sessionStorage.removeItem("orderInfo");
                navigate("/order/success");
            }
        } catch (error) {
            payBtn.disabled = false;
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

                        <div className="form-group">
                            <label>Card Number</label>
                            <CardNumberElement className="form-control" />
                        </div>

                        <div className="form-group">
                            <label>Expiry Date</label>
                            <CardExpiryElement className="form-control" />
                        </div>

                        <div className="form-group">
                            <label>CVC</label>
                            <CardCvcElement className="form-control" />
                        </div>

                        <button
                            id="pay_btn"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={!stripe}
                        >
                            Pay ₹{orderInfo.totalPrice}
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}
