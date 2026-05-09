package com.helpdesk.dto;

import jakarta.validation.constraints.NotNull;

public record AssignerRequest(
    @NotNull Integer idTechnicien
) {}
