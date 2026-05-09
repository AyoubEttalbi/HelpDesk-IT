package com.helpdesk.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentaireRequest(
    @NotBlank String contenu
) {}
