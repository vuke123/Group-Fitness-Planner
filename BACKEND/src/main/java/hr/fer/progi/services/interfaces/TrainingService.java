package hr.fer.progi.services.interfaces;

import hr.fer.progi.entity.TrainingSessionEntity;
import hr.fer.progi.repository.TrainingSessionRepository;

import java.util.List;

public interface TrainingService {

    List<String> getAllTrainingTypes();
    List<TrainingSessionEntity> getAllSessions();

    List<TrainingSessionEntity> getAllNonReservedSessions(String username);
    List<TrainingSessionEntity> getAllReservedSessions(String username);

    void saveReservationPerUSer(String username, Long id);
    void deleteReservationPerUSer(String username, Long id);

    void createTrainingSession(TrainingSessionEntity trainingSessionEntity);

    void setTrainingSessionRepository(TrainingSessionRepository trainingSessionRepository);

}
