import { Router } from "express";

import { authController } from "../controller";
import { userMiddleware } from "../middleware";
import { authMiddleware } from "../middleware";

const router = Router();

router.post(
  "/register",
  userMiddleware.isUserValidCreate,
  userMiddleware.getDynamicallyAndThrow("email"),
  authController.register
);
router.post(
  "/login",
  userMiddleware.isLoginValid,
  userMiddleware.getDynamicallyOrThrow("email"),
  authController.login
);
router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh
);

export const authRouter = router;
