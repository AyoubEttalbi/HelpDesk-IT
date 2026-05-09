package com.helpdesk.service;

import com.helpdesk.dto.DashboardStats;
import com.helpdesk.entity.Incident;
import com.helpdesk.enums.Statut;
import com.helpdesk.repository.IncidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final IncidentRepository incidentRepository;

    public DashboardService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public DashboardStats getStats() {
        List<Incident> allIncidents = incidentRepository.findAllWithAssociations();
        long total = allIncidents.size();

        List<DashboardStats.StatutCount> parStatut = new ArrayList<>();
        for (Statut s : Statut.values()) {
            long count = allIncidents.stream().filter(i -> i.getStatut() == s).count();
            parStatut.add(new DashboardStats.StatutCount(s.name(), count));
        }

        Map<Integer, List<Incident>> byTechnicien = allIncidents.stream()
            .filter(i -> i.getTechnicien() != null)
            .collect(Collectors.groupingBy(i -> i.getTechnicien().getIdUser()));

        List<DashboardStats.TechnicienCount> parTechnicien = byTechnicien.entrySet().stream()
            .map(e -> new DashboardStats.TechnicienCount(
                e.getValue().get(0).getTechnicien().getNom() + " " + e.getValue().get(0).getTechnicien().getPrenom(),
                e.getKey(),
                e.getValue().size()))
            .toList();

        Map<Integer, List<Incident>> byCategorie = allIncidents.stream()
            .collect(Collectors.groupingBy(i -> i.getCategorie().getIdCategorie()));

        List<DashboardStats.CategorieCount> parCategorie = byCategorie.entrySet().stream()
            .map(e -> new DashboardStats.CategorieCount(
                e.getValue().get(0).getCategorie().getLibelle(),
                e.getKey(),
                e.getValue().size()))
            .toList();

        Double tempsMoyen = allIncidents.stream()
            .filter(i -> i.getStatut() == Statut.CLOS && i.getDateResolution() != null)
            .mapToLong(i -> ChronoUnit.HOURS.between(i.getDateCreation(), i.getDateResolution()))
            .average()
            .orElse(0.0);

        return new DashboardStats(total, parStatut, parTechnicien, parCategorie, tempsMoyen);
    }
}
