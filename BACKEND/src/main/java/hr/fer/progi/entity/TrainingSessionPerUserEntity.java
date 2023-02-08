package hr.fer.progi.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "tspu")
public class TrainingSessionPerUserEntity {
    @Id
    @GeneratedValue
    private Long id;
    private Long trainingSessionId;
    private String username;

    public TrainingSessionPerUserEntity(Long trainingSessionId, String username) {
        this.trainingSessionId = trainingSessionId;
        this.username = username;
    }
    public TrainingSessionPerUserEntity() {
    }
}
