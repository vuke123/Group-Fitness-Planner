package hr.fer.progi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private String role;
    private String goal1;
    private String goal2;
    private int remainingTrainingSessions;
    private int newGoal;
}
