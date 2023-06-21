"use strict";

import express from "express";
const router = express.Router();

import NFTController from "../lib/controllers/NFTController";

router.post("/", async (request, response) => {
    const nftController = new NFTController(response);
    await nftController.uploadToIPFS(request);
});

export default router;