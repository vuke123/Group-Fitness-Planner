package hr.fer.progi.entity;

import hr.fer.progi.model.User;
import lombok.Data;
import org.springframework.beans.BeanUtils;

import javax.persistence.*;

@Entity
@Data
@Table(name = "userx")
public class UserEntity {
    private String firstName;
    private String lastName;
    @Id
    @Column(name = "username", nullable = false, unique=true)
    private String username;
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    private String password;
    private String role;
    private String goal1;
    private String goal2;
    private int remainingTrainingSessions;
    private int newGoal;

    public static UserEntity from(User user) {
        UserEntity userEntity = new UserEntity();
        BeanUtils.copyProperties(user, userEntity);
        return userEntity;
    }

    // public String getEmail() {return this.email;}
    // public String getUsername() {return this.username;}
    // public String getFirstname() {return this.firstName;}
    // public String getLastname() {return this.lastName;}
    // public String getRole() {return this.role;}

}
