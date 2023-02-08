package hr.fer.progi.model;

/**
 * enum EmailContent serves for seeting up email content for repiting tasks 
 */

public enum EmailContent {

    

    TRAINER_ASSIGNED_EXERCISES("New exercises!", "Your trainer has assigned you exercises based on your goals. Check out your calendar to reserve training sessions.");

    public final String subject;
    public final String body;

    private EmailContent(String subject, String body) {
        this.subject = subject;
        this.body = body;
    }


}
