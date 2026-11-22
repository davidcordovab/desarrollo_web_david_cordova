(function () {
    'use strict';

    var ESPERA_MS = 300; 
    var NOTA_MIN = 1;
    var NOTA_MAX = 7;

    var form = document.getElementById('form-buscador');
    var input = document.getElementById('q');
    var estado = document.getElementById('estado');
    var contenedorTabla = document.getElementById('contenedor-tabla');
    var cuerpo = document.getElementById('resultados');

    var temporizador = null;
    var controlador = null;   

    

    function mostrarEstado(mensaje, esError) {
        estado.textContent = mensaje;
        estado.className = esError ? 'error' : '';
    }

    function limpiarTabla() {
        cuerpo.textContent = '';
        contenedorTabla.hidden = true;
    }

    function formatearNota(nota) {
        return nota === null || nota === undefined ? '-' : Number(nota).toFixed(1);
    }

    
    function plegar(texto) {
        var resultado = '';
        for (var i = 0; i < texto.length; i++) {
            resultado += texto.charAt(i).normalize('NFD').charAt(0).toLowerCase().charAt(0);
        }
        return resultado;
    }


    function resaltar(elemento, texto, consulta) {
        elemento.textContent = '';
        var t = plegar(texto);
        var q = plegar(consulta);
        var desde = 0;
        var pos = q ? t.indexOf(q, desde) : -1;
        while (pos !== -1) {
            if (pos > desde) {
                elemento.append(texto.slice(desde, pos));
            }
            var marca = document.createElement('mark');
            marca.textContent = texto.slice(pos, pos + q.length);
            elemento.append(marca);
            desde = pos + q.length;
            pos = t.indexOf(q, desde);
        }
        if (desde < texto.length) {
            elemento.append(texto.slice(desde));
        }
    }

    

    async function buscar(consulta) {
        if (controlador) {
            controlador.abort();      
        }
        controlador = new AbortController();
        mostrarEstado('Buscando…', false);

        try {
            var resp = await fetch('/api/avistamientos/buscar?q=' + encodeURIComponent(consulta), {
                headers: { 'Accept': 'application/json' },
                signal: controlador.signal
            });
            if (!resp.ok) {
                throw new Error('HTTP ' + resp.status);
            }
            var datos = await resp.json();
            mostrarResultados(datos, consulta);
        } catch (e) {
            if (e.name === 'AbortError') {
                return;
            }
            limpiarTabla();
            mostrarEstado('No se pudo realizar la búsqueda. Intenta nuevamente.', true);
        }
    }

    function mostrarResultados(datos, consulta) {
        cuerpo.textContent = '';
        if (datos.length === 0) {
            contenedorTabla.hidden = true;
            mostrarEstado('No se encontraron avistamientos que contengan «' + consulta + '».', false);
            return;
        }
        datos.forEach(function (av) {
            cuerpo.appendChild(crearFila(av, consulta));
        });
        contenedorTabla.hidden = false;
        mostrarEstado(datos.length === 1 ? '1 avistamiento encontrado.' : datos.length + ' avistamientos encontrados.', false);
    }

    function crearFila(av, consulta) {
        var fila = document.createElement('tr');

        var tdVoluntario = document.createElement('td');
        resaltar(tdVoluntario, av.voluntario, consulta);

        var tdDia = document.createElement('td');
        tdDia.textContent = av.dia;

        var tdAve = document.createElement('td');
        resaltar(tdAve, av.ave, consulta);

        var tdComuna = document.createElement('td');
        resaltar(tdComuna, av.comuna, consulta);

        var tdNota = document.createElement('td');
        var spanNota = document.createElement('span');
        spanNota.className = 'nota-valor';
        spanNota.textContent = formatearNota(av.nota);
        tdNota.appendChild(spanNota);

        var tdAccion = document.createElement('td');
        mostrarBotonEvaluar(tdAccion, av, spanNota);

        fila.append(tdVoluntario, tdDia, tdAve, tdComuna, tdNota, tdAccion);
        return fila;
    }


    function mostrarBotonEvaluar(tdAccion, av, spanNota) {
        tdAccion.textContent = '';
        var boton = document.createElement('button');
        boton.type = 'button';
        boton.textContent = 'Evaluar';
        boton.addEventListener('click', function () {
            mostrarSelector(tdAccion, av, spanNota);
        });
        tdAccion.appendChild(boton);
    }

    function mostrarSelector(tdAccion, av, spanNota) {
        tdAccion.textContent = '';

        var select = document.createElement('select');
        select.setAttribute('aria-label', 'Selecciona una nota entre ' + NOTA_MIN + ' y ' + NOTA_MAX);

        var vacia = document.createElement('option');
        vacia.value = '';
        vacia.textContent = 'Elige nota';
        vacia.selected = true;
        vacia.disabled = true;
        select.appendChild(vacia);

        for (var n = NOTA_MIN; n <= NOTA_MAX; n++) {
            var opcion = document.createElement('option');
            opcion.value = String(n);
            opcion.textContent = String(n);
            select.appendChild(opcion);
        }

        var cancelar = document.createElement('button');
        cancelar.type = 'button';
        cancelar.className = 'secundario';
        cancelar.textContent = 'Cancelar';
        cancelar.addEventListener('click', function () {
            mostrarBotonEvaluar(tdAccion, av, spanNota);
        });

        select.addEventListener('change', function () {
            var valor = Number(select.value);
            // Validación en el cliente (el servidor vuelve a validar)
            if (!Number.isInteger(valor) || valor < NOTA_MIN || valor > NOTA_MAX) {
                mostrarEstado('La nota debe ser un entero entre ' + NOTA_MIN + ' y ' + NOTA_MAX + '.', true);
                return;
            }
            select.disabled = true;
            cancelar.disabled = true;
            enviarNota(av, valor, spanNota).finally(function () {
                mostrarBotonEvaluar(tdAccion, av, spanNota);
            });
        });

        tdAccion.append(select, cancelar);
        select.focus();
    }

    async function enviarNota(av, valor, spanNota) {
        try {
            var resp = await fetch('/api/avistamientos/' + encodeURIComponent(av.id) + '/notas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ nota: valor })
            });
            var datos = await resp.json().catch(function () { return {}; });
            if (!resp.ok) {
                throw new Error(datos.error || 'No se pudo guardar la nota.');
            }
            
            spanNota.textContent = formatearNota(datos.promedio);
            av.nota = datos.promedio;
            mostrarEstado('Nota ' + valor + ' guardada para el avistamiento de ' + av.ave + '. Promedio actual: '
                + formatearNota(datos.promedio) + ' (' + datos.totalNotas + ' '
                + (datos.totalNotas === 1 ? 'nota' : 'notas') + ').', false);
        } catch (e) {
            mostrarEstado(e.message || 'No se pudo guardar la nota.', true);
        }
    }

    -

    form.addEventListener('submit', function (evento) {
        evento.preventDefault();   
    });

    input.addEventListener('input', function () {
        clearTimeout(temporizador);
        var consulta = input.value.trim();
        if (consulta === '') {
            if (controlador) {
                controlador.abort();
            }
            limpiarTabla();
            mostrarEstado('Escribe para buscar avistamientos.', false);
            return;
        }
        temporizador = setTimeout(function () {
            buscar(consulta);
        }, ESPERA_MS);
    });
})();
