package tarea4.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tarea4.dto.ResultadoBusqueda;
import tarea4.dto.ResultadoNota;
import tarea4.models.Avistamiento;
import tarea4.models.AvistamientoRepository;
import tarea4.models.Nota;
import tarea4.models.NotaRepository;

@Service
public class ApiService {

    public static final int NOTA_MIN = 1;
    public static final int NOTA_MAX = 7;
    private static final int LARGO_MAX_BUSQUEDA = 100;

    private final AvistamientoRepository avistamientoRepository;
    private final NotaRepository notaRepository;

    public ApiService(AvistamientoRepository avistamientoRepository, NotaRepository notaRepository) {
        this.avistamientoRepository = avistamientoRepository;
        this.notaRepository = notaRepository;
    }

    @Transactional(readOnly = true)
    public List<ResultadoBusqueda> buscarAvistamientos(String q) {
        String texto = q == null ? "" : q.trim();
        if (texto.length() > LARGO_MAX_BUSQUEDA) {
            texto = texto.substring(0, LARGO_MAX_BUSQUEDA);
        }
        if (texto.isEmpty()) {
            return List.of();
        }

        List<Avistamiento> lista = avistamientoRepository.buscar(texto);
        Map<Integer, Double> promedios = promedios(lista.stream().map(Avistamiento::getId).toList());

        return lista.stream()
                .map(av -> new ResultadoBusqueda(
                        av.getId(),
                        av.getVoluntario().getNombre(),
                        av.getFechaHora().toLocalDate().toString(),
                        av.getAve().getNombre(),
                        av.getVoluntario().getComuna().getNombre(),
                        promedios.get(av.getId())))
                .toList();
    }

   
    @Transactional
    public Optional<ResultadoNota> agregarNota(Integer avistamientoId, int valor) {
        if (valor < NOTA_MIN || valor > NOTA_MAX) {
            throw new IllegalArgumentException("La nota debe estar entre " + NOTA_MIN + " y " + NOTA_MAX + ".");
        }
        return avistamientoRepository.findById(avistamientoId).map(av -> {
            notaRepository.save(new Nota(av, valor));
            Double promedio = redondear(notaRepository.promedioPorAvistamiento(av.getId()));
            long total = notaRepository.countByAvistamientoId(av.getId());
            return new ResultadoNota(av.getId(), valor, promedio, total);
        });
    }

    private Map<Integer, Double> promedios(List<Integer> ids) {
        Map<Integer, Double> resultado = new HashMap<>();
        if (ids.isEmpty()) {
            return resultado;
        }
        for (Object[] fila : notaRepository.promediosPorAvistamiento(ids)) {
            resultado.put((Integer) fila[0], redondear((Double) fila[1]));
        }
        return resultado;
    }

    private Double redondear(Double valor) {
        return valor == null ? null : Math.round(valor * 10.0) / 10.0;
    }
}
