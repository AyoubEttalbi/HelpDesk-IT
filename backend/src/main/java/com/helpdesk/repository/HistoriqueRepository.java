package com.helpdesk.repository;

import com.helpdesk.entity.Historique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HistoriqueRepository extends JpaRepository<Historique, Integer> {

    @Query("""
        SELECT h FROM Historique h
        LEFT JOIN FETCH h.auteur
        WHERE h.incident.idIncident = :incidentId
        ORDER BY h.dateChangement ASC
    """)
    List<Historique> findByIncidentIdOrderByDateAsc(@Param("incidentId") Integer incidentId);
}
