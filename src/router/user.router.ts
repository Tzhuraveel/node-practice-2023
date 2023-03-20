import { Router } from "express";

import { userController } from "../controller";

const router = Router();

router.get("/", userController.getAll);

router.get("/:userId");

router.delete("/:userId");

export const userRouter = router;
