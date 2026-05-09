package com.helpdesk.service;

import com.helpdesk.dto.CategorieRequest;
import com.helpdesk.entity.Categorie;
import com.helpdesk.exception.ResourceNotFoundException;
import com.helpdesk.repository.CategorieRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategorieService {

    private final CategorieRepository categorieRepository;

    public CategorieService(CategorieRepository categorieRepository) {
        this.categorieRepository = categorieRepository;
    }

    public List<CategorieWithCount> getAllCategories() {
        List<Object[]> results = categorieRepository.findAllWithIncidentCount();
        return results.stream()
            .map(row -> new CategorieWithCount(
                (Categorie) row[0],
                (Long) row[1]
            ))
            .toList();
    }

    public Categorie getCategorieById(Integer id) {
        return categorieRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée: " + id));
    }

    public Categorie createCategorie(CategorieRequest request) {
        Categorie categorie = new Categorie(request.libelle(), request.description());
        return categorieRepository.save(categorie);
    }

    public Categorie updateCategorie(Integer id, CategorieRequest request) {
        Categorie categorie = getCategorieById(id);
        categorie.setLibelle(request.libelle());
        categorie.setDescription(request.description());
        return categorieRepository.save(categorie);
    }

    public void deleteCategorie(Integer id) {
        Categorie categorie = getCategorieById(id);
        long count = categorieRepository.countIncidentsByCategorieId(id);
        if (count > 0) {
            throw new IllegalStateException(
                "Impossible de supprimer la catégorie: " + count + " incidents y sont liés");
        }
        categorieRepository.delete(categorie);
    }

    public record CategorieWithCount(Categorie categorie, long incidentCount) {}
}
