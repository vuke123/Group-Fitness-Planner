package hr.fer.progi.services.interfaces;

import hr.fer.progi.entity.UserEntity;
import hr.fer.progi.model.User;
import hr.fer.progi.repository.TrainingSessionRepository;
import hr.fer.progi.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Function;

public interface UserService {

    /**
     * method writes User object to MY SQL database
     * primary key in table relation [user] is [userName]
     * 
     * @param user represents refrence on object that needs to be stored database
     * @return user if user is stored in the database or null if user's [userName]
     *         was already stored in the database
     */
    User registerUser(User user);

    /**
     * method searches database for given username and checks does password stored
     * in database matches given password
     * 
     * @param username username to search
     * @param password password to match
     * @return user if provided correct username and password, null otherwise
     */
    User loginUser(String username, String password);

    boolean checkIfNeededUpdate(LocalDateTime last);

    List<UserEntity> listAll();
    List<UserEntity> listAllNonTrainers();

    UserEntity findById(String username);

    /**
     * Method is generic representation for simulating getters from database for specific user
     * example in driver code: 
     *  1. define getter in <code>UserEntitt<code> : <code>public String getEmail() {return this.email;}<code>
     *  2. use in driver code : <code> String userEmail = userService.findAtribute(username,  (UserEntity t) -> t.getEmail()); <code>
     * @param <T> type of returned value
     * 
     */

    default <T> T findAtribute(String username, Function<UserEntity, T> getter) {
        UserEntity entity = this.findById(username);
        return getter.apply(entity);
    }

    void update(UserEntity user);
    String newTrainer(User user);
    String updateUserPassword(String username, String current_password, String new_password);
    User updateGoals(String username, String goal1, String goal2);

    void setUserRepository(UserRepository userRepository);

}
