package hr.fer.testing.util;


import hr.fer.progi.model.User;

public class UserGeneratingUtil {

    public static User createMockUSer() {
        User user = new User();

        user.setEmail("jurejure@gmail.com");
        user.setFirstName("Jure");
        user.setGoal1("");
        user.setGoal2("");
        user.setLastName("Jure");
        user.setNewGoal(0);
        user.setPassword("1234aZ");
        user.setRole("trainer");
        user.setRemainingTrainingSessions(0);
        user.setUsername("jurejure");

        return user;
    }

}
