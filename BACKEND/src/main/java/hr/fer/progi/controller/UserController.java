package hr.fer.progi.controller;

import hr.fer.progi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import hr.fer.progi.model.User;
import hr.fer.progi.services.interfaces.UserService;


@CrossOrigin
@RestController
@RequestMapping("")
public class UserController {

    @Autowired
    private UserService userService;

    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/registration")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        return ResponseEntity.ok()
                .body(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestParam("username") String username, @RequestParam("password") String password) {
        User u = userService.loginUser(username, password);
        return ResponseEntity.ok()
                .body(u);
    }

    @PostMapping("/new-trainer")
    public ResponseEntity<String> newTrainer(@RequestBody User user) {
        return ResponseEntity.ok()
                .body(userService.newTrainer(user));
    }

    @PostMapping("/change_password")
    public ResponseEntity<String> updateUserPassword(@RequestParam("username") String username, @RequestParam("current_password") String current_password,
                                                     @RequestParam("new_password") String new_password) {
        return ResponseEntity.ok().body(userService.updateUserPassword(username, current_password, new_password));
    }

    @PostMapping("/change_goals")
    public ResponseEntity<User> updateGoals(@RequestParam("username") String username, @RequestParam("goal1") String goal1,
                                            @RequestParam("goal2") String goal2) {
        return ResponseEntity.ok().body(userService.updateGoals(username, goal1, goal2));
    }
}
