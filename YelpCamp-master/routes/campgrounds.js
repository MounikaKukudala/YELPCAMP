var express=require("express");
var router=express.Router();
var campground=require("../models/campground");
var middleware=require("../middleware");
var Review = require("../models/review");
var Comment = require("../models/comment");


router.get("/",function(req,res){
var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
    	campground.find({title: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              if(allCampgrounds.length < 1) {
                  noMatch = "No campgrounds match that query, please try again.";
              }
              res.render("campground/index",{campgrounds:allCampgrounds,page:"campgrounds", noMatch: noMatch});
           }
        });
    } else {
        // Get all campgrounds from DB
        campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              res.render("campground/index",{campgrounds:allCampgrounds,page:"campgrounds", noMatch: noMatch});
           }
        });
    }
});
router.post("/",middleware.isLoggedIn,function(req,res){
	
	var title=req.body.title;
	var url=req.body.image;
	var price=req.body.price;
	var description=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	};
	var newCampground={title:title,image:url,description:description,author:author,price:price};
	
	
	campground.create(newCampground,function(err,cg){
		if(err)
			console.log("error");
		else
		{
			req.flash("success","Successfully created campground");
			res.redirect("/campgrounds");
		}
	});
	
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campground/new",{page:"new"});
});

router.get("/:id",function(req,res){
	campground.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function(err,cg){
		if(err)
			console.log(err);
		else
			res.render("campground/show",{campground:cg,page:"show"});
	});
});


//EDIT campground
router.get("/:id/edit",middleware.checkCampgroundOwner,function(req,res){
	campground.findById(req.params.id,function(err,found){
				res.render("campground/edit",{campground:found,page:"found"});
	});
});

router.put("/:id",middleware.checkCampgroundOwner,function(req,res){
	delete req.body.cg.rating;
	campground.findByIdAndUpdate(req.params.id,req.body.cg,function(err,updated){
		if(err)
			res.redirect("/campgrounds");
		else
		{	
			req.flash("success","Successfully edited");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
})


//Destroy 

router.delete("/:id",middleware.checkCampgroundOwner,function(req,res){
	    campground.findById(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            // deletes all comments associated with the campground
            Comment.remove({"_id": {$in: campground.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/campgrounds");
                }
                // deletes all reviews associated with the campground
                Review.remove({"_id": {$in: campground.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                    //  delete the campground
                    campground.remove();
                    req.flash("success", "Campground deleted successfully!");
                    res.redirect("/campgrounds");
                });
            });
        }
    });
});
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports=router;