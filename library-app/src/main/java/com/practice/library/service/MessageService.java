package com.practice.library.service;


import com.practice.library.dao.MessageRepository;
import com.practice.library.entity.Message;
import com.practice.library.requestmodels.AdminQuestionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class MessageService {

    MessageRepository messageRepository;


    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void postMessage(Message message, String userEmail){

        Message message1 = new Message(message.getTitle(),message.getQuestion());
        message1.setUserEmail(userEmail);
        messageRepository.save(message1);

    }

    public void putMessage(AdminQuestionRequest adminQuestionRequest,String userEmail) throws Exception{

        Optional<Message> message = messageRepository.findById(adminQuestionRequest.getId());
        if(message.isEmpty()){

            throw  new Error("Message not Found");
        }
        message.get().setAdminEmail(userEmail);
        message.get().setResponse(adminQuestionRequest.getResponse());
        message.get().setClosed(true);

        messageRepository.save(message.get());
    }



}
