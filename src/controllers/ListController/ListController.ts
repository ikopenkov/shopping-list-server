import { Request, RequestHandler, Response } from 'express';
import { ListModel } from '../../models/ListModel';
import { ReqUtils } from '../../utils/ReqUtils';

const findListEntry = async (id: string) => {
  const findEntry = async () => {
    return await ListModel.findOne({ _id: id }).populate('purchases');
  };

  return await ReqUtils.findItem(findEntry);
};

const getLists: RequestHandler = async (req, res) => {
  try {
    const lists = await ListModel.find().populate('purchases');
    res.json({
      lists,
    });
  } catch (error) {
    console.error('lists getting error', error);
    res.sendStatus(500);
  }
};

const getList: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const list = await findListEntry(id);

  if (!list) {
    res.status(404);
    res.json({
      error: `List with id ${id} not found`,
    });
  } else {
    res.json({
      list,
    });
  }
};

const addList: RequestHandler = async (req, res) => {
  try {
    await ReqUtils.checkValidation(req, res);
  } catch (error) {
    return;
  }

  const { name } = req.body;

  const list = new ListModel({
    name,
  });

  try {
    await list.save();

    res.json({ list });
  } catch (error) {
    console.error('list creating error', error);

    res.sendStatus(500);
  }
};

const updateList: RequestHandler = async (req, res) => {
  try {
    await ReqUtils.checkValidation(req, res);
  } catch (error) {
    return;
  }

  const { id } = req.params;

  const list = await findListEntry(req.params.id);

  if (!list) {
    res.status(404);
    res.json({
      error: `List with id ${id} not found`,
    });
  }

  ['name'].forEach(key => {
    if (req.body.hasOwnProperty(key)) {
      // @ts-ignore
      list[key] = req.body[key];
    }
  });

  try {
    await list.save();

    res.json({ list });
  } catch (error) {
    console.error('list updating error', error);

    res.sendStatus(500);
  }
};

const removeList: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const list = await findListEntry(req.params.id);

  if (!list) {
    res.status(404);
    res.json({
      error: `List with id ${id} not found`,
    });

    return;
  }

  try {
    await Promise.all(list.purchases.map(purchase => purchase.remove()));
    await list.remove();
    res.json({});
  } catch (error) {
    console.error('list removing error', error);
    res.sendStatus(500);
  }
};

export const ListController = {
  getLists,
  getList,
  addList,
  updateList,
  removeList,
  findListEntry,
};
