package hr.fer.progi.controller;

import hr.fer.progi.entity.TrainingSessionEntity;
import hr.fer.progi.services.interfaces.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("")
public class TrainingController {

    @Autowired
    private TrainingService trainingService;

    @GetMapping("/training-types")
    public ResponseEntity<List<String>> trainingTypes(){
        return ResponseEntity.ok()
                .body(trainingService.getAllTrainingTypes());
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<TrainingSessionEntity>> sessions() {
        return ResponseEntity.ok()
                .body(trainingService.getAllSessions());
    }

    @GetMapping("/non-reserved-sessions-per-user")
    public ResponseEntity<List<TrainingSessionEntity>> sessionsPerUser(@RequestParam("username") String username){
        return ResponseEntity.ok()
                .body(trainingService.getAllNonReservedSessions(username));
    }

    @GetMapping("/reserved-sessions-per-user")
    public ResponseEntity<List<TrainingSessionEntity>> nonReserved(@RequestParam("username") String username){
        return ResponseEntity.ok()
                .body(trainingService.getAllReservedSessions(username));
    }

    @PostMapping("/save-reservation")
    public ResponseEntity<String> saveReservation(@RequestParam("username") String username,@RequestParam("id") Long id) {
        trainingService.saveReservationPerUSer(username,id);
        return ResponseEntity.ok().body("success");
    }
    @PostMapping("/delete-reservation")
    public ResponseEntity<String> deleteReservation(@RequestParam("username") String username,@RequestParam("id") Long id) {
        trainingService.deleteReservationPerUSer(username,id);
        return ResponseEntity.ok().body("success");
    }
    @PostMapping("/create-training-session")
    public ResponseEntity<String> createSession(@RequestBody TrainingSessionEntity trainingSessionEntity) {
        trainingService.createTrainingSession(trainingSessionEntity);
        return ResponseEntity.ok().body("success");
    }



}
