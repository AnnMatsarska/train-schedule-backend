const TEXT = {
  ERROR: {
    //auth
    USER_EXIST: "User already exists",
    INVALID_PASSWORD: "Password must be at least 6 characters long",
    REGISTER_FAILED: "Registration failed",
    INVALID_CREDENTIALS: "Invalid credentials",
    LOGIN_FAILED: "Login failed",
    UNAUTHORIZED: "Unauthorized",
    USER_NOT_FOUND: "User not found",
    NO_PROFILE: "Failed to get profile",
    NO_TOKEN: "No token provided",
    INVALID_TOKEN_FORMAT: "Invalid token format",
    INVALID_TOKEN: "Invalid or expired token",
    AUTH_ERROR: "Authentication error",
    //train
    TRAIN_EXIST: "Train with this number already exists.",
    TRAIN_CREATE_FAIL: "Failed to create train.",
    TRAIN_GET_FAIL: "Failed to fetch trains.",
    TRAIN_NOT_FOUND: "Train not found.",
    TRAIN_UPDATE_FAIL: "Failed to update train.",
    TRAIN_DELETE_FAIL: "Failed to delete train.",
  },
  SUCCESS: {
    REGISTER_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    TRAIN_DELETED: "Train deleted successfully.",
  },
};

export default TEXT;
