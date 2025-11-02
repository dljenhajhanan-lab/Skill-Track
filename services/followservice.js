import { Follow } from "./";
import User from "../controllers/auth/user.js";
import { AppError } from "../utils/appError.js";
const validFollowRules = {
  student: ["professor", "company", "student"],
 professor : ["student"],
  company: ["student"],
};

export const followService = {
  async createFollow(followerId, targetId) {
    const follower = await User.findById(followerId);
    const following = await User.findById(targetId);

    if (!follower || !following) throw new AppError("المستخدم غير موجود", 404);

    if (followerId.toString() === targetId)
      throw new AppError("لا يمكنك متابعة نفسك", 400);

    const allowedTargets = validFollowRules[follower.role] || [];
    if (!allowedTargets.includes(following.role))
      throw new AppError(
        `المستخدم بدور "${follower.role}" لا يمكنه متابعة "${following.role}"`,
        403
      );

    const exist = await Follow.findOne({ follower: followerId, following: targetId });
    if (exist) throw new AppError("تمت المتابعة مسبقًا", 400);

    const follow = await Follow.create({ follower: followerId, following: targetId });

    // تحديث العدادات في user
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(targetId, { $inc: { followersCount: 1 } });

    return follow;
  },

  async unfollow(followerId, targetId) {
    const follow = await Follow.findOneAndDelete({ follower: followerId, following: targetId });
    if (!follow) throw new AppError("لا توجد متابعة لإلغائها", 404);

    // تقليل العدادات
    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(targetId, { $inc: { followersCount: -1 } });

    return true;
  },

  async getFollowing(userId) {
    const result = await Follow.find({ follower: userId }).populate(
      "following",
      "name email role profileImage"
    );
    return result;
  },

  async getFollowers(userId) {
    const result = await Follow.find({ following: userId }).populate(
      "follower",
      "name email role profileImage"
    );
    return result;
  },
};
