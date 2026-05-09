package com.helpdesk.dto;

import jakarta.validation.constraints.NotBlank;

public record CategorieRequest(
    @NotBlank String libelle,
    String description
) {}
