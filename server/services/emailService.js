import { sendEmail } from '../utils/sendEmail.js';

export const sendRegistrationEmail = async (user) => {
  const subject = 'Welcome to StayEase';
  const text = `Hello ${user.name},\n\nWelcome to StayEase!`;
  return sendEmail({ to: user.email, subject, text });
};
