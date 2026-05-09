# HelpDesk IT — Application de Gestion d'Incidents

Application web de ticketing pour le suivi et la résolution d'incidents informatiques. Développée dans le cadre du projet scolaire EMSI — 3ème Année Génie Informatique.

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| **Backend** | Spring Boot 3.x, Java 21 |
| **ORM** | Spring Data JPA (Hibernate) |
| **Sécurité** | Spring Security + JWT (jjwt 0.12.6) |
| **Base de données** | SQL Server 2022 |
| **Frontend** | React 19 + Vite |
| **UI** | Tailwind CSS v4, shadcn/ui |
| **Charts** | Recharts |
| **HTTP** | Axios |

## Structure du Projet

```
HelpDesk-IT/
├── backend/                   # Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/helpdesk/
│       ├── HelpdeskApplication.java
│       ├── config/            # SecurityConfig, CorsConfig, JwtConfig
│       ├── entity/            # User, Incident, Commentaire, Historique, Categorie
│       ├── enums/             # Statut, Priorite, Role
│       ├── repository/        # JPA repositories
│       ├── service/           # Business logic (IncidentService, AuthService, etc.)
│       ├── controller/        # REST controllers
│       ├── dto/               # Request/Response records
│       ├── security/          # JWT provider, filter, UserDetailsService
│       ├── mapper/            # IncidentMapper
│       └── exception/         # GlobalExceptionHandler + custom exceptions
├── frontend/                  # React + Vite application
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx            # Routes avec guards par rôle
│       ├── index.css          # Thème sombre, variables CSS
│       ├── api/               # Axios instance + modules par entité
│       ├── context/           # AuthContext, NotificationContext
│       ├── hooks/             # useAuth
│       ├── components/
│       │   ├── ui/            # shadcn/ui components (Card, Chart, Button, Select, etc.)
│       │   ├── layout/        # ProtectedLayout, Sidebar, Header, NotificationBell
│       │   ├── common/        # LoadingSpinner, EmptyState, ConfirmDialog, Badge, Toast
│       │   ├── tickets/       # TicketTable, FilterBar, StatusTimeline, CommentList/Form
│       │   ├── dashboard/     # StatCard, PieChartByStatus, BarChartByCategory, AvgResolutionCard
│       │   └── users/         # UserTable, UserFormModal
│       └── pages/             # LoginPage, DashboardPage, TicketListPage, TicketFormPage,
│                              # TicketDetailPage, UserManagementPage, CategoryManagementPage,
│                              # NotFoundPage
└── database/
    ├── schema.sql
    ├── triggers.sql
    ├── procedures.sql
    ├── views.sql
    └── test-data.sql
```

## Prérequis

- **Java** 21+
- **Maven** 3.8+
- **Node.js** 18+
- **SQL Server** 2019+ (ou Docker)
- **npm** 9+

## Installation & Démarrage

### 1. Base de données

```bash
# Avec Docker (recommandé)
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD="`
  -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest

# Exécuter les scripts SQL dans l'ordre :
# 1. database/schema.sql
# 2. database/triggers.sql
# 3. database/procedures.sql
# 4. database/views.sql
# 5. database/test-data.sql
```

### 2. Backend

```bash
cd backend
# Configurer application.properties (ou variables d'environnement)
./mvnw clean package -DskipTests
java -jar target/helpdesk-*.jar
```

Le backend démarre sur `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:5173`.

## Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| **Admin** | `admin@helpdesk.com` | `admin123` |
| **Technicien** | `karim@helpdesk.com` | `tech123` |
| **Technicien** | `sara@helpdesk.com` | `tech123` |
| **Utilisateur** | `mohamed@example.com` | `user123` |
| **Utilisateur** | `amina@example.com` | `user123` |

## API REST

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Créer un compte USER |
| POST | `/api/auth/login` | Connexion, retourne JWT |

### Incidents

| Méthode | Endpoint | Rôles | Description |
|---------|----------|-------|-------------|
| GET | `/api/incidents` | Tous | Liste filtrée (rôle-based) |
| GET | `/api/incidents/{id}` | Tous | Détail avec commentaires + historique |
| POST | `/api/incidents` | USER, ADMIN | Créer un incident |
| PUT | `/api/incidents/{id}/statut` | Tous | Changer le statut |
| PUT | `/api/incidents/{id}/assigner` | ADMIN, TECHNICIAN | Assigner un technicien |
| DELETE | `/api/incidents/{id}` | ADMIN | Supprimer un incident |
| POST | `/api/incidents/{id}/commentaires` | Tous | Ajouter un commentaire |

### Utilisateurs (ADMIN only)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users` | Liste tous les utilisateurs |
| POST | `/api/users` | Créer un utilisateur |
| PUT | `/api/users/{id}` | Modifier un utilisateur |
| DELETE | `/api/users/{id}` | Supprimer (sauf soi-même) |

### Catégories (GET: tous, POST/PUT/DELETE: ADMIN)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/categories` | Liste toutes les catégories |
| POST | `/api/categories` | Créer une catégorie |
| PUT | `/api/categories/{id}` | Modifier une catégorie |
| DELETE | `/api/categories/{id}` | Supprimer (si aucun incident lié) |

### Dashboard

| Méthode | Endpoint | Rôles | Description |
|---------|----------|-------|-------------|
| GET | `/api/dashboard/stats` | ADMIN, TECHNICIAN | Statistiques globales |

## Workflow des Statuts

```
OUVERT ──→ EN_COURS ──→ EN_ATTENTE ──→ EN_COURS
  │                                       │
  ├──→ CLOS (admin)                       │
  │                                       │
  └───────────────────────────────────────┘
                   │
                   ↓
               RÉSOLU ──→ CLOS
                   │
                   └──→ EN_COURS (réouverture)

Transitions autorisées par défaut :
  OUVERT   → EN_COURS (technicien prend en charge)
  OUVERT   → CLOS     (admin annule)
  EN_COURS → EN_ATTENTE, RESOLU
  EN_ATTENTE → EN_COURS
  RESOLU   → CLOS, EN_COURS
```

## Structure des Tickets

Format du numéro de ticket : `TKT-YYYY-NNNNNN` (ex: `TKT-2026-000001`)

### Priorités
- **FAIBLE** — Problème mineur
- **MOYEN** — Gêne l'utilisateur
- **URGENT** — Impact productivité
- **CRITIQUE** — Système hors service

## Configuration

### Backend (`application.properties`)

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=helpdesk;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=${DB_PASSWORD}
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration-ms=86400000
```

### Frontend (variables d'environnement)

```env
VITE_API_URL=http://localhost:8080/api
```

## Scripts Disponibles

### Backend
```bash
mvn clean package -DskipTests   # Build
java -jar target/helpdesk-*.jar  # Démarrage
```

### Frontend
```bash
npm run dev     # Développement (hot-reload sur :5173)
npm run build   # Production (build dans dist/)
```

## Zone d'Administration

Accès réservé au rôle ADMIN :
- Gestion des utilisateurs (`/users`)
- Gestion des catégories (`/categories`)
- Suppression d'incidents
- Annulation d'incidents (OUVERT → CLOS)
- Tableau de bord complet

## Technologies Clés

- **Spring Data JPA** avec SQL Server dialect
- **JWT stateless** (jjwt 0.12.6) — 24h d'expiration
- **SSE** (Server-Sent Events) pour notifications en temps réel
- **shadcn/ui** basé sur `@base-ui` pour les composants d'interface
- **Recharts** pour les graphiques du tableau de bord
- **Tailwind CSS v4** avec thème sombre personnalisé

---

Projet EMSI — 3ème Année Génie Informatique — 2026
