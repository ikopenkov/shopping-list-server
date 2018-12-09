import { Request, Response } from 'express';

const checkValidation = (req: Request, res: Response) => {
  const errors = req.validationErrors();

  if (errors) {
    res.status(406);
    res.send({ errors });
    throw errors;
  }
};

const findItem = async <T>(
  findMethod: () => Promise<T | null>,
) => {
  let item: T | null;
  try {
    item = await findMethod();
  } catch (error) {
    if (error!.name === 'CastError') {
      return null;
    } else {
      throw error;
    }
  }
  return item;
};

export const ReqUtils = {
  checkValidation,
  findItem,
};
