package hr.fer.progi.repository;

import hr.fer.progi.entity.TrainingTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TrainingTypeRepository extends JpaRepository<TrainingTypeEntity, Long> {

}