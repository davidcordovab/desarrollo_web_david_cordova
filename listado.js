
const formulario= document.getElementById("filtro-formulario");  

const seccionResultados = document.getElementById("seccion-resultados");

formulario.addEventListener("submit", function(event) {event.preventDefault(); 

    const tipoave= document.getElementById("tipo-ave").value.trim();

    const ordenarpor= document.getElementById("ordenar-por").value.trim();

    const orden= document.getElementById("orden").value.trim();


    if (tipoave=== "--seleccionar--"){
        alert("Debe seleccionar el tipo de ave para poder filtrar");
        return;}

    if (ordenarpor=== "--seleccionar--"){
        alert("Debe seleccionar por qué ordenar para poder filtrar");
        return;}
    
    if (orden=== "--seleccionar--"){
        alert("Debe seleccionar el orden para poder filtrar");
        return;}
    
    seccionResultados.style.display = "block";


});