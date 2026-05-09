CREATE VIEW v_IncidentsOuverts AS
SELECT
    i.id_incident,
    i.numero_ticket,
    i.titre,
    i.statut,
    i.priorite,
    i.date_creation,
    createur.nom + ' ' + createur.prenom AS createur,
    technicien.nom + ' ' + technicien.prenom AS technicien,
    c.libelle AS categorie
FROM Incident i
INNER JOIN [User] createur   ON i.id_user = createur.id_user
LEFT  JOIN [User] technicien ON i.id_technicien = technicien.id_user
INNER JOIN Categorie c       ON i.id_categorie = c.id_categorie
WHERE i.statut IN ('OUVERT', 'EN_COURS', 'EN_ATTENTE');
