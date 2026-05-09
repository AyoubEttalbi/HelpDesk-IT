package com.helpdesk.controller;

import com.helpdesk.dto.*;
import com.helpdesk.enums.Priorite;
import com.helpdesk.enums.Statut;
import com.helpdesk.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public ResponseEntity<List<IncidentResponse>> getIncidents(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Statut statut,
            @RequestParam(required = false) Priorite priorite,
            @RequestParam(required = false) Integer idCategorie,
            @RequestParam(required = false) String search) {

        Integer userId = Integer.parseInt(userDetails.getUsername());
        String role = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");

        List<IncidentResponse> incidents = incidentService.getIncidents(userId, role, statut, priorite, idCategorie, search);
        return ResponseEntity.ok(incidents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getIncident(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Integer userId = Integer.parseInt(userDetails.getUsername());
        String role = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");

        return ResponseEntity.ok(incidentService.getIncidentById(id, userId, role));
    }

    @PostMapping
    public ResponseEntity<IncidentResponse> createIncident(
            @Valid @RequestBody IncidentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Integer userId = Integer.parseInt(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(incidentService.createIncident(request, userId));
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<IncidentResponse> updateStatut(
            @PathVariable Integer id,
            @Valid @RequestBody StatutRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Integer userId = Integer.parseInt(userDetails.getUsername());
        String role = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");

        return ResponseEntity.ok(incidentService.updateStatut(id, request.statut(), userId, role));
    }

    @PutMapping("/{id}/assigner")
    public ResponseEntity<IncidentResponse> assigner(
            @PathVariable Integer id,
            @Valid @RequestBody AssignerRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Integer userId = Integer.parseInt(userDetails.getUsername());
        return ResponseEntity.ok(incidentService.assignTechnicien(id, request.idTechnicien(), userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable Integer id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/commentaires")
    public ResponseEntity<IncidentResponse> addCommentaire(
            @PathVariable Integer id,
            @Valid @RequestBody CommentaireRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Integer userId = Integer.parseInt(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(incidentService.addCommentaire(id, request.contenu(), userId));
    }
}
