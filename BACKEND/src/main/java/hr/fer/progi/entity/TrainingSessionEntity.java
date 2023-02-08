package hr.fer.progi.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "trainingsession")
public class TrainingSessionEntity {
    @Id
    @GeneratedValue
    private Long id;
    @Column(name = "start", nullable = false, unique=true)
    private LocalDateTime start;
    private String trainingType;
    private String trainerFirstName;
    private String trainerLastName;
    private String trainerUsername;
    private Long places;
    private Long freePlaces;

    public TrainingSessionEntity(LocalDateTime start, String trainingType, String trainerFirstNAme, String trainerLastName, String trainerUsername, Long places, Long freePlaces) {
        this.start = start;
        this.trainingType = trainingType;
        this.trainerFirstName = trainerFirstNAme;
        this.trainerLastName = trainerLastName;
        this.trainerUsername = trainerUsername;
        this.places = places;
        this.freePlaces = freePlaces;
    }

    public TrainingSessionEntity() {
    }
}