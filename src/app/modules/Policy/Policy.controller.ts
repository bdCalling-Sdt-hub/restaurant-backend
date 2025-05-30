import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TPolicyType } from './Policy.interface';
import { createPolicyService, updatePolicyByTypeService, getPolicyByTypeService, deletePolicyByTypeService, getPoliciesService } from './Policy.service';

const createPolicy = catchAsync(async (req, res) => {
  const result = await createPolicyService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Policy is created successfully',
    data: result,
  });
});


const getPolicies = catchAsync(async (req, res) => {
  const result = await getPoliciesService();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Policies are retrived successfully",
    data: result
  });
});

const getPolicyByType = catchAsync(async (req, res) => {
  const { type } = req.params;
  const result = await getPolicyByTypeService(type as TPolicyType);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Policy is retrieved successfully',
    data: result,
  });
});


const updatePolicyByType = catchAsync(async (req, res) => {
  const { type } = req.params;
  const result = await updatePolicyByTypeService(type as TPolicyType, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Policy is updated successfully',
    data: result,
  });
});

const deletePolicyByType = catchAsync(async (req, res) => {
  const { type } = req.params;
  const result = await deletePolicyByTypeService(type as TPolicyType);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Policy is deleted successfully',
    data: result,
  });
});

const PolicyController = {
  createPolicy,
  getPolicies,
  getPolicyByType,
  updatePolicyByType,
  deletePolicyByType
};
export default PolicyController;
