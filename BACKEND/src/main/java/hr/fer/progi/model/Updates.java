package hr.fer.progi.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Updates {
    private String username;
    private LocalDateTime sessionsUpdate;
    private LocalDateTime goalsUpdate;
}


