package hr.fer.progi.services.classes;

import hr.fer.progi.additions.RequestDeniedException;
import hr.fer.progi.entity.ExerciseEntity;
import hr.fer.progi.entity.ExercisePerUserEntity;
import hr.fer.progi.entity.UserEntity;
import hr.fer.progi.repository.ExercisePerUserRepository;
import hr.fer.progi.repository.ExerciseRepository;
import hr.fer.progi.services.interfaces.ExerciseService;
import hr.fer.progi.services.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class ExerciseServiceImpl implements ExerciseService {
    @Autowired
    private ExerciseRepository exerciseRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private ExercisePerUserRepository exercisePerUserRepository;

    @Override
    public List<String> getAllExercises() {
        List<ExerciseEntity> exerciseEntities = exerciseRepository.findAll();
        return exerciseEntities.stream().map(ExerciseEntity::getExercise).collect(Collectors.toList());
    }


    @Override
    public List<HashMap<String, String>> getAllUsers() {
        List<UserEntity> userEntities = userService.listAllNonTrainers();
        List<HashMap<String, String>> users = new ArrayList<>();
        for (UserEntity u : userEntities) {
            Collection<ExercisePerUserEntity> exercises = exercisePerUserRepository.findAllByUsername(u.getUsername());
            int size = exercises.size();
            boolean hasExercises = size != 0;
            
            HashMap<String, String> userHelper = new HashMap<>();
            userHelper.put("username", u.getUsername());
            userHelper.put("firstName", u.getFirstName());
            userHelper.put("lastName", u.getLastName());
            userHelper.put("goal1", u.getGoal1());
            userHelper.put("goal2", u.getGoal2());
            userHelper.put("hasExercises", Boolean.toString(hasExercises));

            //UserHelper uh = new UserHelper(u.getUsername(), u.getFirstName(), u.getLastName(), goals, hasExercises );
            users.add(userHelper);
        }
        return users;
    }

    @Override
    public void addUserExercises(String username, List<String> exercises) {
        for (String e : exercises) {
            ExercisePerUserEntity exercisePerUserEntity = new ExercisePerUserEntity(username, e);
            exercisePerUserRepository.save(exercisePerUserEntity);
        }

    }

    @Override
    public boolean getPermission(String username) {
        Collection<ExercisePerUserEntity> exercisesPerUSer = exercisePerUserRepository.findAllByUsername(username);
        int size = exercisesPerUSer.size();
        if(size != 0)
            return true;
        else
            throw new RequestDeniedException("Trainer didn't add exercises for your profile.");

    }
}
