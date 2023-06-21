import express from "express";
const router = express.Router();

import user_routes from "./user.routes.js";
import nft_routes from "./nft.routes.js";

// passport session auth checker
import ensureJWTAuth from "../lib/middleware/ensure_jwt_auth.js";
let ensureJWTAuth = ensureJWTAuth();

router.use("/user", user_routes);
router.use("/nft", ensureJWTAuth, nft_routes);

export default router;
