import { AppError } from "../utils/appError.js";

export const createItem = async (Model, profileId, data) => {
  const item = await Model.create({ ...data, profile: profileId });
  return {
    message: `${Model.modelName} created successfully`,
    data: item,
  };
};

export const getItems = async (Model, profileId) => {
  const items = await Model.find({ profile: profileId });
  return {
    message: `${Model.modelName}s fetched successfully`,
    data: items,
  };
};

export const deleteItem = async (Model, id, profileId) => {
  const item = await Model.findOneAndDelete({ _id: id, profile: profileId });
  if (!item) throw new AppError(`${Model.modelName} not found`, 404);
  return {
    message: `${Model.modelName} deleted successfully`,
  };
};

export const updateItem = async (Model, id, profileId, updates) => {
  const item = await Model.findOneAndUpdate(
    { _id: id, profile: profileId },
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  if (!item) throw new AppError(`${Model.modelName} not found`, 404);

  return {
    message: `${Model.modelName} updated successfully`,
    data: item,
  };
};