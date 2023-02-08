package hr.fer.testing.util;

import hr.fer.progi.entity.TrainingSessionEntity;
import hr.fer.progi.model.User;

import java.time.LocalDateTime;

public class TrainingGeneratingUtil {
    public static TrainingSessionEntity createMockSession() {
        TrainingSessionEntity sessionEntity = new TrainingSessionEntity();

        sessionEntity.setId(Long.valueOf(1));
        sessionEntity.setPlaces(Long.valueOf(30));
        sessionEntity.setStart(LocalDateTime.now());
        sessionEntity.setTrainingType("Cardio");
        sessionEntity.setFreePlaces(Long.valueOf(30));
        sessionEntity.setTrainerFirstName("Jure");
        sessionEntity.setTrainerLastName("Jure");
        sessionEntity.setTrainerUsername("jurejure");

        return sessionEntity;
    }
}
