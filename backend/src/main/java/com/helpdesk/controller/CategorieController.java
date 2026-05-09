package com.helpdesk.controller;

import com.helpdesk.dto.CategorieRequest;
import com.helpdesk.entity.Categorie;
import com.helpdesk.service.CategorieService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategorieController {

    private final CategorieService categorieService;

    public CategorieController(CategorieService categorieService) {
        this.categorieService = categorieService;
    }

    @GetMapping
    public ResponseEntity<List<CategorieService.CategorieWithCount>> getAllCategories() {
        return ResponseEntity.ok(categorieService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categorie> getCategorie(@PathVariable Integer id) {
        return ResponseEntity.ok(categorieService.getCategorieById(id));
    }

    @PostMapping
    public ResponseEntity<Categorie> createCategorie(@Valid @RequestBody CategorieRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categorieService.createCategorie(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categorie> updateCategorie(@PathVariable Integer id,
                                                      @Valid @RequestBody CategorieRequest request) {
        return ResponseEntity.ok(categorieService.updateCategorie(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategorie(@PathVariable Integer id) {
        categorieService.deleteCategorie(id);
        return ResponseEntity.noContent().build();
    }
}
