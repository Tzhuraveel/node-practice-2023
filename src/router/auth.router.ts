import { Router } from "express";

import { authController } from "../controller";
import { EAction, EUserValidator } from "../enum";
import { userMiddleware } from "../middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/register",
  userMiddleware.isValidBody(EUserValidator.CREATE),
  userMiddleware.getDynamicallyAndThrow(EAction.THROW, "email"),
  authController.register
);
router.post(
  "/login",
  userMiddleware.isValidBody(EUserValidator.LOGIN),
  userMiddleware.getDynamicallyAndThrow(EAction.NEXT, "email"),
  authController.login
);

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh
);

export const authRouter = router;
