package hr.fer.testing.service;

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

import java.util.List;
import org.junit.Before;
import org.junit.Test;

import static org.mockito.Mockito.*;


@RunWith(MockitoJUnitRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class TrainingServiceTest {
    private TrainingService trainingService;

    @Mock
    private TrainingSessionRepository trainingSessionRepository;



    @Before
    public void setup(){
        this.trainingService = new TrainingServiceImpl();
        trainingService.setTrainingSessionRepository(trainingSessionRepository);
    }

    @Test
    public void testGetAllSessions(){
        TrainingSessionEntity mockTs = TrainingGeneratingUtil.createMockSession();

        when(trainingSessionRepository.findAll()).thenReturn(List.of(mockTs));
        List<TrainingSessionEntity> found = trainingService.getAllSessions();

        verify(trainingSessionRepository, times(1)).findAll();

        Assert.assertEquals(found.size(), 1);
    }

}
