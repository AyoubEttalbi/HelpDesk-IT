CREATE PROCEDURE sp_GetAvgResolutionTime
AS
BEGIN
    SELECT
        u.id_user,
        u.nom + ' ' + u.prenom AS technicien,
        AVG(DATEDIFF(HOUR, i.date_creation, i.date_resolution)) AS avg_heures,
        COUNT(i.id_incident) AS incidents_resolus
    FROM Incident i
    INNER JOIN [User] u ON i.id_technicien = u.id_user
    WHERE i.statut = 'CLOS'
      AND i.date_resolution IS NOT NULL
    GROUP BY u.id_user, u.nom, u.prenom
    ORDER BY avg_heures;
END;
