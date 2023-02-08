package hr.fer.progi.controller;

import hr.fer.progi.services.interfaces.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin
@RestController
@RequestMapping("")
public class GoalController {
    @Autowired
    private GoalService goalService;

    @GetMapping("/goals")
    public ResponseEntity<List<String>> goals() {
        return ResponseEntity.ok()
                .body(goalService.getAllGoals());
    }


}
