package com.helpdesk.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank String nom,
    @NotBlank String prenom,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8) String motDePasse,
    String departement
) {}
