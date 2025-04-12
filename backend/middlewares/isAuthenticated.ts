import jwt from "jsonwebtoken";

const isAuthenticated = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    if (!process.env.SECRET_KEY) {
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    if (typeof decode !== "string" && "userId" in decode) {
      req.headers["userId"] = decode.userId;
    } else {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
export default isAuthenticated;
