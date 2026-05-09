package com.helpdesk.repository;

import com.helpdesk.entity.User;
import com.helpdesk.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByRoleAndDisponibilite(Role role, Boolean disponibilite);
}
