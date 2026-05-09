package com.helpdesk.dto;

import com.helpdesk.enums.Priorite;
import com.helpdesk.enums.Statut;

import java.time.LocalDateTime;
import java.util.List;

public record IncidentResponse(
    Integer idIncident,
    String numeroTicket,
    String titre,
    String description,
    Statut statut,
    Priorite priorite,
    LocalDateTime dateCreation,
    LocalDateTime dateResolution,
    UserRef createur,
    UserRef technicien,
    CategorieRef categorie,
    List<CommentaireInfo> commentaires,
    List<HistoriqueInfo> historique
) {
    public record UserRef(Integer idUser, String nom, String prenom, String specialite) {}
    public record CategorieRef(Integer idCategorie, String libelle, String description) {}
    public record CommentaireInfo(Integer idCommentaire, String contenu, LocalDateTime dateCommentaire, UserRef auteur) {}
    public record HistoriqueInfo(Integer idHistorique, Statut ancienStatut, Statut nouveauStatut, LocalDateTime dateChangement, UserRef auteur) {}

    public static IncidentResponse withoutDetails(Integer idIncident, String numeroTicket, String titre,
            Statut statut, Priorite priorite, LocalDateTime dateCreation, LocalDateTime dateResolution,
            UserRef createur, UserRef technicien, CategorieRef categorie) {
        return new IncidentResponse(idIncident, numeroTicket, titre, null, statut, priorite,
            dateCreation, dateResolution, createur, technicien, categorie, null, null);
    }
}
