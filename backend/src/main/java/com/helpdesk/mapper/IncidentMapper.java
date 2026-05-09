package com.helpdesk.mapper;

import com.helpdesk.dto.IncidentResponse;
import com.helpdesk.entity.Commentaire;
import com.helpdesk.entity.Historique;
import com.helpdesk.entity.Incident;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class IncidentMapper {

    public IncidentResponse toResponse(Incident incident) {
        return new IncidentResponse(
            incident.getIdIncident(),
            incident.getNumeroTicket(),
            incident.getTitre(),
            incident.getDescription(),
            incident.getStatut(),
            incident.getPriorite(),
            incident.getDateCreation(),
            incident.getDateResolution(),
            toUserRef(incident.getCreateur(), null),
            incident.getTechnicien() != null ? toUserRef(incident.getTechnicien(), incident.getTechnicien().getSpecialite()) : null,
            new IncidentResponse.CategorieRef(
                incident.getCategorie().getIdCategorie(),
                incident.getCategorie().getLibelle(),
                incident.getCategorie().getDescription()
            ),
            incident.getCommentaires() != null ? toCommentaireList(incident.getCommentaires()) : Collections.emptyList(),
            incident.getHistorique() != null ? toHistoriqueList(incident.getHistorique()) : Collections.emptyList()
        );
    }

    public IncidentResponse toListResponse(Incident incident) {
        return IncidentResponse.withoutDetails(
            incident.getIdIncident(),
            incident.getNumeroTicket(),
            incident.getTitre(),
            incident.getStatut(),
            incident.getPriorite(),
            incident.getDateCreation(),
            incident.getDateResolution(),
            toUserRef(incident.getCreateur(), null),
            incident.getTechnicien() != null ? toUserRef(incident.getTechnicien(), incident.getTechnicien().getSpecialite()) : null,
            new IncidentResponse.CategorieRef(
                incident.getCategorie().getIdCategorie(),
                incident.getCategorie().getLibelle(),
                null
            )
        );
    }

    private IncidentResponse.UserRef toUserRef(com.helpdesk.entity.User user, String specialite) {
        return new IncidentResponse.UserRef(
            user.getIdUser(),
            user.getNom(),
            user.getPrenom(),
            specialite
        );
    }

    private List<IncidentResponse.CommentaireInfo> toCommentaireList(List<Commentaire> commentaires) {
        return commentaires.stream()
            .map(c -> new IncidentResponse.CommentaireInfo(
                c.getIdCommentaire(),
                c.getContenu(),
                c.getDateCommentaire(),
                toUserRef(c.getAuteur(), null)
            ))
            .toList();
    }

    private List<IncidentResponse.HistoriqueInfo> toHistoriqueList(List<Historique> historiques) {
        return historiques.stream()
            .map(h -> new IncidentResponse.HistoriqueInfo(
                h.getIdHistorique(),
                h.getAncienStatut(),
                h.getNouveauStatut(),
                h.getDateChangement(),
                toUserRef(h.getAuteur(), null)
            ))
            .toList();
    }
}
