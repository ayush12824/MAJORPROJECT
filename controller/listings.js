const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing is not available!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// module.exports.createListing = async (req, res) => {
//   // let {title,description,image,price,country,location}=req.body;
//   let url = req.file.path;
//   let filename = req.file.filename;
//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;
//   newListing.image = { url, filename };
//   await newListing.save();
//   req.flash("success", "new item added");
//   res.redirect("/listings");
// };

module.exports.createListing = async (req, res) => {
  try {
    let url = "/images/default/default.jpg";
    let filename = "default";

    // ✅ Handle image safely
    if (req.file) {
      url = req.file.path;
      filename = req.file.filename;
    }

    const newListing = new Listing({
      ...req.body.listing,
      image: { url, filename },
    });

    // ✅ FIX: Save owner
    newListing.owner = req.user._id;

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing not available");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  // let { listing } = req.body;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "item deleted");
  res.redirect("/listings");
};
