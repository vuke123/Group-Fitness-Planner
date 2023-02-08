package hr.fer.progi.repository;

import hr.fer.progi.entity.ExerciseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ExerciseRepository extends JpaRepository<ExerciseEntity, Long> {
}