import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { menuCategoryServices } from "../menuCategory/menuCategory.service";
import moment from "moment";
import { cartServices } from "./cart.service";
const insertItemIntoCart = catchAsync(async (req: Request, res: Response) => {
  const data: any = { item: req.body };
  data.date = moment().format("YYYY-MM-DD");
  data.booking = req.params.id;
  data.user = req?.user.userId;
  const result = await cartServices.insertItemsIntoCart(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item added successfully",
    data: result,
  });
});
const getCartItems = catchAsync(async (req: Request, res: Response) => {
  const result = await cartServices.getCartItems(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart items retrived successfully",
    data: result,
  });
});
const removeItemFromCart = catchAsync(async (req: Request, res: Response) => {
  const result = await cartServices.removeItemFromCart(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item removed successfully",
    data: result,
  });
});

export const cartControllers = {
  insertItemIntoCart,
  getCartItems,
  removeItemFromCart,
};