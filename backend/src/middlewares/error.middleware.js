export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Only log 5xx errors — 4xx (401, 404, etc.) are expected and don't need stack traces
  if (statusCode >= 500) {
    console.error("❌ Server Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
