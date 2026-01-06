import { ContactForm } from "../models/ContactForm.js";
import { sendContactFormToAdmin, sendResponseToClient } from "../services/emailService.js";

export const submitContactForm = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, message, subject, serviceType } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Create contact form entry
    const contactForm = await ContactForm.create({
      firstName,
      lastName,
      email,
      phone,
      message,
      subject,
      serviceType,
    });

    // Send email to admin (owner will reply manually)
    try {
      await sendContactFormToAdmin(contactForm);
      console.log("✓ Contact form forwarded to admin for manual reply");
    } catch (adminEmailError) {
      console.error("Failed to send email to admin:", adminEmailError);
    }

    // Send acknowledgement to client (auto-response)
    try {
      await sendResponseToClient(contactForm.email, contactForm.firstName || contactForm.email);
      console.log(`✓ Auto-response sent to client: ${contactForm.email}`);
    } catch (clientEmailError) {
      console.error("Failed to send auto-response to client:", clientEmailError);
      // Do not fail the because oissues
    }
    res.status(201).json({
      message: "Thank you for contacting us. We have received your message and will get back to you soon!",
      data: contactForm,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactForms = async (req, res, next) => {
  try {
    const forms = await ContactForm.findAll();
    res.status(200).json(forms);
  } catch (error) {
    next(error);
  }
};

export const getContactForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await ContactForm.findById(Number(id));

    if (!form) {
      return res.status(404).json({ message: "Contact form not found" });
    }

    res.status(200).json(form);
  } catch (error) {
    next(error);
  }
};

export const deleteContactForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ContactForm.delete(Number(id));

    if (!deleted) {
      return res.status(404).json({ message: "Contact form not found" });
    }

    res.status(200).json({ message: "Contact form deleted successfully" });
  } catch (error) {
    next(error);
  }
};
