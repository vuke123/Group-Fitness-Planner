package hr.fer.progi.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "updates")
public class UpdatesEntity {
    @Id
    @GeneratedValue
    private Long id;
    private String username;
    private LocalDateTime sessionsUpdate;
    private LocalDateTime goalsUpdate;
}




