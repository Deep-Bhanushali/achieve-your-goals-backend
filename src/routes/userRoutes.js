import { Router } from "express";
import {
  signUp,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = Router();

router.post("/signup", signUp);
router.get("/:id", getUser);
router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
