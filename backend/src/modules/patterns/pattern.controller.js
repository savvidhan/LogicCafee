import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import {
  createPattern,
  getAllPatterns,
  getPatternById,
} from "./pattern.service.js";

// Create a new pattern
export const create = async (req, res, next) => {
  try {

    // Extract pattern details from request body
    const { name, description, whenToUse, commonMistakes, codeTemplate } = req.body;

    // Validate required fields
    if (!name || !description) {
      throw new ApiError(400, "Name and description are required");
    }

    // Create pattern via service layer
    const pattern = await createPattern({
      name,
      description,
      whenToUse,
      commonMistakes,
      codeTemplate,
    });

    res.status(201).json(
      new ApiResponse(201, pattern, "Pattern created")
    );

  } 
  catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {

    // Fetch all patterns via service layer
    const patterns = await getAllPatterns();

    res.status(200).json(
      new ApiResponse(200, patterns, "Patterns fetched")
    );

  } 
  catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    // Fetch single pattern by ID via service layer
    const pattern = await getPatternById(req.params.id);

    res.status(200).json(
      new ApiResponse(200, pattern, "Pattern fetched")
    );

  } 
  catch (error) {
    next(error);
  }
};
