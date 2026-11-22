package tarea4.models;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "avistamiento")
public class Avistamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "voluntario_id", nullable = false)
    private Voluntario voluntario;

    @ManyToOne
    @JoinColumn(name = "ave_id", nullable = false)
    private Ave ave;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    private String lugar;

    public Avistamiento() {
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Voluntario getVoluntario() { return voluntario; }
    public void setVoluntario(Voluntario voluntario) { this.voluntario = voluntario; }

    public Ave getAve() { return ave; }
    public void setAve(Ave ave) { this.ave = ave; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public String getLugar() { return lugar; }
    public void setLugar(String lugar) { this.lugar = lugar; }
}
