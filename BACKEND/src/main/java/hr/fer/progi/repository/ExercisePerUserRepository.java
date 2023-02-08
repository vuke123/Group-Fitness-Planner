package hr.fer.progi.repository;

import hr.fer.progi.entity.ExercisePerUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface ExercisePerUserRepository extends JpaRepository<ExercisePerUserEntity, Long> {

    @Query(value="SELECT e.* FROM epu e WHERE e.username = :u" , nativeQuery = true)
    Collection<ExercisePerUserEntity> findAllByUsername(@Param("u") String username);

}
