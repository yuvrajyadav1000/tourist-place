var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware");
// =======================================
//COMMENTS ROUTES
// =======================================

//Comments new
router.get("/new", middleware.isLoggedIn, function(req,res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground: campground});
        }
    }) 
});

//comments create
router.post("/",middleware.isLoggedIn, function(req,res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            console.log(req.body.comment);
            Comment.create(req.body.comment,function(err, comment){
                if(err){
                    req.flash("error","Something went wrong");
                    console.log(err);
                }else{
                    //Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    // /campground/:id
                    req.flash("success","Successfully added comment");
                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
});

//Edit comment
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
        }
    });
});

//Update comment
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// Comments Destroy

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//middleware




module.exports = router;