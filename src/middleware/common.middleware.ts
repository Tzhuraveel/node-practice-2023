import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { EDynamicallyAction } from "../enum";
import { ApiError } from "../error";
import { userService } from "../service";

class CommonMiddleware {
  public isValidBody(validator: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error, value } = validator.validate(req.body);

        if (error) {
          next(new ApiError(error.message, 400));
          return;
        }

        req.body = value;

        next();
      } catch (e) {
        next(e);
      }
    };
  }
  public getDynamicallyAndCheckExistence(
    actionWithFoundField: EDynamicallyAction,
    field: string,
    from: "body" | "params" | "query" = "body",
    dbField = field
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const fieldFromBody = req[from][field];

        const foundItem = await userService.getBySpecifiedField(
          dbField,
          fieldFromBody
        );

        switch (actionWithFoundField) {
          case EDynamicallyAction.NEXT:
            if (!foundItem) {
              next(new ApiError("Not found user", 400));
              return;
            }
            req.res.locals.user = foundItem;
            break;
          case EDynamicallyAction.THROW:
            if (foundItem) {
              next(new ApiError(`${fieldFromBody} already exist`, 400));
              return;
            }
            break;
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
