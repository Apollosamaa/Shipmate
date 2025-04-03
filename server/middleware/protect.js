import User from "../models/UserModel.js";

const protect = async (req, res, next) => {
  try {
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    // Find or create user in your database
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default protect;