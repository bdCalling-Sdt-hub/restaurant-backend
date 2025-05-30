import slugify from "slugify";
import AppError from "../../errors/AppError";
import CuisineModel from "../Cuisine/cuisine.model";
import RestaurantModel from "../Restaurant/restaurant.model";
import { IMenu, TMenuQuery } from "./menu.interface"
import MenuModel from "./menu.model";
import { Request } from "express";
import { Types } from "mongoose";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { MenuSearchFields } from "./menu.constant";
import uploadImage from "../../utils/uploadImage";



const createMenuService = async (req:Request, loginUserId: string, payload: IMenu) => {
    const { cuisineId, name } = payload;
    const slug = slugify(name).toLowerCase();

    //check cuisine not found
    const cuisine = await CuisineModel.findById(cuisineId);
    if (!cuisine) {
      throw new AppError(404, "This cuisine not found");
    }

    //check restaurant not found
    const restaurant = await RestaurantModel.findOne({
      ownerId: loginUserId
    });
    if (!restaurant) {
      throw new AppError(404, "Restaurant not found");
    }


    //check menu already existed
    const menu = await MenuModel.findOne({
      ownerId: loginUserId,
      restaurantId: restaurant._id,
      cuisineId,
      slug
    });

    if(menu) {
      throw new AppError(409, "Menu is already existed");
    }

    
    
    if (!req.file) {
      throw new AppError(400, "image is required");
    }
    let image="";
    if (req.file) {
      image = await uploadImage(req);
    }

    //create the menu
    const result = await MenuModel.create({
        ...payload,
        ownerId: loginUserId,
        restaurantId: restaurant._id,
        image,
        slug
    })
    
    return result;
}


const getMenusService = async (loginUserId:string, query: TMenuQuery) => {
  
  const ObjectId = Types.ObjectId;
    // 1. Extract query parameters
    const {
      searchTerm, 
      page = 1, 
      limit = 10, 
      sortOrder = "desc",
      sortBy = "createdAt", 
      ...filters  // Any additional filters
    } = query;
  
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
  
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
  
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
      searchQuery = makeSearchQuery(searchTerm, MenuSearchFields);
    }
  
    //5 setup filters
    let filterQuery = {};
    if (filters) {
      filterQuery = makeFilterQuery(filters);
    }

  const result = await MenuModel.aggregate([
    {
      $match: { ownerId: new ObjectId(loginUserId)}
    },
    {
      $lookup: {
        from: "menureviews",
        localField: "_id",
        foreignField: "menuId",
        as: "reviews"
      }
    },
    {
      $addFields: {
        totalReview: { $size: "$reviews" },
      }
    },
    {
      $lookup: {
        from: "cuisines", localField: "cuisineId", foreignField: "_id", as: "cuisine"
      }
    },
    {
      $unwind: "$cuisine"
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        image:1,
        price:1,
        ingredient:1,
        ratings:1,
        totalReview:1,
        cuisineId:1,
        restaurantId: 1,
        cuisineName: "$cuisine.name",
        createdAt: "$createdAt"
      }
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ])


  const totalMenuResult = await MenuModel.aggregate([
    {
      $match: { ownerId: new ObjectId(loginUserId)}
    },
    {
      $lookup: {
        from: "cuisines", localField: "cuisineId", foreignField: "_id", as: "cuisine"
      }
    },
    {
      $unwind: "$cuisine"
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalMenuResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), //currentPage
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
}

const getMenusByRestaurantIdService = async (restaurantId:string, query: TMenuQuery) => {
  const ObjectId = Types.ObjectId;
    // 1. Extract query parameters
    const {
      searchTerm, 
      page = 1, 
      limit = 10, 
      sortOrder = "desc",
      sortBy = "createdAt", 
      ...filters  // Any additional filters
    } = query;
  
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
  
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
  
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
      searchQuery = makeSearchQuery(searchTerm, MenuSearchFields);
    }
  
    //5 setup filters
    let filterQuery = {};
    if (filters) {
      filterQuery = makeFilterQuery(filters);
    }

  const result = await MenuModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurantId)}
    },
    {
      $lookup: {
        from: "menureviews",
        localField: "_id",
        foreignField: "menuId",
        as: "reviews"
      }
    },
    {
      $addFields: {
        totalReviewers: { $size: "$reviews" },
      }
    },
    {
      $lookup: {
        from: "cuisines", localField: "cuisineId", foreignField: "_id", as: "cuisine"
      }
    },
    {
      $unwind: "$cuisine"
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        image:1,
        price:1,
        ingredient:1,
        ratings:1,
        totalReviewers:1,
        cuisineId:1,
        restaurantId: 1,
        cuisineName: "$cuisine.name",
        createdAt: "$createdAt"
      }
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ])


  const totalMenuResult = await MenuModel.aggregate([
    {
      $match: { restaurantId: new ObjectId(restaurantId)}
    },
    {
      $lookup: {
        from: "cuisines", localField: "cuisineId", foreignField: "_id", as: "cuisine"
      }
    },
    {
      $unwind: "$cuisine"
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalMenuResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), //currentPage
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
}

const updateMenuService = async (req:Request, loginUserId: string, menuId:string, payload: Partial<IMenu>) => {
  const { name, cuisineId } = payload;
  //check menu not found
  const menu = await MenuModel.findOne({
    _id: menuId,
    ownerId: loginUserId,
  });
  if(!menu) {
    throw new AppError(404, "Menu not found");
  }

  //check cuisine not found
  if (cuisineId) {
    const cuisine = await CuisineModel.findById(cuisineId);
    if (!cuisine) {
      throw new AppError(404, "This cuisine not found");
    }
  }
  
  //set slug
  if(name){
    const slug = slugify(name).toLowerCase();
    payload.slug = slug;
    const menuExist = await MenuModel.findOne({
      _id: { $ne: menuId },
      ownerId: loginUserId,
      slug
    });
    if (menuExist) {
      throw new AppError(409, "Sorry! This Menu is already existed");
    }
  }
  
  //upload the image
  if(req.file) {
      payload.image = await uploadImage(req);
  }

  //update the menu
  const result = await MenuModel.updateOne(
    {
      _id: menuId,
      ownerId: loginUserId
    },
    payload
   )
  
  return result;
}


const deleteMenuService = async (loginUserId: string, menuId: string) => {
   //check menu not found
   const menu = await MenuModel.findOne({
    _id: menuId,
    ownerId: loginUserId,
  });

  if (!menu) {
    throw new AppError(404, "Menu not found");
  }

  const result = await MenuModel.deleteOne({
    _id: menuId,
    ownerId: loginUserId
  },)
  return result;
}


export {
    createMenuService,
    getMenusService,
    getMenusByRestaurantIdService,
    updateMenuService,
    deleteMenuService
}