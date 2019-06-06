const PORT = 3009; // TODO: Environment variable

const express = require('express');
const admin = require('firebase-admin');
const Stripe = require('stripe')('sk_test_fTClyFRlz7M95AhfSIFY7oUN');
const bodyParser = require('body-parser');
const cors = require('cors')({origin: true});
const mailer = require('nodemailer');
const uuid = require('uuid').v4;
const _ = require('lodash');
const Utils = require('./utils');

// Initialize firebase DB connection
admin.initializeApp();
const DB = admin.firestore();

// Create email transporter
const transporter = mailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tylertracey09@gmail.com',
    pass: 'vezaabzwldrguasv' // Single App Password
  }
});

// Create simple mountable express app with CORS enabled
const app = express();
app.use(cors);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/submitOrder', async (request, response) => {
  // Verify Request Data
  const {order, token} = request.body;

  if (!order || !token) {
    return response.status(500).send('Must provide order data and payment token');
  }

  // Load current config from Firebase
  const snapshot = await DB.collection('configuration').get();
  const price = Utils.calculatePrice(snapshot, order.specs);

  order.total = price;
  const orderId = uuid().replace(/-/g, '');
  await DB.collection('orders').doc(orderId).set({
    id: orderId,
    ...order,
    token,
    status: 'Created',
  });
  
  // Deposit price
  const total = price * 100 * 0.35;
  
  // Submit charge to Stripe API
  const stripeResponse = await Stripe.charges.create({
    amount: total,
    currency: "usd",
    description: "Abasi Concepts Custom Guitar",
    source: token,
  });
  
  // Record status of charge and update order
  const chargeId = uuid().replace(/-/g, '');
  await DB.collection('charges').doc().set({
    id: chargeId,
    orderId,
    total: order.total,
    stripeToken: token,
    status: stripeResponse.status,
  });

  await DB.collection('orders').doc(orderId).update({
    status: stripeResponse.status,
  })

  // Respond to request
  response.status(201).json(stripeResponse);

  // Send receipt email to user
  Utils.sendEmail(transporter, order.purchaserInfo.email);
});

// Start Server
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
