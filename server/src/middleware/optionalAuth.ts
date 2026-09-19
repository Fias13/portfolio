import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      req.user = verifyToken(header.slice("Bearer ".length));
    } catch {
      // ignore invalid token on public routes
    }
  }
  next();
}
