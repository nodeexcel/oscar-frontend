import client from './client.js';

/**
 * Fetch available booking slots for a date.
 * @param {string} date - YYYY-MM-DD
 * @returns {Promise<Array<{ start_time: string, end_time: string }>>}
 */
export function getSlots(date) {
  return client.get('/api/bookings/slots', { params: { date } }).then((res) => res.data);
}

/**
 * Create a booking.
 * @param {{ start_time: string, end_time: string }} payload - ISO date-time strings
 */
export function createBooking(payload) {
  return client.post('/api/bookings', payload).then((res) => res.data);
}

/**
 * Cancel a booking (DELETE).
 * @param {number} bookingId
 */
export function cancelBooking(bookingId) {
  return client.delete(`/api/bookings/${bookingId}`);
}
