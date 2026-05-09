package com.helpdesk.service;

import com.helpdesk.dto.UserRequest;
import com.helpdesk.entity.User;
import com.helpdesk.enums.Role;
import com.helpdesk.exception.ResourceNotFoundException;
import com.helpdesk.exception.UnauthorizedException;
import com.helpdesk.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé: " + id));
    }

    public User createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }

        User user = new User();
        user.setNom(request.nom());
        user.setPrenom(request.prenom());
        user.setEmail(request.email());
        user.setMotDePasse(passwordEncoder.encode(request.motDePasse()));
        user.setRole(request.role());
        user.setDepartement(request.departement());
        user.setSpecialite(request.role() == Role.TECHNICIAN ? request.specialite() : null);

        return userRepository.save(user);
    }

    public User updateUser(Integer id, UserRequest request) {
        User user = getUserById(id);

        user.setNom(request.nom());
        user.setPrenom(request.prenom());
        user.setEmail(request.email());

        if (request.motDePasse() != null && !request.motDePasse().isBlank()) {
            user.setMotDePasse(passwordEncoder.encode(request.motDePasse()));
        }

        user.setRole(request.role());
        user.setDepartement(request.departement());
        user.setSpecialite(request.role() == Role.TECHNICIAN ? request.specialite() : null);

        if (request.disponibilite() != null) {
            user.setDisponibilite(request.disponibilite());
        }

        return userRepository.save(user);
    }

    public void deleteUser(Integer id, Integer currentUserId) {
        if (id.equals(currentUserId)) {
            throw new UnauthorizedException("Vous ne pouvez pas supprimer votre propre compte");
        }

        User user = getUserById(id);
        userRepository.delete(user);
    }
}
