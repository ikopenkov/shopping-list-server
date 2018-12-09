import { Request, RequestHandler, Response } from 'express';
import { ReqUtils } from '../../utils/ReqUtils';
import { PurchaseModel } from '../../models/PurchaseModel';
import { ListController } from '../ListController/ListController';

const findPurchaseEntry = async (id: string) => {
  const findEntry = async () => {
    return await PurchaseModel.findOne({ _id: id });
  };

  return await ReqUtils.findItem(findEntry);
};

const addPurchase: RequestHandler = async (req, res) => {
  try {
    await ReqUtils.checkValidation(req, res);
  } catch (error) {
    return;
  }

  const { listId } = req.params;

  const list = await ListController.findListEntry(listId);

  if (!list) {
    res.status(404);
    res.json({
      error: `List with id ${listId} not found`,
    });
    return;
  }

  const purchase = new PurchaseModel({
    name: req.body.name,
    number: req.body.number,
    bought: req.body.bought,
    list: listId,
  });

  list.purchases = list.purchases.concat(purchase);

  try {
    await purchase.save();
    await list.save();

    res.send({ purchase });
  } catch (error) {
    console.error('purchase creating error', error);

    res.sendStatus(500);
  }
};

const updatePurchase: RequestHandler = async (req, res) => {
  try {
    await ReqUtils.checkValidation(req, res);
  } catch (error) {
    return;
  }

  const { purchaseId } = req.params;

  const purchase = await findPurchaseEntry(purchaseId);

  if (!purchase) {
    res.json({
      error: `Purchase with id ${purchaseId} not found`,
    });
    return;
  }

  ['name', 'bought', 'number'].forEach(key => {
    if (req.body.hasOwnProperty(key)) {
      // @ts-ignore
      purchase[key] = req.body[key];
    }
  });

  try {
    await purchase.save();

    res.send({ purchase });
  } catch (error) {
    console.error('purchase creating error', error);

    res.sendStatus(500);
  }
};

const removePurchase: RequestHandler = async (req, res) => {
  const { purchaseId } = req.params;

  const purchase = await findPurchaseEntry(purchaseId);

  if (!purchase) {
    res.json({
      error: `Purchase with id ${purchaseId} not found`,
    });
    return;
  }

  try {
    await purchase.remove();
    res.sendStatus(200);
  } catch (error) {
    console.error('purchase removing error', error);
    res.sendStatus(500);
  }
};

export const PurchaseController = {
  findPurchaseEntry,

  addPurchase,
  updatePurchase,
  removePurchase,
};
