
const formulario= document.getElementById("registro-formulario");

formulario.addEventListener("submit", function(event) {event.preventDefault();

 
    const nombre= document.getElementById("nombre").value.trim(); 
    
    const apellido= document.getElementById("apellido").value.trim();

    const letras= /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    const rut= document.getElementById("rut").value.trim();

    const formatorut = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;

    const celular= document.getElementById("celular").value.trim();

    const formatocel= /^9\d{8}$/;

    const correo= document.getElementById("correo").value.trim();

    const formatocorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const region= document.getElementById("region").value.trim();

    const comuna= document.getElementById("comuna").value.trim();


    if (nombre === "") {
        alert("El nombre es obligatorio");
        return;}

    else if (!letras.test(nombre)) {
        alert("El nombre solo puede contener letras");
        return;}

    if (apellido === "") {
        alert("El apellido es obligatorio");
        return;}
    
    else if (!letras.test(apellido)){
        alert("El apellido solo puede contener letras");
        return;}

    if (rut === ""){
        alert("El rut es obligatorio");
        return;}
    
    else if(!formatorut.test(rut)){
        alert("El rut debe tener un formato 12.345.678-9 (incluyendo puntos y guión)");
        return;}

    if (celular === "") {
        alert("El celular es obligatorio");
        return;}

    else if (!formatocel.test(celular)){
        alert("El celular debe tener 9 digitos y partir con el 9, ejemplo: 912345678");
        return;}

    if (correo === ""){
        alert("El correo es obligatorio");
        return;}
    
    else if (!formatocorreo.test(correo)){
        alert("Ingrese un correo válido, ejemplo: usuario@correo.com");
        return;}

    if (region === ""){
        alert("La región es obligatoria");
        return;}
    
    else if(!letras.test(region)) {
        alert("La región solo puede contener letras");
        return;}

    if (comuna === ""){
        alert("La comuna es obligatoria");
        return;}

    else if (!letras.test(comuna)){
        alert("La comuna solo puede contener letras");
        return;}
    
    
    
    alert("Registro exitoso");
    formulario.reset();

    });




