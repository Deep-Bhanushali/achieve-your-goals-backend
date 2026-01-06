import transporter from "../config/mailer";


export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || "noreply@mangoadmi.in",
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    // Console log email details before sending
    console.log("\n" + "=".repeat(60));
    console.log("📧 EMAIL DETAILS");
    console.log("=".repeat(60));
    console.log(`From: ${mailOptions.from}`);
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Body Preview: ${options.html.substring(0, 100)}...`);
    console.log("=".repeat(60) + "\n");

    const result = await transporter.sendMail(mailOptions);
    console.log(`✓ Email successfully sent to ${options.to}`);
    console.log(`Response: ${JSON.stringify(result, null, 2)}\n`);
    return result;
  } catch (error) {
    console.error("✗ Email send error:", error);
    throw error;
  }
};

export const sendContactFormToAdmin = async (
  contactData
) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.OWNER_EMAIL;
  
  console.log("\n" + "=".repeat(60));
  console.log("📝 CONTACT FORM DATA");
  console.log("=".repeat(60));
  console.log(`Name: ${contactData.firstName} ${contactData.lastName}`);
  console.log(`Email: ${contactData.email}`);
  console.log(`Phone: ${contactData.phone}`);
  console.log(`Service Type: ${contactData.serviceType || "Not specified"}`);
  console.log(`Subject: ${contactData.subject || "No subject"}`);
  console.log(`Message: ${contactData.message}`);
  console.log("=".repeat(60) + "\n");
  
  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
    <p><strong>Email:</strong> ${contactData.email}</p>
    <p><strong>Phone:</strong> ${contactData.phone}</p>
    <p><strong>Service Type:</strong> ${contactData.serviceType || "Not specified"}</p>
    ${contactData.subject ? `<p><strong>Subject:</strong> ${contactData.subject}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${contactData.message.replace(/\n/g, "<br>")}</p>
    <hr>
    <p><em>Submitted on: ${new Date().toLocaleString()}</em></p>
  `;

  return sendEmail({
    to: adminEmail || "admin@mangoadmi.in",
    subject: `New Contact Form: ${contactData.subject || contactData.firstName} ${contactData.lastName}`,
    html: htmlContent,
  });
};

export const sendResponseToClient = async (
  clientEmail,
  clientName
) => {
  console.log("\n" + "=".repeat(60));
  console.log("📬 AUTO-RESPONSE EMAIL TO CLIENT");
  console.log("=".repeat(60));
  console.log(`Sending to: ${clientEmail}`);
  console.log(`Client Name: ${clientName}`);
  console.log("=".repeat(60) + "\n");
  
  const htmlContent = `
    <h2>Thank You for Contacting Mango Admi!</h2>
    <p>Hi ${clientName},</p>
    <p>Thank you for reaching out to us. We have received your message and appreciate your interest in our services.</p>
    <p>Our team will review your request and get back to you as soon as possible. We typically respond within 24-48 hours.</p>
    <p>If you have any urgent inquiries, please feel free to call us directly.</p>
    <br>
    <p>Best regards,<br>
    <strong>Mango Admi Team</strong><br>
    Achieve Your Goals</p>
  `;

  return sendEmail({
    to: clientEmail,
    subject: "We Received Your Message - Mango Admi",
    html: htmlContent,
  });
};
