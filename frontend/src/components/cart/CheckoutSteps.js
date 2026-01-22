import { Link } from "react-router-dom";

export default function CheckoutSteps({ shipping, confirmOrder, payment }) {
    const steps = [
        { name: "Shipping Info", path: "/shipping", active: shipping },
        { name: "Confirm Order", path: "/order/confirm", active: confirmOrder, disabled: !shipping },
        { name: "Payment", path: "/payment", active: payment, disabled: !confirmOrder }
    ];

    return (
        <div className="checkout-progress d-flex justify-content-center mt-5">
            {steps.map(step => (
                step.disabled ? (
                    <div key={step.name} className="d-flex align-items-center cursor-not-allowed">
                        <div className="triangle2-incomplete"></div>
                        <div className="step incomplete">{step.name}</div>
                        <div className="triangle-incomplete"></div>
                    </div>
                ) : (
                    <Link key={step.name} to={step.path} className="d-flex align-items-center">
                        <div className={step.active ? "triangle2-active" : "triangle2-incomplete"}></div>
                        <div className={step.active ? "step active-step" : "step incomplete"}>
                            {step.name}
                        </div>
                        <div className={step.active ? "triangle-active" : "triangle-incomplete"}></div>
                    </Link>
                )
            ))}
        </div>
    );
}
