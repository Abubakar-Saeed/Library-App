package com.practice.library.controller;


import com.practice.library.entity.Book;
import com.practice.library.responsemodel.ShelfCurrentLoansResponse;
import com.practice.library.service.BookService;
import com.practice.library.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("api/books")
public class BookController {


    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }


    @GetMapping("/secure/currentloans")
    public List<ShelfCurrentLoansResponse> currentLoans(@RequestHeader(value = "Authorization") String token) throws Exception {

        String userEmail = ExtractJWT.payloadJWTExtraction(token,"em");

       return bookService.currentLoans(userEmail);
    }
    @PutMapping("/secure/checkout")
    public Book  checkoutBook(@RequestHeader(value = "Authorization")String token,@RequestParam Long bookId) throws Exception{


        String userEmail = ExtractJWT.payloadJWTExtraction(token,"em");

        return bookService.checkoutBook(userEmail,bookId);

    }

    @GetMapping("/secure/ischeckedout/byuser")
    public boolean checkoutBookByUser(@RequestHeader(value = "Authorization")String token,@RequestParam Long bookId){
        String userEmail = ExtractJWT.payloadJWTExtraction(token,"em");


        return bookService.checkoutBookByUser(userEmail,bookId);
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount(@RequestHeader(value = "Authorization")String token){
        String userEmail = ExtractJWT.payloadJWTExtraction(token,"em");
        return bookService.currentLoansCount(userEmail);

    }


    @PutMapping("/secure/return")
    public void returnBook(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception{

        String userEmail = ExtractJWT.payloadJWTExtraction(token,"em");
        bookService.returnBook(userEmail,bookId);
    }

    @PutMapping("/secure/renew/loan")
    public void renewLoan(@RequestHeader(value = "Authorization")String token,@RequestParam Long bookId) throws Exception {

        String userEmail = ExtractJWT.payloadJWTExtraction(token,"em");

        bookService.renewLoan(userEmail,bookId);
    }

}
