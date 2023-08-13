"use strict";

import express from "express";
const router = express.Router();

// passport session auth checker
import  middleware_ensure_jwt_auth from "../lib/middleware/ensure_jwt_auth.js";
import UserAuthController from "../lib/controllers/UserAuthController.js";
import UserController from "../lib/controllers/UserController.js";

let ensure_jwt_auth = middleware_ensure_jwt_auth();

router.post("/verify/id", async function (request, response, next) {
  const authController = new UserAuthController(response);
  await authController.verifyUserID(request);
});

router.post("/verify", async function (request, response, next) {
  const authController = new UserAuthController(response);
  await authController.verify(request);
});

router.post("/register", async function (request, response, next) {
  const authController = new UserAuthController(response);
  await authController.register(request, response);
});

router.post("/login", async function (request, response, next) {
  const authController = new UserAuthController(response);
  await authController.login(request, next);
});

router.post("/token/refresh", async function (request, response, next) {
  const authController = new UserAuthController(response);
  await authController.refreshToken(request);
});

router.put("/", ensure_jwt_auth, async function (request, response, next) {
  const userController = new UserController(response);
  await userController.update(request);
});

router.get("/all", async (request, response) => {
  const userController = new UserController(response);
  await userController.getAllUsers(request);
});

router.get("/top", async (request, response) => {
  const userController = new UserController(response);
  await userController.getTopUsers(request);
});

router.get("/", async (request, response) => {
  const userController = new UserController(response);
  await userController.getUser(request);
});

router.get("/activities", ensure_jwt_auth, async (request, response) => {
  const userController = new UserController(response);
  await userController.getUserActivities(request);
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
