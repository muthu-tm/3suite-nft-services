import express from "express";
const router = express.Router();

import user_routes from "./user.routes.js";
import app_routes from "./app.routes.js";
import nft_routes from "./nft.routes.js";

// passport session auth checker
import ensure_jwt_auth from "../lib/middleware/ensure_jwt_auth.js";
let ensureJWTAuth = ensure_jwt_auth();

router.use("/user", user_routes);
router.use("/app", app_routes);
router.use("/nft", ensureJWTAuth, nft_routes);

export default router;
