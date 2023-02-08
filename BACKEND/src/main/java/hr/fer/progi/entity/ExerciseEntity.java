package hr.fer.progi.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "exercise")
public class ExerciseEntity {
    @Id
    @GeneratedValue
    private Long id;
    @Column(name = "exercise", nullable = false, unique=true)
    private String exercise;

    public ExerciseEntity() {
    }
}

