package com.helpdesk.dto;

import com.helpdesk.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRequest(
    @NotBlank String nom,
    @NotBlank String prenom,
    @NotBlank @Email String email,
    @Size(min = 8) String motDePasse,
    @NotNull Role role,
    String departement,
    String specialite,
    Boolean disponibilite
) {}
