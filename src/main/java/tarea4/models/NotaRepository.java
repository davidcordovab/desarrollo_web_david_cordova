package tarea4.models;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Integer> {

    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.avistamiento.id = :id")
    Double promedioPorAvistamiento(@Param("id") Integer id);

    long countByAvistamientoId(Integer avistamientoId);

    @Query("SELECT n.avistamiento.id, AVG(n.nota) FROM Nota n "
         + "WHERE n.avistamiento.id IN :ids GROUP BY n.avistamiento.id")
    List<Object[]> promediosPorAvistamiento(@Param("ids") Collection<Integer> ids);
}
