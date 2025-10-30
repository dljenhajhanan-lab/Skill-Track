import express from "express";
import { protect } from "../middleware/auth.js";
import { verifyCertificate, importByUrls, myCertificates, } from "../controllers/integrations/coursera.js";

const router = express.Router();

router.post("/verifyCertificate", protect, verifyCertificate);
router.post("/importByURLS", protect, importByUrls);
router.get("/myCertificates", protect, myCertificates);

export default router;
