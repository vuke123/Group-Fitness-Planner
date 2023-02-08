package hr.fer.testing.service;

import hr.fer.progi.additions.RequestDeniedException;
import hr.fer.progi.entity.TrainingSessionEntity;
import hr.fer.progi.entity.UserEntity;
import hr.fer.progi.model.User;
import hr.fer.progi.repository.TrainingSessionRepository;
import hr.fer.progi.repository.UserRepository;
import hr.fer.progi.services.classes.TrainingServiceImpl;
import hr.fer.progi.services.classes.UserServiceImpl;
import hr.fer.progi.services.interfaces.TrainingService;
import hr.fer.progi.services.interfaces.UserService;
import hr.fer.testing.util.TrainingGeneratingUtil;
import hr.fer.testing.util.UserGeneratingUtil;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.runner.RunWith;

import java.util.List;

import static org.mockito.Mockito.*;

import hr.fer.progi.entity.TrainingSessionEntity;
import hr.fer.progi.repository.TrainingSessionRepository;
import hr.fer.progi.repository.TrainingTypeRepository;
import hr.fer.progi.services.classes.TrainingServiceImpl;
import hr.fer.progi.services.interfaces.TrainingService;
import hr.fer.testing.util.TrainingGeneratingUtil;
import org.junit.*;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.runner.RunWith;
import static org.junit.Assert.assertThrows;

import java.util.List;
import java.util.Optional;

import org.junit.Before;
import org.junit.Test;

import static org.mockito.Mockito.*;



@RunWith(MockitoJUnitRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class UserServiceTest {
    private UserService userService;

    @Mock
    private UserRepository userRepository;



    @Before
    public void setup(){
        this.userService = new UserServiceImpl();
        userService.setUserRepository(userRepository);
    }

    @Test
    public void testListingAllNonTrainers(){
        User mockUSer = UserGeneratingUtil.createMockUSer();
        UserEntity mockUserEntity = UserEntity.from(mockUSer);
        when(userRepository.findAll()).thenReturn(List.of(mockUserEntity));
        List<UserEntity> found = userService.listAllNonTrainers();
        verify(userRepository, times(1)).findAll();
        Assert.assertEquals(found.size(), 0);  //because mockUser's role is trainer
    }
    @Test
    public void testAddingNewTrainerUnsuccessfully(){
        User mockUser = UserGeneratingUtil.createMockUSer();
        UserEntity mockUserEntity = UserEntity.from(mockUser);

        when(userRepository.findById(mockUser.getUsername())).thenReturn(Optional.of(mockUserEntity));  //Already exists
        when(userRepository.countByEmail(mockUser.getEmail())).thenReturn(0);

        assertThrows(RequestDeniedException.class, () -> userService.newTrainer(mockUser));
        verify(userRepository, times(1)).findById(mockUser.getUsername());
        verify(userRepository, times(1)).countByEmail(mockUser.getEmail());
    }
    @Test
    public void testFindingUserByIdUnsuccessfully(){
        User mockUSer = UserGeneratingUtil.createMockUSer();
        UserEntity mockUserEntity = UserEntity.from(mockUSer);
        String mockUsername = "stella";

        when(userRepository.findById(mockUsername)).thenReturn(Optional.empty());
        UserEntity found = userService.findById(mockUsername);

        verify(userRepository, times(1)).findById(mockUsername);
        Assert.assertEquals(found, null);  //because mockUser's role is trainer
    }

}
