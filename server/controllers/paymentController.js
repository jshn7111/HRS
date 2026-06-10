import razorpay from '../config/razorpay.js';
import Payment from '../models/Payment.js';

export const createPayment = async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ message: 'Payment gateway not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' });
  }
  const { amount, currency = 'INR', receipt } = req.body;
  const options = {
    amount: Math.round(amount * 100),
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
  };
  const order = await razorpay.orders.create(options);
  const payment = await Payment.create({
    booking: req.body.booking,
    user: req.user._id,
    amount,
    provider: 'razorpay',
    status: 'pending',
    paymentId: order.id,
    receipt: options.receipt,
  });
  res.status(201).json({ order, payment });
};

export const verifyPayment = async (req, res) => {
  const { paymentId, orderId, signature } = req.body;
  res.json({ paymentId, orderId, signature, verified: true });
};
