import { Router } from "express";

import { authController } from "../controller";
import { EAction } from "../enum";
import { userMiddleware } from "../middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { UserValidator } from "../validator";

const router = Router();

router.post(
  "/register",
  userMiddleware.isValidBody(UserValidator.createUser),
  userMiddleware.getDynamicallyAndThrow(EAction.THROW, "email"),
  authController.register
);
router.post(
  "/login",
  userMiddleware.isValidBody(UserValidator.loginUser),
  userMiddleware.getDynamicallyAndThrow(EAction.NEXT, "email"),
  authController.login
);

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh
);

router.post(
  "/password/change",
  authMiddleware.checkAccessToken,
  userMiddleware.isValidBody(UserValidator.changePassword),
  authController.changePassword
);

export const authRouter = router;
