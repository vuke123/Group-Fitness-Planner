package hr.fer.progi.repository;


import hr.fer.progi.entity.GoalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface GoalRepository extends JpaRepository<GoalEntity, Long> {
}
