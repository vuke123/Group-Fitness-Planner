package hr.fer.progi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hr.fer.progi.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    int countByEmail(String email);
}
