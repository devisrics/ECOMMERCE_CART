const catchAsyncError = require('../middlewares/catchAsyncError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncError(async (req, res, next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        description: "TEST PAYMENT",
        metadata: { integration_check: "accept_payment" },
        shipping: {
            name: req.body.shipping.name,
            address: {
                line1: req.body.shipping.address,
                city: req.body.shipping.city,
                postal_code: req.body.shipping.postalCode,
                country: req.body.shipping.country
            }
        }
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
