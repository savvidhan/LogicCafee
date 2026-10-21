import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import {
  createProblem,
  getProblemsByPattern,
  getProblemById,
  getProblemStats,
} from "./problem.service.js";

// Create a new problem 
export const create = async (req, res, next) => {
  try {

    // Extract problem details from request body
    const { title, pattern, difficulty } = req.body;

    // Validate required fields
    if (!title || !pattern || !difficulty) {
      throw new ApiError(400, "Title, pattern and difficulty are required");
    }

    // Create problem via service layer
    const problem = await createProblem(req.body);

    res.status(201).json(
      new ApiResponse(201, problem, "Problem created")
    );

  } 
  catch (error) {
    // Handle errors
    next(error);
  }
};

// Get problems by pattern ID 
export const getByPattern = async (req, res, next) => {
  try {

    // Fetch problems for the given pattern via service layer
    const data = await getProblemsByPattern(req.params.patternId);

    res.status(200).json(
      new ApiResponse(200, data, "Problems fetched by pattern")
    );

  } 
  catch (error) {
    next(error);
  }
};

// Get single problem by ID
export const getOne = async (req, res, next) => {
  try {

    // Fetch single problem by ID via service layer
    const problem = await getProblemById( req.params.id );

    res.status(200).json(
      new ApiResponse(200, problem, "Problem fetched")
    );

  } 
  catch (error) {
    next(error);
  }
};

/**
 * Get global problem stats
 */
// Get global problem stats
export const getStats = async (req, res, next) => {
  try {

    // Fetch problem stats via service layer
    const stats = await getProblemStats();

    res.status(200).json(
      new ApiResponse(200, stats, "Problem stats fetched")
    );

  } 
  catch (error) {
    next(error);
  }
};
