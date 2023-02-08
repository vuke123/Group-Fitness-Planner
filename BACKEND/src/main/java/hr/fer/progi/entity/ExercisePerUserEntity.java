package hr.fer.progi.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "epu")
public class ExercisePerUserEntity {
    @Id
    @GeneratedValue
    private Long id;

    private String username;
    private String exercise;

    public ExercisePerUserEntity(String username, String exercise) {
        this.username = username;
        this.exercise = exercise;
    }
    public ExercisePerUserEntity() {
    }
}