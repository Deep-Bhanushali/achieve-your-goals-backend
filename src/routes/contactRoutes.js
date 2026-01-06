import { Router } from "express";
import {
  submitContactForm,
  getContactForms,
  getContactForm,
  deleteContactForm,
} from "../controllers/contactController";

const router = Router();

router.post("/submit", submitContactForm);
router.get("/", getContactForms);
router.get("/:id", getContactForm);
router.delete("/:id", deleteContactForm);

export default router;
