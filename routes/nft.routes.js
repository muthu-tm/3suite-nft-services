"use strict";

import express from "express";
const router = express.Router();

import NFTController from "../lib/controllers/NFTController.js";

router.post("/upload-file", async (request, response) => {
    const nftController = new NFTController(response);
    await nftController.uploadImageToIPFS(request);
});

router.post("/upload-metadata", async (request, response) => {
    const nftController = new NFTController(response);
    await nftController.uploadMetaToIPFS(request);
});

export default router;