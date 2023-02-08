package hr.fer.progi.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "ept")
public class ExercisePerTypeEntity {
    @Id
    @GeneratedValue
    private Long id;
    private String trainingType;
    private String exercise;

    public ExercisePerTypeEntity(String trainingType, String exercise) {
        this.trainingType = trainingType;
        this.exercise = exercise;
    }
    public ExercisePerTypeEntity() {
    }
}
