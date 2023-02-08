package hr.fer.progi.services.classes;

import hr.fer.progi.entity.GoalEntity;
import hr.fer.progi.repository.GoalRepository;
import hr.fer.progi.services.interfaces.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalServiceImpl implements GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Override
    public List<String> getAllGoals() {
        List<GoalEntity> goalEntities = goalRepository.findAll();
        return goalEntities.stream().map(GoalEntity::getGoal).collect(Collectors.toList());
    }
}
