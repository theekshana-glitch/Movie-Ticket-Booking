const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.query(`
    SELECT p.*, b.customer_id, c.name AS customer_name, b.total_amount AS booking_total
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    JOIN customers c ON b.customer_id = c.id
    ORDER BY p.id DESC
  `);
  return rows;
};

exports.create = async (data) => {
  const { booking_id, amount, mode, status } = data;
  const ref = 'TXN-' + Date.now();
  const [r] = await db.query(
    `INSERT INTO payments (booking_id, amount, mode, status, transaction_ref, paid_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [booking_id, amount, mode, status, ref, status === 'paid' ? new Date() : null]
  );
  return { id: r.insertId, transaction_ref: ref };
};

exports.updateStatus = async (id, status, mode) => {
  await db.query(
    'UPDATE payments SET status=?, mode=?, paid_at=? WHERE id=?',
    [status, mode, status === 'paid' ? new Date() : null, id]
  );
};