import { Router } from "express";
import auth from "./auth";
import notes from "./notes"

const router = Router({
  mergeParams: true,
});
router.use("/auth", auth);
router.use("/notes",notes)

export default router;
