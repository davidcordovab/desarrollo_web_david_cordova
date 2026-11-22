package tarea4.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AppController {

    @GetMapping("/")
    public String index() {
        return "redirect:/buscador";
    }

    @GetMapping("/buscador")
    public String buscador() {
        return "buscador";
    }
}
