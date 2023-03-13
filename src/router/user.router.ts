import { Router } from "express";

import { userController } from "../controller";
import { authMiddleware } from "../middleware";
import { userMiddleware } from "../middleware";

const router = Router();

router.get("/", userController.getAll);

router.get(
  "/:userId",
  authMiddleware.checkAccessToken,
  userMiddleware.isUserIdValid,
  userMiddleware.getByIdHandlerError,
  userController.getById
);

router.delete(
  "/:userId",
  authMiddleware.checkAccessToken,
  userMiddleware.isUserIdValid,
  userMiddleware.getByIdHandlerError,
  userController.delete
);

router.put(
  "/:userId",
  authMiddleware.checkAccessToken,
  userMiddleware.isUserIdValid,
  userMiddleware.isUserValidUpdate,
  userMiddleware.getByIdHandlerError,
  userController.update
);

export const userRouter = router;
