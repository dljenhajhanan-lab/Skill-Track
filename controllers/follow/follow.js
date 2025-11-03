import { followService } from "./follow";

export const followController = {
  createFollow: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const targetId = req.params.targetId;

      const result = await followService.createFollow(userId, targetId);
      res.status(201).json({
        success: true,
        message: " follow sucssesful ",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  unfollow: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const targetId = req.params.targetId;

      await followService.unfollow(userId, targetId);
      res.status(200).json({
        success: true,
        message: "unfollow sucssesful",
      });
    } catch (error) {
      next(error);
    }
  },

  getFollowing: async (req, res, next) => {
    try {
      const result = await followService.getFollowing(req.params.userId);
      res.status(200).json({
        success: true,
        count: result.length,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getFollowers: async (req, res, next) => {
    try {
      const result = await followService.getFollowers(req.params.userId);
      res.status(200).json({
        success: true,
        count: result.length,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
