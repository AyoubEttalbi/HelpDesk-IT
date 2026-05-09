package com.helpdesk.dto;

import com.helpdesk.enums.Role;

public record AuthResponse(
    String token,
    UserInfo user
) {
    public record UserInfo(
        Integer idUser,
        String nom,
        String prenom,
        String email,
        Role role,
        String departement,
        String specialite,
        Boolean disponibilite
    ) {}
}
