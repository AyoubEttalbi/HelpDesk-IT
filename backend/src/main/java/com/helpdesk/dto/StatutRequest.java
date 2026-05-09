package com.helpdesk.dto;

import com.helpdesk.enums.Statut;
import jakarta.validation.constraints.NotNull;

public record StatutRequest(
    @NotNull Statut statut
) {}
