package hr.fer.progi.services.classes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import hr.fer.progi.model.EmailContent;
import hr.fer.progi.services.interfaces.EmailService;


@Service
public class EmailServiceImpl implements EmailService {
    private final static String SENDER = "fitnessplannerofficial@gmail.com";

    @Autowired
    private JavaMailSender emailSender;


    public void sendSimpleMessage(String to, EmailContent content) {
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom(SENDER); 
        message.setTo(to); 
        message.setSubject(content.subject); 
        message.setText(content.body);

        System.out.println("Sending...");
        emailSender.send(message);
        System.out.println("mail sent successfully");
    }
}