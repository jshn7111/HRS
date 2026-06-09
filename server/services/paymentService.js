import Payment from '../models/Payment.js';

export const createPaymentRecord = (payload) => Payment.create(payload);
export const updatePaymentStatus = (paymentId, status) =>
  Payment.findOneAndUpdate({ paymentId }, { status }, { new: true });
