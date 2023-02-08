package hr.fer.progi.controller;

import hr.fer.progi.entity.UserEntity;
import hr.fer.progi.model.EmailContent;
import hr.fer.progi.services.interfaces.EmailService;
import hr.fer.progi.services.interfaces.ExerciseService;
import hr.fer.progi.services.interfaces.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("")
public class ExerciseController {
    @Autowired
    private ExerciseService exerciseService;

    @GetMapping("/exercises")
    public ResponseEntity<List<String>> exercises() {
        return ResponseEntity.ok()
                .body(exerciseService.getAllExercises());
    }

    @GetMapping("/users")
    public ResponseEntity<List<HashMap<String,String>>> users(){
        return ResponseEntity.ok().body(exerciseService.getAllUsers());
    }

    @Autowired
    private EmailService emailService;
    @Autowired
    private UserService userService;

    @PostMapping("/save-exercises")
    public ResponseEntity<String> saveExercises(@RequestParam("username") String username, @RequestParam("exercises") List<String> exercises) {
        exerciseService.addUserExercises(username, exercises);
        /* after user got exercises from trainer we want to notify user by sending him simple email */
        String userEmail = userService.findAtribute(username,  (UserEntity t) -> t.getEmail());
        System.out.println("trying to send email to :" + userEmail);
        emailService.sendSimpleMessage(userEmail, EmailContent.TRAINER_ASSIGNED_EXERCISES);
        return ResponseEntity.ok().body("Saved " + Integer.toString(exercises.size()));
    }

    @GetMapping("/calendar-permission")
    public ResponseEntity<String> calendarPermission(@RequestParam("username") String username){
        boolean result = exerciseService.getPermission(username);
        return ResponseEntity.ok().body("success");

    }

    /**
     * methods returns list of subsets of user atributes [{'usernaem, firstanem, lastnaem, role'}, {...}, ...] 
     * user can be trainer or exerciser
     */
    @GetMapping("/allusers")
    public ResponseEntity<List<HashMap<String, String>>> allusers(){
        var list = userService.listAll().stream()
        .map((entity) -> {
            HashMap<String, String> map = new HashMap<>();
            map.put("username", entity.getUsername());
            map.put("firstname", entity.getFirstName());
            map.put("lastname", entity.getLastName());
            map.put("role", entity.getRole());
            return map;
        }).collect(Collectors.toList());
        System.out.println(list);
        return ResponseEntity.ok().body(list);
    }
}