const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateSchema } = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listings.js");
const { route } = require("./user.js");



router.get("/filter/:id",wrapAsync(listingController.filter));
router.get("/search", wrapAsync(listingController.search));

router
  .route("/" )
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateSchema,
    upload.single("listing[image]") ,
    wrapAsync(listingController.createListing)
  );


// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]") ,
  validateSchema,
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateSchema,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
