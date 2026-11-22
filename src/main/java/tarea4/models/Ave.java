package tarea4.models;

import jakarta.persistence.*;

@Entity
@Table(name = "ave")
public class Ave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    public Ave() {}
    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
}