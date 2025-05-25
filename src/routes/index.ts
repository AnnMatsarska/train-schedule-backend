import { Router } from "express";
import authRoutes from "./auth.routes";
import trainRoutes from "./train.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/trains", trainRoutes);

export default router;
