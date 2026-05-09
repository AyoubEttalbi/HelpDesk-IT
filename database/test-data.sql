-- Admin user (password: admin123)
INSERT INTO [User] (nom, prenom, email, mot_de_passe, role, departement)
VALUES ('Admin', 'System', 'admin@helpdesk.com',
        '$2a$10$nlXKLtgHOLOZqU6g6Gfn9.5PgEFypjESPCJzfNQREQN0nKqTszReq',
        'ADMIN', 'IT');

-- Technicians (password: tech123)
INSERT INTO [User] (nom, prenom, email, mot_de_passe, role, departement, specialite, disponibilite)
VALUES
('Benali', 'Karim', 'karim@helpdesk.com',
 '$2a$10$mT4DLWguBcr3IxpBtF9sFOvPDFIHMe/wwOswh.Hf2IbduoX5NRPvO',
 'TECHNICIAN', 'IT', 'Réseau', 1),
('El Amrani', 'Sara', 'sara@helpdesk.com',
 '$2a$10$mT4DLWguBcr3IxpBtF9sFOvPDFIHMe/wwOswh.Hf2IbduoX5NRPvO',
 'TECHNICIAN', 'IT', 'Développement', 1),
('Idrissi', 'Hassan', 'hassan@helpdesk.com',
 '$2a$10$mT4DLWguBcr3IxpBtF9sFOvPDFIHMe/wwOswh.Hf2IbduoX5NRPvO',
 'TECHNICIAN', 'IT', 'Système', 1);

-- Regular users (password: user123)
INSERT INTO [User] (nom, prenom, email, mot_de_passe, role, departement)
VALUES
('Alaoui', 'Mohamed', 'mohamed@example.com',
 '$2a$10$vUfG/XkZHggXcFIlMA9FSOiieM894eJMNOljH3K2SAvwGqGGn6VIC',
 'USER', 'Comptabilité'),
('Benani', 'Fatima', 'fatima@example.com',
 '$2a$10$vUfG/XkZHggXcFIlMA9FSOiieM894eJMNOljH3K2SAvwGqGGn6VIC',
 'USER', 'RH'),
('Cherkaoui', 'Youssef', 'youssef@example.com',
 '$2a$10$vUfG/XkZHggXcFIlMA9FSOiieM894eJMNOljH3K2SAvwGqGGn6VIC',
 'USER', 'Marketing'),
('Daoudi', 'Amina', 'amina@example.com',
 '$2a$10$vUfG/XkZHggXcFIlMA9FSOiieM894eJMNOljH3K2SAvwGqGGn6VIC',
 'USER', 'Commercial'),
('Fassi', 'Omar', 'omar@example.com',
 '$2a$10$vUfG/XkZHggXcFIlMA9FSOiieM894eJMNOljH3K2SAvwGqGGn6VIC',
 'USER', 'Logistique');

-- Categories
INSERT INTO Categorie (libelle, description) VALUES
('Réseau', 'Problèmes de connectivité réseau, Wi-Fi, VPN'),
('Matériel', 'Panne ou dysfonctionnement de matériel informatique'),
('Logiciel', 'Problèmes d''installation, mise à jour ou utilisation de logiciels'),
('Email', 'Problèmes de messagerie électronique'),
('Sécurité', 'Problèmes de sécurité, accès, droits utilisateurs'),
('Téléphonie', 'Problèmes de téléphonie fixe ou mobile'),
('Imprimante', 'Problèmes d''impression, drivers, cartouches');

-- Incidents
INSERT INTO Incident (numero_ticket, titre, description, statut, priorite, id_user, id_technicien, id_categorie, date_creation)
VALUES
('TKT-2026-000001', 'Connexion VPN impossible', 'Impossible de se connecter au VPN depuis mon poste. Erreur 800.', 'EN_COURS', 'URGENT', 4, 1, 1, DATEADD(DAY, -5, GETDATE())),
('TKT-2026-000002', 'Ecran qui clignote', 'Mon écran Dell clignote régulièrement depuis ce matin.', 'OUVERT', 'MOYEN', 5, NULL, 2, DATEADD(DAY, -3, GETDATE())),
('TKT-2026-000003', 'Mise à jour logiciel comptable', 'Besoin d''aide pour installer la mise à jour du logiciel de compta.', 'EN_ATTENTE', 'FAIBLE', 4, 2, 3, DATEADD(DAY, -2, GETDATE())),
('TKT-2026-000004', 'Boîte mail saturée', 'Ma boîte mail est pleine, impossible d''envoyer des messages.', 'RESOLU', 'MOYEN', 6, 1, 4, DATEADD(DAY, -7, GETDATE())),
('TKT-2026-000005', 'Mot de passe oublié', 'J''ai oublié mon mot de passe pour l''application RH.', 'CLOS', 'FAIBLE', 5, 2, 5, DATEADD(DAY, -10, GETDATE())),
('TKT-2026-000006', 'Lien internet très lent', 'La connexion internet est extrêmement lente depuis 2 jours.', 'EN_COURS', 'CRITIQUE', 7, 1, 1, DATEADD(DAY, -1, GETDATE())),
('TKT-2026-000007', 'Imprimante ne répond pas', 'L''imprimante du bureau 204 ne répond plus aux impressions.', 'OUVERT', 'MOYEN', 8, NULL, 7, DATEADD(HOUR, -6, GETDATE())),
('TKT-2026-000008', 'Problème d''accès au dossier partagé', 'Je n''ai plus accès au dossier partagé du département marketing.', 'EN_ATTENTE', 'URGENT', 6, 3, 5, DATEADD(DAY, -4, GETDATE())),
('TKT-2026-000009', 'Installation logiciel CAO', 'Besoin d''installer le logiciel AutoCAD sur mon nouveau poste.', 'OUVERT', 'MOYEN', 9, NULL, 3, DATEADD(HOUR, -2, GETDATE())),
('TKT-2026-000010', 'Casque audio défectueux', 'Le casque audio pour les réunions Teams ne fonctionne plus.', 'RESOLU', 'FAIBLE', 7, 3, 2, DATEADD(DAY, -6, GETDATE()));

-- Comments
INSERT INTO Commentaire (contenu, date_commentaire, id_incident, id_user) VALUES
('Je vérifie la configuration VPN. Pouvez-vous me donner votre adresse IP ?', DATEADD(DAY, -4, GETDATE()), 1, 1),
('Mon IP est 192.168.1.45', DATEADD(DAY, -4, GETDATE()), 1, 4),
('Problème résolu après redémarrage du service VPN.', DATEADD(DAY, -7, GETDATE()), 4, 1),
('J''ai nettoyé la boîte et supprimé les anciens messages.', DATEADD(DAY, -3, GETDATE()), 5, 2),
('Le problème semble venir du routeur. J''interviens cet après-midi.', DATEADD(DAY, -1, GETDATE()), 6, 1);

-- Historique (auto-filled by trigger, but pre-seeding for demo)
INSERT INTO Historique (ancien_statut, nouveau_statut, date_changement, id_incident, id_user) VALUES
(NULL, 'OUVERT', DATEADD(DAY, -5, GETDATE()), 1, 4),
('OUVERT', 'EN_COURS', DATEADD(DAY, -4, GETDATE()), 1, 1),
(NULL, 'OUVERT', DATEADD(DAY, -3, GETDATE()), 2, 5),
(NULL, 'OUVERT', DATEADD(DAY, -2, GETDATE()), 3, 4),
('OUVERT', 'EN_ATTENTE', DATEADD(DAY, -1, GETDATE()), 3, 2),
(NULL, 'OUVERT', DATEADD(DAY, -7, GETDATE()), 4, 6),
('OUVERT', 'EN_COURS', DATEADD(DAY, -6, GETDATE()), 4, 1),
('EN_COURS', 'RESOLU', DATEADD(DAY, -5, GETDATE()), 4, 1),
(NULL, 'OUVERT', DATEADD(DAY, -10, GETDATE()), 5, 5),
('OUVERT', 'EN_COURS', DATEADD(DAY, -9, GETDATE()), 5, 2),
('EN_COURS', 'RESOLU', DATEADD(DAY, -8, GETDATE()), 5, 2),
('RESOLU', 'CLOS', DATEADD(DAY, -7, GETDATE()), 5, 5),
(NULL, 'OUVERT', DATEADD(DAY, -1, GETDATE()), 6, 7),
('OUVERT', 'EN_COURS', DATEADD(HOUR, -12, GETDATE()), 6, 1),
(NULL, 'OUVERT', DATEADD(HOUR, -6, GETDATE()), 7, 8),
(NULL, 'OUVERT', DATEADD(DAY, -4, GETDATE()), 8, 6),
('OUVERT', 'EN_ATTENTE', DATEADD(DAY, -3, GETDATE()), 8, 3),
(NULL, 'OUVERT', DATEADD(HOUR, -2, GETDATE()), 9, 9),
(NULL, 'OUVERT', DATEADD(DAY, -6, GETDATE()), 10, 7),
('OUVERT', 'EN_COURS', DATEADD(DAY, -5, GETDATE()), 10, 3),
('EN_COURS', 'RESOLU', DATEADD(DAY, -4, GETDATE()), 10, 3);
