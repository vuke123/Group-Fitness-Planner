package hr.fer.progi.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "trainingtype")
public class TrainingTypeEntity {
    @Id
    @GeneratedValue
    private Long id;
    @Column(name = "trainingtype", nullable = false, unique=true)
    private String trainingType;

    public TrainingTypeEntity(String trainingType) {
        this.trainingType = trainingType;
    }

    public TrainingTypeEntity() {
    }
}