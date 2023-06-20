import express from "express";
const router = express.Router();

import user_routes from "./user.routes.js";

router.use("/user", user_routes);

export default router;
