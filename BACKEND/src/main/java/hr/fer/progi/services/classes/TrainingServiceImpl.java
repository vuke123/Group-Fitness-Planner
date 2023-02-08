package hr.fer.progi.services.classes;

import hr.fer.progi.additions.RequestDeniedException;
import hr.fer.progi.entity.*;
import hr.fer.progi.repository.*;
import hr.fer.progi.services.interfaces.TrainingService;
import hr.fer.progi.services.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class TrainingServiceImpl implements TrainingService {
    @Autowired
    private ExercisePerTypeRepository exercisePerTypeRepository;
    @Autowired
    private TrainingSessionRepository trainingSessionRepository;

    @Autowired
    private TrainingTypeRepository trainingTypeRepository;
    @Autowired
    private TrainingSessionPerUserRepository trainingSessionPerUserRepository;
    @Autowired
    private ExercisePerUserRepository exercisePerUserRepository;
    @Autowired
    private UserService userService;

    public void setTrainingSessionRepository(TrainingSessionRepository trainingSessionRepository) {
        this.trainingSessionRepository = trainingSessionRepository;
    }



    @Override
    public List<String> getAllTrainingTypes() {
      List<TrainingTypeEntity> tt=  trainingTypeRepository.findAll();
      List<String> trainingTypes = new ArrayList<>();
      for(TrainingTypeEntity t :tt)
          trainingTypes.add(t.getTrainingType());

      return trainingTypes;
    }

    @Override
    public List<TrainingSessionEntity> getAllSessions() {
        return trainingSessionRepository.findAll();
    }

    @Override
    public List<TrainingSessionEntity> getAllNonReservedSessions(String username) {
        List<TrainingSessionEntity> nonReserved = nonReservedSessions(username);
        Collection<ExercisePerUserEntity> exercises = exercisePerUserRepository.findAllByUsername(username);
        List<TrainingSessionEntity> possibleToReserve = new ArrayList<>();
        for(TrainingSessionEntity tspu: nonReserved){
            List<String> exercisePerType = (exercisePerTypeRepository.findAllByType(tspu.getTrainingType())).stream().map(ExercisePerTypeEntity::getExercise).collect(Collectors.toList());
            int counter = 0;
            for(ExercisePerUserEntity eps : exercises){
                if(exercisePerType.contains(eps.getExercise()))
                    counter++;
            }
            if(counter>=2)
                possibleToReserve.add(tspu);
        }
        return possibleToReserve;

    }

    @Override
    public List<TrainingSessionEntity> getAllReservedSessions(String username) {
        return reservedSessions(username);
    }

    @Override
    public void saveReservationPerUSer(String username, Long id) {
        TrainingSessionPerUserEntity trainingSessionPerUserEntity = new TrainingSessionPerUserEntity(id, username);
        TrainingSessionEntity session = trainingSessionRepository.findById(id).get();
        UserEntity user = userService.findById(username);
        if(user.getRemainingTrainingSessions()==0)
            throw new RequestDeniedException("You can't reserve because you already made 25 reservations this month.");
        else if(session.getFreePlaces()==0)
            throw new RequestDeniedException("This training session is already full.");
        List<TrainingSessionEntity> reservedSessions= reservedSessions(username);
        int year = session.getStart().getYear();
        int week = session.getStart().get(WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear());
        if(session.getTrainingType().contains("Intensive")){
            boolean alreadyReservedIntensive = false;
            List<TrainingSessionEntity> intensive = new ArrayList<>();
            for(TrainingSessionEntity ts: reservedSessions)
                if(ts.getTrainingType().contains("Intensive"))
                    intensive.add(ts);
            for(TrainingSessionEntity ts: intensive){
                int ts_year = ts.getStart().getYear();
                int ts_week = ts.getStart().get(WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear());
                if(ts_year==year && ts_week==week){
                    alreadyReservedIntensive = true;
                    break;
                }
            }
            if(alreadyReservedIntensive)
                throw new RequestDeniedException("You have already reserved Intensive training session this week.");
        }
        List<TrainingSessionEntity> thisWeek = new ArrayList<>();
        List<TrainingSessionEntity> thisDay = new ArrayList<>();
        LocalDate sessionStartDate = session.getStart().toLocalDate();
        for(TrainingSessionEntity ts: reservedSessions) {
            int ts_year = ts.getStart().getYear();
            int ts_week = ts.getStart().get(WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear());
            LocalDate tsStartDate = ts.getStart().toLocalDate();
            if(sessionStartDate.isEqual(tsStartDate))
                thisDay.add(ts);
            if (ts_year == year && ts_week == week)
                thisWeek.add(ts);
        }
        if(thisDay.size()==2)
            throw new RequestDeniedException("You have already reserved 2 training sessions for this day. That is maximum");
        if(thisWeek.size()==5)
            throw new RequestDeniedException("You have already reserved 5 training sessions this week. That is maximum");
        trainingSessionPerUserRepository.save(trainingSessionPerUserEntity);
        session.setFreePlaces(session.getFreePlaces() - 1);
        trainingSessionRepository.save(session);
        user.setRemainingTrainingSessions(user.getRemainingTrainingSessions()-1);
        userService.update(user);

    }

    @Override
    public void deleteReservationPerUSer(String username, Long id) {
        Collection<TrainingSessionPerUserEntity> tspus = trainingSessionPerUserRepository.findAllByUsername(username);
        TrainingSessionPerUserEntity tsup = new TrainingSessionPerUserEntity() ;
        UserEntity user = userService.findById(username);
        for(TrainingSessionPerUserEntity t : tspus){
            if(Objects.equals(t.getTrainingSessionId(), id)) {
                tsup = t;
                break;
            }
        }
        user.setRemainingTrainingSessions(user.getRemainingTrainingSessions()+1);
        userService.update(user);
        TrainingSessionEntity session = trainingSessionRepository.findById(id).get();
        session.setFreePlaces(session.getFreePlaces() + 1);
        trainingSessionRepository.save(session);
        trainingSessionPerUserRepository.delete(tsup);

    }

    @Override
    public void createTrainingSession(TrainingSessionEntity trainingSessionEntity) {
        List<TrainingSessionEntity> sessionEntities = getAllSessions();
        List<TrainingSessionEntity> sessionsOnSameDay = new ArrayList<>();
        for(TrainingSessionEntity ts : sessionEntities)
            if(ts.getStart().toLocalDate().isEqual(trainingSessionEntity.getStart().toLocalDate()))
                sessionsOnSameDay.add(ts);
        for(TrainingSessionEntity ts : sessionsOnSameDay)
            if(isInInterval(trainingSessionEntity.getStart().toLocalTime(), ts.getStart().toLocalTime()))
                throw new RequestDeniedException("You can't add session that takes time during another session.");
        try{
            trainingSessionRepository.save(trainingSessionEntity);
        }
        catch (Exception e){
            throw new RequestDeniedException("You can't add session that takes time during another session.");
        }

    }



    public List<TrainingSessionEntity> reservedSessions(String username) {
        Collection<TrainingSessionPerUserEntity> trainingSessionPerUserEntities = trainingSessionPerUserRepository.findAllByUsername(username);
        List<TrainingSessionEntity> trainingSessionEntities = trainingSessionRepository.findAll();
        List<TrainingSessionEntity> reservedSessions = new ArrayList<>();
        for(TrainingSessionPerUserEntity tspu : trainingSessionPerUserEntities)
            for(TrainingSessionEntity session : trainingSessionEntities)
                if(Objects.equals(tspu.getTrainingSessionId(), session.getId())){
                    reservedSessions.add(session);
                    break;
                }
        return reservedSessions;
    }
    public List<TrainingSessionEntity> nonReservedSessions(String username) {
        List<Long> reservedIds = reservedSessions(username).stream().map(TrainingSessionEntity::getId).collect(Collectors.toList());
        List<TrainingSessionEntity> trainingSessionEntities = trainingSessionRepository.findAll();
        List<TrainingSessionEntity> nonReservedSessions = new ArrayList<>();
        for(TrainingSessionEntity session : trainingSessionEntities)
            if(!(reservedIds.contains(session.getId())) && session.getFreePlaces()>0){
                nonReservedSessions.add(session);
            }
        return nonReservedSessions;
    }

    public boolean isInInterval(LocalTime v, LocalTime a){
        LocalTime b = a.plusHours(1);
        LocalTime vv = v.plusHours(1);
        return (v.isAfter(a) && v.isBefore(b)) || vv.equals(b) || (vv.isAfter(a) && vv.isBefore(b));
    }

}