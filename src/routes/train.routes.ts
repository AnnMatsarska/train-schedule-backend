import { Router } from "express";
import {
  createTrain,
  deleteTrain,
  getAllTrains,
  getTrainById,
  updateTrain,
  updateTrainPartially,
} from "../controllers/train.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createTrain);
router.get("/", getAllTrains);
router.get("/:id", getTrainById);
router.put("/:id", updateTrain);
router.patch("/:id", updateTrainPartially);
router.delete("/:id", deleteTrain);

export default router;
