package com.helpdesk.service;

import com.helpdesk.dto.IncidentRequest;
import com.helpdesk.dto.IncidentResponse;
import com.helpdesk.entity.*;
import com.helpdesk.enums.Priorite;
import com.helpdesk.enums.Role;
import com.helpdesk.enums.Statut;
import com.helpdesk.exception.InvalidTransitionException;
import com.helpdesk.exception.ResourceNotFoundException;
import com.helpdesk.exception.UnauthorizedException;
import com.helpdesk.mapper.IncidentMapper;
import com.helpdesk.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Transactional
public class IncidentService {

    private static final Map<Statut, Set<Statut>> ALLOWED_TRANSITIONS = Map.of(
        Statut.OUVERT, Set.of(Statut.EN_COURS, Statut.CLOS),
        Statut.EN_COURS, Set.of(Statut.EN_ATTENTE, Statut.RESOLU),
        Statut.EN_ATTENTE, Set.of(Statut.EN_COURS),
        Statut.RESOLU, Set.of(Statut.CLOS, Statut.EN_COURS)
    );

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final CategorieRepository categorieRepository;
    private final HistoriqueRepository historiqueRepository;
    private final CommentaireRepository commentaireRepository;
    private final IncidentMapper incidentMapper;
    private final NotificationService notificationService;

    public IncidentService(IncidentRepository incidentRepository, UserRepository userRepository,
                           CategorieRepository categorieRepository, HistoriqueRepository historiqueRepository,
                           CommentaireRepository commentaireRepository, IncidentMapper incidentMapper,
                           NotificationService notificationService) {
        this.incidentRepository = incidentRepository;
        this.userRepository = userRepository;
        this.categorieRepository = categorieRepository;
        this.historiqueRepository = historiqueRepository;
        this.commentaireRepository = commentaireRepository;
        this.incidentMapper = incidentMapper;
        this.notificationService = notificationService;
    }

    public List<IncidentResponse> getIncidents(Integer currentUserId, String currentRole,
                                                Statut statut, Priorite priorite,
                                                Integer idCategorie, String search) {
        List<Incident> incidents;

        if (currentRole.equals("ADMIN")) {
            incidents = incidentRepository.findAllWithAssociations();
        } else if (currentRole.equals("TECHNICIAN")) {
            incidents = incidentRepository.findAccessibleByTechnicien(currentUserId);
        } else {
            incidents = incidentRepository.findByCreateurId(currentUserId);
        }

        if (statut != null || priorite != null || idCategorie != null || search != null) {
            incidents = incidents.stream()
                .filter(i -> statut == null || i.getStatut() == statut)
                .filter(i -> priorite == null || i.getPriorite() == priorite)
                .filter(i -> idCategorie == null || i.getCategorie().getIdCategorie().equals(idCategorie))
                .filter(i -> search == null || i.getTitre().toLowerCase().contains(search.toLowerCase())
                    || i.getDescription().toLowerCase().contains(search.toLowerCase()))
                .toList();
        }

        return incidents.stream()
            .map(incidentMapper::toListResponse)
            .toList();
    }

    public IncidentResponse getIncidentById(Integer id, Integer currentUserId, String currentRole) {
        Incident incident = incidentRepository.findByIdWithAssociations(id)
            .orElseThrow(() -> new ResourceNotFoundException("Incident non trouvé: " + id));

        if (currentRole.equals("USER") && !incident.getCreateur().getIdUser().equals(currentUserId)) {
            throw new UnauthorizedException("Vous n'avez pas accès à cet incident");
        }

        return incidentMapper.toResponse(incident);
    }

    public IncidentResponse createIncident(IncidentRequest request, Integer userId) {
        User createur = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        Categorie categorie = categorieRepository.findById(request.idCategorie())
            .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée"));

        Incident incident = new Incident();
        incident.setNumeroTicket(generateNumeroTicket());
        incident.setTitre(request.titre());
        incident.setDescription(request.description());
        incident.setStatut(Statut.OUVERT);
        incident.setPriorite(request.priorite());
        incident.setCreateur(createur);
        incident.setCategorie(categorie);

        incident = incidentRepository.save(incident);

        Historique hist = new Historique(null, Statut.OUVERT, incident, createur);
        historiqueRepository.save(hist);
        incident.getHistorique().add(hist);

        List<User> techniciens = userRepository.findByRole(Role.TECHNICIAN);
        for (User tech : techniciens) {
            notificationService.push(tech.getIdUser(),
                "Nouvel incident: " + incident.getNumeroTicket() + " - " + incident.getTitre());
        }

        return incidentMapper.toResponse(incidentRepository.findByIdWithAssociations(incident.getIdIncident()).orElse(incident));
    }

    public IncidentResponse updateStatut(Integer id, Statut nouveauStatut, Integer userId, String currentRole) {
        Incident incident = incidentRepository.findByIdWithAssociations(id)
            .orElseThrow(() -> new ResourceNotFoundException("Incident non trouvé: " + id));

        Statut ancienStatut = incident.getStatut();

        if (!isTransitionAllowed(ancienStatut, nouveauStatut, currentRole)) {
            throw new InvalidTransitionException(
                "Transition non autorisée de " + ancienStatut + " vers " + nouveauStatut);
        }

        incident.setStatut(nouveauStatut);

        if (nouveauStatut == Statut.CLOS && ancienStatut == Statut.RESOLU) {
            incident.setDateResolution(LocalDateTime.now());
        }

        incident = incidentRepository.save(incident);

        User auteur = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        Historique hist = new Historique(ancienStatut, nouveauStatut, incident, auteur);
        historiqueRepository.save(hist);
        incident.getHistorique().add(hist);

        if (nouveauStatut == Statut.RESOLU) {
            notificationService.push(incident.getCreateur().getIdUser(),
                "Solution proposée pour " + incident.getNumeroTicket());
        } else if (nouveauStatut == Statut.CLOS) {
            if (incident.getTechnicien() != null) {
                notificationService.push(incident.getTechnicien().getIdUser(),
                    "Incident clôturé: " + incident.getNumeroTicket());
            }
        }

        return incidentMapper.toResponse(incident);
    }

    public IncidentResponse assignTechnicien(Integer id, Integer technicienId, Integer currentUserId) {
        Incident incident = incidentRepository.findByIdWithAssociations(id)
            .orElseThrow(() -> new ResourceNotFoundException("Incident non trouvé: " + id));

        User technicien = userRepository.findById(technicienId)
            .orElseThrow(() -> new ResourceNotFoundException("Technicien non trouvé"));

        if (technicien.getRole() != Role.TECHNICIAN) {
            throw new IllegalArgumentException("L'utilisateur sélectionné n'est pas un technicien");
        }

        incident.setTechnicien(technicien);
        incident = incidentRepository.save(incident);

        notificationService.push(technicien.getIdUser(),
            "Incident assigné: " + incident.getNumeroTicket());

        return incidentMapper.toResponse(incident);
    }

    public void deleteIncident(Integer id) {
        Incident incident = incidentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Incident non trouvé: " + id));
        incidentRepository.delete(incident);
    }

    public IncidentResponse addCommentaire(Integer incidentId, String contenu, Integer userId) {
        Incident incident = incidentRepository.findByIdWithAssociations(incidentId)
            .orElseThrow(() -> new ResourceNotFoundException("Incident non trouvé: " + incidentId));

        User auteur = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        Commentaire commentaire = new Commentaire(contenu, incident, auteur);
        commentaire = commentaireRepository.save(commentaire);
        incident.getCommentaires().add(commentaire);

        return incidentMapper.toResponse(incident);
    }

    private String generateNumeroTicket() {
        String year = String.valueOf(Year.now().getValue());
        String prefix = "TKT-" + year + "-";
        String maxTicket = incidentRepository.findMaxNumeroTicketByPrefix(prefix).orElse(null);

        int nextNum = 1;
        if (maxTicket != null) {
            String numPart = maxTicket.substring(prefix.length());
            nextNum = Integer.parseInt(numPart) + 1;
        }

        return prefix + String.format("%06d", nextNum);
    }

    private boolean isTransitionAllowed(Statut current, Statut next, String role) {
        if (current == next) return false;

        if (role.equals("ADMIN")) return true;

        Set<Statut> allowed = ALLOWED_TRANSITIONS.get(current);
        if (allowed == null) return false;

        if (!allowed.contains(next)) return false;

        if (current == Statut.OUVERT && next == Statut.CLOS && !role.equals("ADMIN")) return false;

        if (current == Statut.RESOLU && next == Statut.CLOS && !role.equals("USER") && !role.equals("ADMIN")) {
            return false;
        }

        return true;
    }
}
