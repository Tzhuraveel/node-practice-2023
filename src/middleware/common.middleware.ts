import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { EAction } from "../enum";
import { ApiError } from "../error";
import { User } from "../model";

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
  public isValidId(idField: string, from: "params" | "query" = "params") {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!isObjectIdOrHexString(req[from][idField])) {
          next(new ApiError("Id not valid", 400));
          return;
        }
        req.res.locals.id = req[from][idField];
        next();
      } catch (e) {
        next(e);
      }
    };
  }
  public getDynamicallyAndCheckExistence(
    actionWithFoundField: EAction,
    field: string,
    from: "body" | "params" | "query" = "body",
    dbField = field
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const fieldValue = req[from][field];

        const foundField = await User.findOne({ [dbField]: fieldValue });

        switch (actionWithFoundField) {
          case EAction.THROW:
            if (foundField) {
              next(new ApiError(`${fieldValue} already exist`, 400));
              return;
            }
            break;
          case EAction.NEXT:
            if (!foundField) {
              next(new ApiError(`User not found`, 400));
              return;
            }
            req.res.locals.user = foundField;
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
