package hr.fer.progi.services.interfaces;

import java.util.HashMap;
import java.util.List;

public interface ExerciseService {
    List<String> getAllExercises();
    List<HashMap<String ,String>> getAllUsers();

    void addUserExercises(String username, List<String> exercises);

    boolean getPermission(String username);
}
