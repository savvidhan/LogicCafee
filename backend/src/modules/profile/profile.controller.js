import ApiResponse from "../../utils/ApiResponse.js";
import { getProfileSummaryService } from "./profile.service.js";

/**
 * GET /api/profile/summary
 */
export const getProfileSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const summary = await getProfileSummaryService(userId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          summary,
          "Profile summary fetched successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};
