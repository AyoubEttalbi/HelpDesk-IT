package com.helpdesk.dto;

import com.helpdesk.enums.Priorite;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record IncidentRequest(
    @NotBlank String titre,
    @NotBlank @Size(min = 10) String description,
    @NotNull Priorite priorite,
    @NotNull Integer idCategorie
) {}
