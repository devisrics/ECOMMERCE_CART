const catchAsyncError = require('../middlewares/catchAsyncError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncError(async (req, res, next) => {
    const rawAmount = Number(req.body.amount); 
    const amountInCents = Math.round(rawAmount * 100); 

    console.log("Amount sent to Stripe:", amountInCents);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        description: "TEST PAYMENT",
        metadata: { integration_check: "accept_payment" },
    });

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    });
});

exports.sendStripeApi = catchAsyncError((req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY 
    });
});
