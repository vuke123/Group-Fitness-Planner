package hr.fer.progi.repository;

import hr.fer.progi.entity.ExercisePerTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface ExercisePerTypeRepository extends JpaRepository<ExercisePerTypeEntity, Long> {
    @Query(value= "SELECT e.* FROM ept e WHERE e.training_type = :t", nativeQuery = true)
    Collection<ExercisePerTypeEntity> findAllByType(@Param("t") String type );

}