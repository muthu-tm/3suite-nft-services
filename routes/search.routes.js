"use strict";

import express from "express";
const router = express.Router();

import SearchController from "../lib/controllers/SearchController.js";

// router.get("/global", async (request, response) => {
//     const searchController = new SearchController(response);
//     await searchController.getAllInfo(request);
// });

router.get("/account", async (request, response) => {
    const searchController = new SearchController(response);
    await searchController.getAccountInfo(request);
});

router.get("/contract", async (request, response) => {
    const searchController = new SearchController(response);
    await searchController.getContractInfo(request);
});

router.get("/nft", async (request, response) => {
    const searchController = new SearchController(response);
    await searchController.getNFTInfo(request);
});

export default router;