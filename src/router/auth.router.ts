import { Router } from "express";

import { authController } from "../controller";
import { EActionTokenType, EDynamicallyAction, ETokenType } from "../enum";
import { authMiddleware, commonMiddleware } from "../middleware";
import { UserValidator } from "../validator";

const router = Router();

router.post(
  "/register",
  commonMiddleware.isValidBody(UserValidator.createUser),
  commonMiddleware.getDynamicallyAndCheckExistence(
    EDynamicallyAction.THROW,
    "email"
  ),
  authController.register
);

router.post(
  "/login",
  commonMiddleware.isValidBody(UserValidator.loginUser),
  commonMiddleware.getDynamicallyAndCheckExistence(
    EDynamicallyAction.NEXT,
    "email"
  ),
  authController.login
);

router.post(
  "/refresh",
  authMiddleware.checkToken(ETokenType.REFRESH),
  authController.refresh
);

router.post(
  "/change/password",
  authMiddleware.checkToken(ETokenType.ACCESS),
  commonMiddleware.isValidBody(UserValidator.changePassword),
  authController.changePassword
);

router.post(
  "/forgot/password",
  commonMiddleware.isValidBody(UserValidator.emailValidator),
  commonMiddleware.getDynamicallyAndCheckExistence(
    EDynamicallyAction.NEXT,
    "email"
  ),
  authController.forgotPassword
);

router.put(
  "/forgot/password/:token",
  commonMiddleware.isValidBody(UserValidator.updateForgotPassword),
  authMiddleware.checkActionToken(EActionTokenType.FORGOT),
  authMiddleware.checkOldPassword,
  authController.updateForgotPassword
);

router.post(
  "/activate",
  commonMiddleware.isValidBody(UserValidator.emailValidator),
  commonMiddleware.getDynamicallyAndCheckExistence(
    EDynamicallyAction.NEXT,
    "email"
  ),
  authController.sendActivateToken
);

router.put(
  "/activate/:token",
  authMiddleware.checkActionToken(EActionTokenType.ACTIVATE),
  authController.activate
);

export const authRouter = router;
