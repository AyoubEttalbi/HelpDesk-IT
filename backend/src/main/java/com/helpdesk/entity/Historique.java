package com.helpdesk.entity;

import com.helpdesk.enums.Statut;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Historique")
public class Historique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historique")
    private Integer idHistorique;

    @Enumerated(EnumType.STRING)
    @Column(name = "ancien_statut", length = 20)
    private Statut ancienStatut;

    @Enumerated(EnumType.STRING)
    @Column(name = "nouveau_statut", nullable = false, length = 20)
    private Statut nouveauStatut;

    @Column(name = "date_changement", nullable = false, updatable = false)
    private LocalDateTime dateChangement = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_incident", nullable = false)
    private Incident incident;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_user", nullable = false)
    private User auteur;

    public Historique() {}

    public Historique(Statut ancienStatut, Statut nouveauStatut, Incident incident, User auteur) {
        this.ancienStatut = ancienStatut;
        this.nouveauStatut = nouveauStatut;
        this.incident = incident;
        this.auteur = auteur;
    }

    public Integer getIdHistorique() { return idHistorique; }
    public void setIdHistorique(Integer idHistorique) { this.idHistorique = idHistorique; }
    public Statut getAncienStatut() { return ancienStatut; }
    public void setAncienStatut(Statut ancienStatut) { this.ancienStatut = ancienStatut; }
    public Statut getNouveauStatut() { return nouveauStatut; }
    public void setNouveauStatut(Statut nouveauStatut) { this.nouveauStatut = nouveauStatut; }
    public LocalDateTime getDateChangement() { return dateChangement; }
    public void setDateChangement(LocalDateTime dateChangement) { this.dateChangement = dateChangement; }
    public Incident getIncident() { return incident; }
    public void setIncident(Incident incident) { this.incident = incident; }
    public User getAuteur() { return auteur; }
    public void setAuteur(User auteur) { this.auteur = auteur; }
}
