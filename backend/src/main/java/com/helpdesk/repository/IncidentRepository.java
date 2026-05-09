package com.helpdesk.repository;

import com.helpdesk.entity.Incident;
import com.helpdesk.enums.Priorite;
import com.helpdesk.enums.Statut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IncidentRepository extends JpaRepository<Incident, Integer> {

    Optional<Incident> findByNumeroTicket(String numeroTicket);

    @Query("""
        SELECT MAX(i.numeroTicket)
        FROM Incident i
        WHERE i.numeroTicket LIKE :prefix%
    """)
    Optional<String> findMaxNumeroTicketByPrefix(@Param("prefix") String prefix);

    @Query("""
        SELECT i FROM Incident i
        LEFT JOIN FETCH i.createur
        LEFT JOIN FETCH i.technicien
        LEFT JOIN FETCH i.categorie
        WHERE i.createur.idUser = :userId
    """)
    List<Incident> findByCreateurId(@Param("userId") Integer userId);

    @Query("""
        SELECT i FROM Incident i
        LEFT JOIN FETCH i.createur
        LEFT JOIN FETCH i.technicien
        LEFT JOIN FETCH i.categorie
        WHERE i.technicien.idUser = :technicienId
           OR (i.technicien IS NULL AND i.statut = 'OUVERT')
    """)
    List<Incident> findAccessibleByTechnicien(@Param("technicienId") Integer technicienId);

    @Query("""
        SELECT i FROM Incident i
        LEFT JOIN FETCH i.createur
        LEFT JOIN FETCH i.technicien
        LEFT JOIN FETCH i.categorie
    """)
    List<Incident> findAllWithAssociations();

    @Query("""
        SELECT i FROM Incident i
        LEFT JOIN FETCH i.createur
        LEFT JOIN FETCH i.technicien
        LEFT JOIN FETCH i.categorie
        WHERE (:statut IS NULL OR i.statut = :statut)
        AND (:priorite IS NULL OR i.priorite = :priorite)
        AND (:idCategorie IS NULL OR i.categorie.idCategorie = :idCategorie)
        AND (:search IS NULL OR LOWER(i.titre) LIKE LOWER(CONCAT('%', :search, '%'))
             OR LOWER(i.description) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
    List<Incident> findByFilters(
        @Param("statut") Statut statut,
        @Param("priorite") Priorite priorite,
        @Param("idCategorie") Integer idCategorie,
        @Param("search") String search
    );

    @Query("""
        SELECT i FROM Incident i
        LEFT JOIN FETCH i.createur
        LEFT JOIN FETCH i.technicien
        LEFT JOIN FETCH i.categorie
        WHERE i.idIncident = :id
    """)
    Optional<Incident> findByIdWithAssociations(@Param("id") Integer id);

    long countByStatut(Statut statut);
    long countByTechnicienIdUserAndStatut(Integer technicienId, Statut statut);
}
