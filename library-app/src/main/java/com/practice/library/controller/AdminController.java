package com.practice.library.controller;

import com.practice.library.requestmodels.AddBookRequest;
import com.practice.library.service.AdminService;
import com.practice.library.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("api/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/secure/add/book")
    public void postMapping(@RequestHeader(value = "Authorization")String token, @RequestBody AddBookRequest addBookRequest) throws Exception{

        String admin = ExtractJWT.payloadJWTExtraction(token,"userType");
        if(admin == null || !admin.equals("admin")){

            throw new Exception("Administration only");
        }

        adminService.postBook(addBookRequest);

    }

    @PutMapping("/secure/increase/book/quantity")
    public void increaseBookQuantity(@RequestHeader(value = "Authorization")String token, @RequestParam Long bookId) throws Exception{


        String admin = ExtractJWT.payloadJWTExtraction(token,"userType");

        if(admin==null || !admin.equals("admin")){

            throw new Error("Administration Only");
        }

        adminService.increaseBookQuantity(bookId);
    }
    @PutMapping("/secure/decrease/book/quantity")
    public void decreaseBookQuantity(@RequestHeader(value = "Authorization")String token, @RequestParam Long bookId) throws Exception{


        String admin = ExtractJWT.payloadJWTExtraction(token,"userType");

        if(admin==null || !admin.equals("admin")){

            throw new Error("Administration Only");
        }

        adminService.decreaseBookQuantity(bookId);
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestHeader(value = "Authorization") String token,@RequestParam Long bookId) throws Exception{

        String admin = ExtractJWT.payloadJWTExtraction(token,"userType");


        if(admin == null || !admin.equals("admin")){

            throw new Error("Required Administration");
        }

        adminService.delete(bookId);

    }
}
