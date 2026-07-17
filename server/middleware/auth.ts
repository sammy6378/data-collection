import { Request, Response, NextFunction } from "express";

export const requireAdminToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken) {
    return res
      .status(503)
      .json({ success: false, message: "Admin access not configured on server" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.slice(7);
  if (token !== adminToken) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  next();
};
