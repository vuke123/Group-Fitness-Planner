package hr.fer.progi.services.classes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import hr.fer.progi.additions.RequestDeniedException;
import hr.fer.progi.entity.ExercisePerUserEntity;
import hr.fer.progi.entity.UpdatesEntity;
import hr.fer.progi.model.Updates;
import hr.fer.progi.repository.ExercisePerUserRepository;
import hr.fer.progi.repository.TrainingSessionRepository;
import hr.fer.progi.repository.UpdatesRepository;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import hr.fer.progi.entity.UserEntity;
import hr.fer.progi.model.User;
import hr.fer.progi.repository.UserRepository;
import hr.fer.progi.services.interfaces.UserService;
import org.springframework.util.Assert;


@Service
public class UserServiceImpl implements UserService {

    @Autowired

    private UserRepository userRepository;

    @Autowired
    private UpdatesRepository updateRepository;

    @Autowired
    private ExercisePerUserRepository exercisePerUserRepository;


    private static final String PASSWORD_FORMAT="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{6,15}$";

    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public String updateUserPassword(String username, String current_password, String new_password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        UserEntity userEntity = userRepository.findById(username).get();

        if (!encoder.matches(current_password, userEntity.getPassword()))
            throw new RequestDeniedException( "Incorect password!");
        Assert.isTrue(new_password.matches(PASSWORD_FORMAT), "New password must have at least lowercase letter [a,z], one uppercase letter [A,Z], one digit [0,9] and 6-15 characters");
        userEntity.setPassword(encoder.encode(new_password));
        userRepository.save(userEntity);

        return "success";
    }

    @Override
    public User updateGoals(String username, String goal1, String goal2) {
        UserEntity userEntity = userRepository.findById(username).get();
        userEntity.setGoal1(goal1);
        userEntity.setGoal2(goal2);
        userEntity.setNewGoal(0);
        userRepository.save(userEntity);

        UpdatesEntity updatesEntity = updateRepository.findByUsername(username).get();
        updatesEntity.setGoalsUpdate(LocalDateTime.now());
        updateRepository.save(updatesEntity);

        Collection<ExercisePerUserEntity> forDelete = exercisePerUserRepository.findAllByUsername(username);
        for(ExercisePerUserEntity e : forDelete){
            exercisePerUserRepository.delete(e);
        }

        User user = new User();
        BeanUtils.copyProperties(userEntity, user);
        return user;
    }
    @Override
    public User registerUser(User user) {
        Assert.hasText(user.getFirstName(),"Firstname must not be empty.");
        Assert.isTrue(user.getFirstName().matches("[a-zA-z]+"), "Firstname must contain only alphabetic symbols.");
        Assert.hasText(user.getLastName(),"Lastname must not be empty");
        Assert.isTrue(user.getLastName().matches("[a-zA-z]+"), "Lastname must contain only alphabetic symbols.");
        Assert.hasText(user.getUsername(),"Username must not be empty");
        Assert.isTrue(EmailValidator.getInstance().isValid(user.getEmail()),"Email is not valid.");
        Assert.hasText(user.getGoal1(),"First goal has to be chosen.");
        Assert.isTrue(user.getPassword().matches(PASSWORD_FORMAT), "Password must have at least lowercase letter [a,z], one uppercase letter [A,Z], one digit [0,9] and 6-15 characters");
        boolean usernameTaken = userRepository.findById(user.getUsername()).isPresent();
        int emailTaken = userRepository.countByEmail(user.getEmail());
        if (usernameTaken)
            throw new RequestDeniedException(
                    "Username: " + user.getUsername() + " is already taken."
            );
        else if(emailTaken>0)
            throw new RequestDeniedException(
                    "Account with email: " + user.getEmail() + " already exists."
            );
        user.setRole("user"); //we are forcing this role
        UserEntity userEntity = new UserEntity();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encoded =passwordEncoder.encode(user.getPassword());
        user.setPassword(encoded);
        BeanUtils.copyProperties(user, userEntity);
        userRepository.save(userEntity);
        UpdatesEntity updatesEntity = new UpdatesEntity();
        Updates updates = new Updates(
                userEntity.getUsername(),
                LocalDateTime.now(),
                LocalDateTime.now()
        );
        BeanUtils.copyProperties(updates, updatesEntity);
        updateRepository.save(updatesEntity);
        user.setPassword("");
        return user;
    }

    @Override
    public User loginUser(String username, String password) {
        Optional<UserEntity> optionalUser = userRepository.findById(username);
        Assert.hasText(username,"Username must not be empty");
        if(optionalUser.isEmpty())
            throw new UsernameNotFoundException(
                    "There is no user with that username."
            );
        UserEntity userEntity = optionalUser.get();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(password, userEntity.getPassword()))
            throw new RequestDeniedException(
                    "Wrong password!"
            );

        if(userEntity.getRole().equals("user")) {
            Optional<UpdatesEntity> optUpdates = updateRepository.findByUsername(userEntity.getUsername());
            UpdatesEntity updatesEntity = optUpdates.get();
            LocalDateTime lastSessionUpdate = updatesEntity.getSessionsUpdate();
            LocalDateTime lastGoalsUpdate = updatesEntity.getGoalsUpdate();

            if (checkIfNeededUpdate(lastSessionUpdate)) {
                updatesEntity.setSessionsUpdate(LocalDateTime.now());
                userEntity.setRemainingTrainingSessions(20);
            }
            if (checkIfNeededUpdate(lastGoalsUpdate)) {
                updatesEntity.setGoalsUpdate(LocalDateTime.now());
                userEntity.setNewGoal(1);
            }
            userRepository.save(userEntity);   //save function updates in db if there is already that primary key
            updateRepository.save(updatesEntity);
        }
        return new User(userEntity.getFirstName(),
                        userEntity.getLastName(),
                        userEntity.getUsername(),
                        userEntity.getEmail(),
                        "",   //frontend doesn't need password
                        userEntity.getRole(),
                        userEntity.getGoal1(),
                        userEntity.getGoal2(),
                        userEntity.getRemainingTrainingSessions(),
                        userEntity.getNewGoal()
        );
    }

    @Override
    public boolean checkIfNeededUpdate(LocalDateTime last){
        LocalDateTime now = LocalDateTime.now();
        int currentYear = now.getYear();
        int currentMonth = now.getMonthValue();
        LocalDateTime beginningOfThisMonth = LocalDateTime.of(currentYear,currentMonth,1,0,0,0);
        return last.isBefore(beginningOfThisMonth);
    }

    @Override
    public List<UserEntity> listAll() {
        return userRepository.findAll();
    }

    @Override
    public List<UserEntity> listAllNonTrainers() {
        List<UserEntity> users = listAll();
        List<UserEntity> nonTrainers = new ArrayList<>();
        for(UserEntity u : users){
            if(u.getRole().equals("user"))
                nonTrainers.add(u);
        }
        return nonTrainers;
    }

    @Override
    public UserEntity findById(String username) {
        Optional<UserEntity> optionalUser = userRepository.findById(username);
        return optionalUser.orElse(null);
    }

    @Override
    public void update(UserEntity user) {
        userRepository.save(user);
    }

    @Override
    public String newTrainer(User user) {
        Assert.hasText(user.getFirstName(),"Firstname must not be empty.");
        Assert.isTrue(user.getFirstName().matches("[a-zA-z]+"), "Firstname must contain only alphabetic symbols.");
        Assert.hasText(user.getLastName(),"Lastname must not be empty");
        Assert.isTrue(user.getLastName().matches("[a-zA-z]+"), "Lastname must contain only alphabetic symbols.");
        Assert.hasText(user.getUsername(),"Username must not be empty");
        Assert.isTrue(EmailValidator.getInstance().isValid(user.getEmail()),"Email is not valid.");
        Assert.isTrue(user.getPassword().matches(PASSWORD_FORMAT), "Password must have at least lowercase letter [a,z], one uppercase letter [A,Z], one digit [0,9] and 6-15 characters");
        boolean usernameTaken = userRepository.findById(user.getUsername()).isPresent();
        int emailTaken = userRepository.countByEmail(user.getEmail());
        if (usernameTaken)
            throw new RequestDeniedException(
                    "Username: " + user.getUsername() + " is already taken."
            );
        else if(emailTaken>0)
            throw new RequestDeniedException(
                    "Account with email: " + user.getEmail() + " already exists."
            );
        user.setRole("trainer");
        UserEntity userEntity = new UserEntity();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encoded =passwordEncoder.encode(user.getPassword());
        user.setPassword(encoded);
        BeanUtils.copyProperties(user, userEntity);
        userRepository.save(userEntity);
        return "success";

    }
}
