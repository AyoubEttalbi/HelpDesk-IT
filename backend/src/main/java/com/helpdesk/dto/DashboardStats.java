package com.helpdesk.dto;

import java.util.List;

public record DashboardStats(
    long totalIncidents,
    List<StatutCount> incidentsParStatut,
    List<TechnicienCount> incidentsParTechnicien,
    List<CategorieCount> incidentsParCategorie,
    Double tempsMoyenResolution
) {
    public record StatutCount(String statut, long count) {}
    public record TechnicienCount(String technicien, Integer idUser, long count) {}
    public record CategorieCount(String categorie, Integer idCategorie, long count) {}
}
