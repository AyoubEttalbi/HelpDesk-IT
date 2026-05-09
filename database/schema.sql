CREATE TABLE [User] (
    id_user         INT PRIMARY KEY IDENTITY,
    nom             VARCHAR(100)  NOT NULL,
    prenom          VARCHAR(100)  NOT NULL,
    email           VARCHAR(255)  NOT NULL UNIQUE,
    mot_de_passe    VARCHAR(255)  NOT NULL,
    role            VARCHAR(20)   NOT NULL CHECK (role IN ('USER', 'TECHNICIAN', 'ADMIN')),
    departement     VARCHAR(100)  NULL,
    specialite      VARCHAR(100)  NULL,
    disponibilite   BIT           NOT NULL DEFAULT 1,
    date_creation   DATETIME2     NOT NULL DEFAULT GETDATE()
);

CREATE TABLE Categorie (
    id_categorie INT PRIMARY KEY IDENTITY,
    libelle      VARCHAR(100) NOT NULL UNIQUE,
    description  VARCHAR(500) NULL
);

CREATE TABLE Incident (
    id_incident     INT PRIMARY KEY IDENTITY,
    numero_ticket   VARCHAR(20)  NOT NULL UNIQUE,
    titre           VARCHAR(255) NOT NULL,
    description     TEXT         NOT NULL,
    statut          VARCHAR(20)  NOT NULL CHECK (statut IN ('OUVERT', 'EN_COURS', 'EN_ATTENTE', 'RESOLU', 'CLOS')),
    priorite        VARCHAR(20)  NOT NULL CHECK (priorite IN ('FAIBLE', 'MOYEN', 'URGENT', 'CRITIQUE')),
    date_creation   DATETIME2    NOT NULL DEFAULT GETDATE(),
    date_resolution DATETIME2    NULL,
    id_user         INT          NOT NULL,
    id_technicien   INT          NULL,
    id_categorie    INT          NOT NULL,
    CONSTRAINT FK_Incident_User       FOREIGN KEY (id_user)       REFERENCES [User](id_user),
    CONSTRAINT FK_Incident_Technicien FOREIGN KEY (id_technicien) REFERENCES [User](id_user),
    CONSTRAINT FK_Incident_Categorie  FOREIGN KEY (id_categorie)  REFERENCES Categorie(id_categorie)
);

CREATE INDEX idx_incident_date   ON Incident(date_creation);
CREATE INDEX idx_incident_statut ON Incident(statut);
CREATE INDEX idx_incident_user   ON Incident(id_user);

CREATE TABLE Commentaire (
    id_commentaire   INT PRIMARY KEY IDENTITY,
    contenu          TEXT      NOT NULL,
    date_commentaire DATETIME2 NOT NULL DEFAULT GETDATE(),
    id_incident      INT       NOT NULL,
    id_user          INT       NOT NULL,
    CONSTRAINT FK_Commentaire_Incident FOREIGN KEY (id_incident) REFERENCES Incident(id_incident),
    CONSTRAINT FK_Commentaire_User     FOREIGN KEY (id_user)     REFERENCES [User](id_user)
);

CREATE TABLE Historique (
    id_historique    INT PRIMARY KEY IDENTITY,
    ancien_statut    VARCHAR(20) NULL,
    nouveau_statut   VARCHAR(20) NOT NULL,
    date_changement  DATETIME2   NOT NULL DEFAULT GETDATE(),
    id_incident      INT         NOT NULL,
    id_user          INT         NOT NULL,
    CONSTRAINT FK_Historique_Incident FOREIGN KEY (id_incident) REFERENCES Incident(id_incident),
    CONSTRAINT FK_Historique_User     FOREIGN KEY (id_user)     REFERENCES [User](id_user)
);
