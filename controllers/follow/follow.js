import { followService } from "../follow";

export const followController = {
  createFollow: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const targetId = req.params.targetId;

      const result = await followService.createFollow(userId, targetId);
      res.status(201).json({
        success: true,
        message: "تمت المتابعة بنجاح ✅",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // إلغاء متابعة
  unfollow: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const targetId = req.params.targetId;

      await followService.unfollow(userId, targetId);
      res.status(200).json({
        success: true,
        message: "تم إلغاء المتابعة بنجاح ❌",
      });
    } catch (error) {
      next(error);
    }
  },

  // من يتابعهم المستخدم
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

  // من يتابع المستخدم
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
