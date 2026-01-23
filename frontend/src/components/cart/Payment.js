import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { orderCompleted } from "../../slices/cartSlice";
import { validateShipping } from "../cart/Shipping";
import { createOrder } from "../../actions/orderActions";
import { clearError as clearOrderError } from "../../slices/orderSlice";

export default function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { user } = useSelector((state) => state.authState);
  const { items: cartItems, shippingInfo } = useSelector(
    (state) => state.cartState
  );
  const { error: orderError } = useSelector((state) => state.orderState);

  useEffect(() => {
    validateShipping(shippingInfo, navigate);

    if (orderError) {
      toast.error(orderError, {
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearOrderError()),
      });
    }
  }, [orderError, shippingInfo, navigate, dispatch]);

  const order = {
    orderItems: cartItems,
    shippingInfo,
    itemsPrice: orderInfo.itemsPrice,
    shippingPrice: orderInfo.shippingPrice,
    taxPrice: orderInfo.taxPrice,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const { data } = await axios.post("/api/v1/payment/process", {
        amount: Math.round(orderInfo.totalPrice * 100),
      });

      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setProcessing(false);
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };

        dispatch(orderCompleted());
        dispatch(createOrder(order));

        toast.success("Payment Successful!", {
          position: toast.POSITION.BOTTOM_CENTER,
        });

        navigate("/order/success");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      setProcessing(false);
    }
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg">
          <h1 className="mb-4">Card Info</h1>

          <div className="form-group mb-4">
            <CardElement
              className="form-control"
              options={{
                style: { base: { fontSize: "16px" } },
              }}
            />
          </div>

          <button
            id="pay_btn"
            type="submit"
            className="btn btn-block py-3"
            disabled={processing}
          >
            {processing ? "Processing..." : `Pay $${orderInfo.totalPrice}`}
          </button>
        </form>
      </div>
    </div>
  );
}
