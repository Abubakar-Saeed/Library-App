package com.practice.library.controller;


import com.practice.library.requestmodels.ReviewRequest;
import com.practice.library.service.ReviewService;
import com.practice.library.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }


    @PostMapping("/secure")
    public void postReview(@RequestHeader(value = "Authorization") String token, @RequestBody ReviewRequest reviewRequest)throws Exception{

        String userEmail = ExtractJWT.payloadJWTExtraction(token,"em");


        if(userEmail == null){

            throw new Exception("User Email is null");
        }
        reviewService.postReview(userEmail,reviewRequest);


    }
    @GetMapping("/secure/user/book")
    public boolean isUserAlreadyGiveReview(@RequestHeader(value = "Authorization")String token,@RequestParam Long bookId){
        String userEmail = ExtractJWT.payloadJWTExtraction(token,"em");

       return reviewService.userReviewListed(userEmail,bookId);


    }


}
