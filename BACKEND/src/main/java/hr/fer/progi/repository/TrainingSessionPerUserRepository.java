package hr.fer.progi.repository;


import hr.fer.progi.entity.TrainingSessionPerUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;


@Repository
public interface TrainingSessionPerUserRepository extends JpaRepository<TrainingSessionPerUserEntity, Long> {

    @Query(value = "SELECT t.* FROM tspu t WHERE t.username =:u", nativeQuery = true)
    Collection<TrainingSessionPerUserEntity> findAllByUsername(@Param("u") String username);


}