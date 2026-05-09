package com.helpdesk.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Categorie")
public class Categorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categorie")
    private Integer idCategorie;

    @Column(nullable = false, unique = true, length = 100)
    private String libelle;

    @Column(length = 500)
    private String description;

    public Categorie() {}

    public Categorie(String libelle, String description) {
        this.libelle = libelle;
        this.description = description;
    }

    public Integer getIdCategorie() { return idCategorie; }
    public void setIdCategorie(Integer idCategorie) { this.idCategorie = idCategorie; }
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
