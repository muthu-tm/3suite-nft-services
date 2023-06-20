"use strict";

import express from "express";
const router = express.Router();

// passport session auth checker
import  middleware_ensure_jwt_auth from "../lib/middleware/ensure_jwt_auth.js";
import UserAuthController from "../lib/controllers/UserAuthController.js";

let ensure_jwt_auth = middleware_ensure_jwt_auth();

router.post("/register", async function (request, response, next) {
  const authController = new UserAuthController(response);
  await authController.register(request);
});

router.post("/login", async function (request, response, next) {
  const authController = new UserAuthController(response);
  await authController.login(request);
});

router.post("/token/refresh", async function (request, response, next) {
  const authController = new UserAuthController(response);
  await authController.refreshToken(request);
});

router.post("/logout", ensure_jwt_auth, (request, response) => {
  request.session.destroy((err) => {
    if (err) {
      return response.json({ status: false });
    }
    return response.json({ status: true, message: "ok" });
  });
});

export default router;
