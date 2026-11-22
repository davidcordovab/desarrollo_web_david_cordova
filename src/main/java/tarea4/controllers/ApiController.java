package tarea4.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

import tarea4.dto.ResultadoBusqueda;
import tarea4.services.ApiService;

@RestController


@RequestMapping("/api")
public class ApiController {

    private final ApiService apiService;

    public ApiController(ApiService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/avistamientos/buscar")
    public List<ResultadoBusqueda> buscar(@RequestParam(name = "q", defaultValue = "") String q) {
        return apiService.buscarAvistamientos(q);
    }




    @PostMapping("/avistamientos/{id}/notas")
    public ResponseEntity<?> agregarNota(@PathVariable Integer id, @RequestBody JsonNode body) {
        JsonNode campo = body.get("nota");
        if (campo == null || !campo.isInt()) {
            return error(HttpStatus.BAD_REQUEST, "La nota debe ser un número entero.");
        }
        int valor = campo.intValue();
        if (valor < ApiService.NOTA_MIN || valor > ApiService.NOTA_MAX) {
            return error(HttpStatus.BAD_REQUEST,
                    "La nota debe estar entre " + ApiService.NOTA_MIN + " y " + ApiService.NOTA_MAX + ".");
        }
        return apiService.agregarNota(id, valor)
                .<ResponseEntity<?>>map(r -> ResponseEntity.status(HttpStatus.CREATED).body(r))
                .orElseGet(() -> error(HttpStatus.NOT_FOUND, "El avistamiento no existe."));
    }

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String mensaje) {
        return ResponseEntity.status(status).body(Map.of("error", mensaje));
    }
}



