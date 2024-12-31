const { Router } = require("express");
const {
	getMenu,
	postMenu,
	getByIdMenu,
	putMenu,
	DeleteMenu,
} = require("../controllers/menu");

const router = Router();

router.get("/", getMenu);
router.post("/", postMenu);
router.get("/:id", getByIdMenu);
router.put("/:id", putMenu);
router.delete("/:id", DeleteMenu);

module.exports = router;
