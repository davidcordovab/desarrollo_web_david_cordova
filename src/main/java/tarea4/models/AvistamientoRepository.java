package tarea4.models;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvistamientoRepository extends JpaRepository<Avistamiento, Integer> {

    List<Avistamiento>
    findByAve_NombreContainingIgnoreCaseOrVoluntario_NombreContainingIgnoreCaseOrVoluntario_Comuna_NombreContainingIgnoreCase(
            String ave, String voluntario, String comuna);

    default List<Avistamiento> buscar(String texto) {
        return findByAve_NombreContainingIgnoreCaseOrVoluntario_NombreContainingIgnoreCaseOrVoluntario_Comuna_NombreContainingIgnoreCase(
                texto, texto, texto);
    }
}
