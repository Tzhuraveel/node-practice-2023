import { Router } from "express";

import { userController } from "../controller";
import { EAction, EUserValidator } from "../enum";
import { userMiddleware } from "../middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", userController.getAll);

router.get(
  "/:userId",
  userMiddleware.iValidId,
  authMiddleware.checkAccessToken,
  userMiddleware.getDynamicallyAndThrow(
    EAction.NEXT,
    "userId",
    "params",
    "_id"
  ),
  userController.getById
);

router.delete(
  "/:userId",
  userMiddleware.iValidId,
  authMiddleware.checkAccessToken,
  userMiddleware.getDynamicallyAndThrow(
    EAction.NEXT,
    "userId",
    "params",
    "_id"
  ),
  userController.delete
);

router.put(
  "/:userId",
  userMiddleware.iValidId,
  userMiddleware.isValidBody(EUserValidator.UPDATE),
  authMiddleware.checkAccessToken,
  userMiddleware.getDynamicallyAndThrow(
    EAction.NEXT,
    "userId",
    "params",
    "_id"
  ),
  userController.update
);

export const userRouter = router;
