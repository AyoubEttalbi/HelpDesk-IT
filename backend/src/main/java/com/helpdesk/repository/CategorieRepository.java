package com.helpdesk.repository;

import com.helpdesk.entity.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategorieRepository extends JpaRepository<Categorie, Integer> {

    @Query("""
        SELECT c, COUNT(i.idIncident)
        FROM Categorie c
        LEFT JOIN Incident i ON i.categorie = c
        GROUP BY c.idCategorie, c.libelle, c.description
        ORDER BY c.libelle
    """)
    List<Object[]> findAllWithIncidentCount();

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.categorie.idCategorie = :id")
    long countIncidentsByCategorieId(Integer id);
}
