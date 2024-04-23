import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { storeFile } from "../../utils/fileHelper";
const insertuserIntoDb = catchAsync(async (req: Request, res: Response) => {
  // if (req?.file) {
  //   req.body.image = storeFile("profile", req?.file?.filename);
  // }
  const result = await userServices.insertUserIntoDb(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user created successfully",
    data: result,
  });
});
const insertVendorIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.insertVendorIntoDb(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "vendor created successfully",
    data: result,
  });
});

const getme = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getme(req.user.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user retrived successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.image = storeFile("profile", req?.file?.filename);
  }
  const result = await userServices.updateProfile(req.user.userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user profile updated successfully",
    data: result,
  });
});
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getAllusers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "users retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});
const getsingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getSingleUser(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user retrived successfully",
    data: result,
  });
});
const updateUser = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.image = storeFile("profile", req?.file?.filename);
  }
  const result = await userServices.updateUser(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "user retrived successfully",
    data: result,
  });
});

export const userControllers = {
  insertuserIntoDb,
  insertVendorIntoDb,
  getme,
  updateProfile,
  getAllUsers,
  getsingleUser,
  updateUser,
};
