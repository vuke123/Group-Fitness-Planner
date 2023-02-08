package hr.fer.progi.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "goal")
public class GoalEntity {
    @Id
    @GeneratedValue
    private Long id;
    @Column(name = "goal", nullable = false, unique=true)
    private String goal;


}


