const PORT = 3009;

const express = require('express')




// const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const DB = admin.firestore();
const Stripe = require('stripe')('sk_test_fTClyFRlz7M95AhfSIFY7oUN');
const bodyParser = require('body-parser');
const cors = require('cors')({origin: true});
const mailer = require('nodemailer');

const app = express()
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const transporter = mailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dubforce93@gmail.com',
    pass: 'TestPassForAbasi'
  }
});

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.submitOrder = functions.https.onRequest(async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');

  if (request.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    response.set('Access-Control-Allow-Methods', 'GET');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Max-Age', '3600');
    return response.status(204).send('');
  }

  const {order, token} = request.body;

  if (!order || !token) {
    return response.status(500).send('Must provide order data and payment token');
  }

  
  const dbOrder = await DB.collection('orders').doc().set({
    ...order,
    token,
    status: 'Created',
  });
  
  // TODO: Use selections from order to verify actual pricing
  // TODO: Use choice from payment form to decide on full vs. deposit
  
  // Create charge record with payment amount and token
  const charge = await DB.collection('charges').doc().set({
    orderId: dbOrder.id,
    total: order.total,
    stripeToken: token,
    status: 'Processing',
  });

  // TODO: Accurately calculate payment

  // Submit charge to Stripe API
  const stripeResponse = await Stripe.charges.create({
    amount: order.total,
    currency: "usd",
    description: "Abasi Concepts Custom Guitar",
    source: token
  });

  // TODO: Record status of charge and update order
  await DB.collection('charges').doc(charge.id).set({
    ...charge,
    status: stripeResponse.status,
  });

  // TODO: Respond to request
  response.json(stripeResponse);

  // TODO: Send email to user if successful
  const mailOptions = {
    from: 'Abasi Guitars Support <ivan@abasiguitars.com>', // Something like: Jane Doe <janedoe@gmail.com>
    to: order.purchaserInfo.email,
    subject: 'Abasi Guitars Receipt', // email subject
    html: 'Thank you for your purchase' // email content in HTML
  };

  // returning result
  await transporter.sendMail(mailOptions);
});