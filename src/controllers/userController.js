import { User } from "../models/User.js";
import { sendResponseToClient, sendContactFormToAdmin } from "../services/emailService.js";

export const signUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword, agreeToTerms } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!agreeToTerms) {
      return res.status(400).json({ message: "You must agree to the terms and conditions" });
    }

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      agreeToTerms,
    });

    console.log("✓ New user registered and forwarded to admin for manual follow-up");
    console.log(`   Owner will manually review and reply to: ${email}`);

    // Notify admin about new user (optional)
    try {
      await sendContactFormToAdmin({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        subject: "New User Registration",
        message: `A new user has signed up: ${user.firstName} ${user.lastName} (${user.email})`,
        serviceType: "Other",
      });
    } catch (adminNotifyError) {
      console.error("Failed to notify admin about new user:", adminNotifyError);
    }

    // Send acknowledgement to the user
    try {
      await sendResponseToClient(user.email, user.firstName || user.email);
      console.log(`✓ Welcome/acknowledgement sent to new user: ${user.email}`);
    } catch (clientEmailError) {
      console.error("Failed to send welcome email to user:", clientEmailError);
    }

    res.status(201).json({
      message: "Account created successfully! We have received your information and will get back to you soon.",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(Number(id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't send password in response
    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();

    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json(usersWithoutPasswords);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone } = req.body;

    const user = await User.updateUser(Number(id), { firstName, lastName, phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await User.deleteUser(Number(id));
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
