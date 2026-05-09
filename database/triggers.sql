CREATE TRIGGER trg_Incident_Historique
ON Incident
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF UPDATE(statut)
    BEGIN
        INSERT INTO Historique (ancien_statut, nouveau_statut, id_incident, id_user)
        SELECT
            d.statut,
            i.statut,
            i.id_incident,
            COALESCE(i.id_technicien, i.id_user)
        FROM inserted i
        INNER JOIN deleted d ON i.id_incident = d.id_incident
        WHERE d.statut != i.statut;
    END
END;
