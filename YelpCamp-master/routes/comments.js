var express=require("express");
var router=express.Router({mergeParams:true});
var campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");




//============Comment routing=================================
router.get("/new",middleware.isLoggedIn,function(req,res){
		campground.findById(req.params.id).populate("comments").exec(function(err,cg){
		if(err)
			console.log(err);
		else
			res.render("comment/new",{campground:cg,page:"newComment"});
		});
});

router.post("/",middleware.isLoggedIn,function(req,res){
	
campground.findById(req.params.id,function(err,cg){
	if(err)
		{
			console.log(err);
			res.redirect("/campgrounds");
		}
	else
		{
			Comment.create(req.body.comment,function(err,comment){
				if(err)
				{
					console.log(error);
				}
				else
				{
					//add username nd id
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					cg.comments.push(comment);
					cg.save();
					req.flash("success","Successfully created comment");
					res.redirect('/campgrounds/' + cg._id);
				}
			});
		}
});
});
//EDIT
router.get("/:com_id/edit",middleware.checkCommentOwner,function(req,res){
	Comment.findById(req.params.com_id,function(err,found){
		if(err)
			res.redirect("back");
		else
			res.render("comment/edit",{campground_id:req.params.id,comment:found,page:"editComment"});
	});
});
//UPDATE
router.put("/:com_id",middleware.checkCommentOwner,function(req,res){
	Comment.findByIdAndUpdate(req.params.com_id,req.body.comment,function(err,updated){
		if(err)
			res.redirect("back");
		else
		{
			req.flash("success","Successfully edited comment");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})
//DELETE

router.delete("/:com_id",middleware.checkCommentOwner,function(req,res){
	Comment.findByIdAndRemove(req.params.com_id,function(err){
		if(err)
			res.redirect("back");
		else
		{
			req.flash("success","Successfully deleted comment");
			res.redirect("/campgrounds/"+ req.params.id);
		}
	})
})


module.exports=router;