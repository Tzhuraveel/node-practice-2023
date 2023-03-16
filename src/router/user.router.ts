import { Router } from "express";

import { userController } from "../controller";
import { EAction } from "../enum";
import { authMiddleware, commonMiddleware } from "../middleware";
import { UserValidator } from "../validator";

const router = Router();

router.get("/", userController.getAll);

router.get(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  authMiddleware.checkAccessToken,
  commonMiddleware.getDynamicallyAndCheckExistence(
    EAction.NEXT,
    "userId",
    "params",
    "_id"
  ),
  userController.getById
);

router.delete(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  authMiddleware.checkAccessToken,
  commonMiddleware.getDynamicallyAndCheckExistence(
    EAction.NEXT,
    "userId",
    "params",
    "_id"
  ),
  userController.delete
);

router.post(
  "/password/change",
  authMiddleware.checkAccessToken,
  commonMiddleware.isValidBody(UserValidator.changePassword),
  userController.changePassword
);

export const userRouter = router;
