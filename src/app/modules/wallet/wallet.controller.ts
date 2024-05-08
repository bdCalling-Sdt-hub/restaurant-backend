import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { walletServices } from "./wallet.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { USER_ROLE } from "../user/user.constant";
const sentAmountToTheVendor = catchAsync(
  async (req: Request, res: Response) => {
    const result = await walletServices.sendAmountToVendor(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment Send successfully",
      data: result,
    });
  }
);
const getWalletDetails = catchAsync(async (req: Request, res: Response) => {
  const query = { ...req.query };
  const { role, userId } = req?.user;
  if (role === USER_ROLE.vendor) {
    query["owner"] = userId;
  }
  const result = await walletServices.getAllWalletDetails(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet details retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});

export const walletControllers = {
  sentAmountToTheVendor,
  getWalletDetails,
};
