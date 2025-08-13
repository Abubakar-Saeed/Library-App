package com.practice.library.service;


import com.practice.library.dao.BookRepository;
import com.practice.library.dao.ReviewRepository;
import com.practice.library.entity.Review;
import com.practice.library.requestmodels.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Objects;

@Service
@Transactional
public class ReviewService {


   private BookRepository bookRepository;
   private final ReviewRepository reviewRepository;

   @Autowired
    public ReviewService(BookRepository bookRepository, ReviewRepository reviewRepository) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
    }


    public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception{


       Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail,reviewRequest.getBookId());

       if(validateReview != null){

           throw new Exception("Review already given");

       }
       Review review = new Review();

       review.setBookId(reviewRequest.getBookId());
       review.setRating(reviewRequest.getRating());
       if (reviewRequest.getReviewDescription().isPresent()){

           review.setReviewDescription(reviewRequest.getReviewDescription().map(
                   Objects::toString
           ).orElse(null));

       }
       review.setUserEmail(userEmail);
       review.setDate(String.valueOf(Date.valueOf(LocalDate.now())));

       reviewRepository.save(review);

    }

    public boolean userReviewListed(String userEmail,Long bookId){


       return reviewRepository.existsByUserEmailAndBookId(userEmail,bookId);


    }


}
