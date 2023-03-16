import { Router } from "express";

import { authController } from "../controller";
import { EAction } from "../enum";
import { authMiddleware, commonMiddleware } from "../middleware";
import { UserValidator } from "../validator";

const router = Router();

router.post(
  "/register",
  commonMiddleware.isValidBody(UserValidator.createUser),
  commonMiddleware.getDynamicallyAndCheckExistence(EAction.THROW, "email"),
  authController.register
);

router.post(
  "/login",
  commonMiddleware.isValidBody(UserValidator.loginUser),
  commonMiddleware.getDynamicallyAndCheckExistence(EAction.NEXT, "email"),
  authController.login
);

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh
);

router.post(
  "/password/forgot",
  commonMiddleware.getDynamicallyAndCheckExistence(EAction.NEXT, "email"),
  authController.forgotPassword
);

router.put(
  "/password/forgot/:token",
  commonMiddleware.isValidBody(UserValidator.updateForgotPassword),
  authMiddleware.checkActionOrForgotToken,
  authController.updateForgotPassword
);

export const authRouter = router;
