import { pool } from "../config/database.js";

export class ContactForm {
  // Create a new contact form submission
  static async create(formData){
    const { firstName, lastName, email, phone, message, subject, serviceType } = formData;

    const query = `
      INSERT INTO contact_forms ("firstName", "lastName", "email", "phone", "message", "subject", "serviceType")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [firstName, lastName, email, phone, message, subject || null, serviceType || 'Other'];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  // Find contact form by ID
  static async findById(id){
    const query = 'SELECT * FROM contact_forms WHERE id = $1';
    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
  }

  // Get all contact forms
  static async findAll() {
    const query = 'SELECT * FROM contact_forms ORDER BY "createdAt" DESC';
    const result = await pool.query(query);

    return result.rows;
  }

  // Delete contact form
  static async delete(id) {
    const query = 'DELETE FROM contact_forms WHERE id = $1';
    const result = await pool.query(query, [id]);

    return (result.rowCount ?? 0) > 0;
  }
}

export default ContactForm;
