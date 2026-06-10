import { supabase } from '../lib/supabase';

export async function createBooking(booking) {
  const { data, error } = await supabase.from('bookings').insert(booking).select().single();
  if (error) throw error;
  return data;
}

export async function fetchUserBookings(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, hotels(name, slug, city, images), rooms(type, price)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function cancelBooking(bookingId) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function submitContactMessage(message) {
  const { data, error } = await supabase.from('contact_messages').insert(message).select().single();
  if (error) throw error;
  return data;
}
