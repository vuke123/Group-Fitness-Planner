package hr.fer.progi.repository;


import hr.fer.progi.entity.UpdatesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UpdatesRepository extends JpaRepository<UpdatesEntity, Long> {
    Optional<UpdatesEntity> findByUsername(String username);

}




