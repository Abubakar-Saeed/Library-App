package com.practice.library.controller;

import com.practice.library.entity.Message;
import com.practice.library.requestmodels.AdminQuestionRequest;
import com.practice.library.service.MessageService;
import com.practice.library.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader(value = "Authorization") String token, @RequestBody Message message){

        String userEmail = ExtractJWT.payloadJWTExtraction(token,"em");
        System.out.println("Question: " + message.getQuestion());
        messageService.postMessage(message,userEmail);

    }
    @PutMapping("/secure/admin/message")

    public void putMessage(@RequestHeader(value = "Authorization")String token, @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception{

        String userEmail = ExtractJWT.payloadJWTExtraction(token,"em");
        String admin = ExtractJWT.payloadJWTExtraction(token,"userType");
        if(admin == null || !admin.equals("admin")){

            throw new Exception("Administration Page Only");
        }
        messageService.putMessage(adminQuestionRequest,userEmail);

    }




}
