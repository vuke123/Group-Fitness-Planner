package hr.fer.progi.services.interfaces;

import hr.fer.progi.model.EmailContent;

public interface EmailService {
    /**
     * Method sends simple email message to user, simple email is consider to have subject and body
     * when using email service we first need to enable gmail on chrome and set password provided to us in application properties :
     *      folow next link: https://www.youtube.com/watch?v=ugIUObNHZdo&ab_channel=CodeWithArjun
     * @param to email adress to which method is sending email
     * @param content represents information about the email (subject and body to be specific)
     */
    public void sendSimpleMessage(String to, EmailContent content);
}
