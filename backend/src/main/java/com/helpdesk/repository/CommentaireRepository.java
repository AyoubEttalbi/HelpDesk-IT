package com.helpdesk.repository;

import com.helpdesk.entity.Commentaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentaireRepository extends JpaRepository<Commentaire, Integer> {

    @Query("""
        SELECT c FROM Commentaire c
        LEFT JOIN FETCH c.auteur
        WHERE c.incident.idIncident = :incidentId
        ORDER BY c.dateCommentaire ASC
    """)
    List<Commentaire> findByIncidentIdOrderByDateAsc(@Param("incidentId") Integer incidentId);
}
