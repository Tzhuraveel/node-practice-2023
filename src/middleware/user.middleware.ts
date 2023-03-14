import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";

import { EAction, EUserValidator } from "../enum";
import { ApiError } from "../error";
import { userService } from "../service";
import { UserValidator } from "../validator";

class UserMiddleware {
  public isValidBody(typeOfValid: EUserValidator) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error, value } = UserValidator[typeOfValid].validate(req.body);

        if (error) {
          next(new ApiError(error.message, 400));
        }

        req.body = value;

        next();
      } catch (e) {
        next(e);
      }
    };
  }
  public async iValidId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!isObjectIdOrHexString(req.params.userId)) {
        next(new ApiError("ID not valid", 400));
      }

      next();
    } catch (e) {
      next(e);
    }
  }
  public getDynamicallyAndThrow(
    action: EAction,
    fieldName: string,
    from: "body" | "query" | "params" = "body",
    dbField = fieldName
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const fieldValue = req[from][fieldName];

        const foundUser = await userService.findByField(dbField, fieldValue);

        switch (action) {
          case EAction.THROW:
            if (foundUser) {
              next(new ApiError(`${fieldName} already exist`, 400));
            }
            break;
          case EAction.NEXT:
            if (!foundUser) {
              next(new ApiError(`User not found`, 422));
            }
            req.res.locals = { foundUser };
            break;
        }

        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const userMiddleware = new UserMiddleware();
