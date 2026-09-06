
const formulario= document.getElementById("avistamiento-formulario");  

formulario.addEventListener("submit", function(event) {event.preventDefault(); 

    const tipoave= document.getElementById("tipoave").value.trim();

    const nombreave= document.getElementById("nombreave").value.trim();

    const lugar= document.getElementById("lugar").value.trim();

    const letras= /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;


    const hora= document.getElementById("hora").value.trim();

    const evidencia= document.getElementById("evidencia").value;



    if (tipoave=== "") {
        alert("El tipo de ave es obligatorio");
        return;}

    else if (!letras.test(tipoave)){
        alert("El tipo de ave puede contener solo letras");
        return;}

    if (nombreave=== "") {
        alert("El nombre del ave es obligatorio");
        return;}
    
    else if (!letras.test(nombreave)) {
        alert("El nombre del ave puede contener solo letras");
        return;}
    
    if (lugar=== "") {
        alert("El nombre del lugar es obligatorio");
        return;}
        
    else if (!letras.test(lugar)) {
        alert("El nombre del lugar puede contener solo letras");
        return;}


    const fecha= document.getElementById("fecha").value.trim(); 

    if (fecha=== ""){
        alert("La fecha es obligatoria");
        return;}

    const fechaelegida= new Date(fecha);
    const fechahoy= new Date();
    const fechamin= new Date("1900-01-01");

    if (fechaelegida > fechahoy){
        alert("Fecha inválida, no puede ser una fecha del futuro");
        return;}
    else if (fechaelegida< fechamin) {
        alert("La fecha es demasiado antigua, debe ser posterior al 1900");
        return;}

    if (hora=== ""){
        alert("La hora es obligatoria");
        return;}

    if (evidencia=== ""){
        alert("Es obligatorio subir un tipo de evidencia en foto o video");
        return;}

    alert("Avistamiento registrado con éxito!");
    formulario.reset();


});