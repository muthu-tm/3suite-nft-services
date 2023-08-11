"use strict";

import express from "express";
const router = express.Router();

import NFTController from "../lib/controllers/NFTController.js";

// passport session auth checker
import ensure_jwt_auth from "../lib/middleware/ensure_jwt_auth.js";
let ensureJWTAuth = ensure_jwt_auth();


router.post("/upload-file", async (request, response) => {
    const nftController = new NFTController(response);
    await nftController.uploadImageToIPFS(request);
});

router.post("/upload-metadata", async (request, response) => {
    const nftController = new NFTController(response);
    await nftController.uploadMetaToIPFS(request);
});

router.get("/all", async (request, response) => {
    const nftController = new NFTController(response);
    await nftController.getAllAssets(request);
});

router.get("/top", async (request, response) => {
    const nftController = new NFTController(response);
    await nftController.getTopAssets(request);
});

router.get("/", async (request, response) => {
    const nftController = new NFTController(response);
    await nftController.getAsset(request);
});

router.get("/created", ensureJWTAuth, async (request, response) => {
    const nftController = new NFTController(response);
    await nftController.getUserCreated(request);
});

router.get("/owned", ensureJWTAuth, async (request, response) => {
    const nftController = new NFTController(response);
    await nftController.getUserOwned(request);
});

router.get("/relevant", async (request, response) => {
    const nftController = new NFTController(response);
    await nftController.getRelevantAssets(request);
});

router.get("/activities", async (request, response) => {
    const nftController = new NFTController(response);
    await nftController.getAssetActivities(request);
});

export default router;