import { selector, html, on, modal,isAndroid, isiOS, isMobile } from './app.js';
import { listaPalabras } from './listaPalabras.js';

let lista;
const actualizar = () => {
	// Comprobamos que la lista no exista
	if(localStorage.getItem('secretsWords') === null) {
		// Como no existe, la guardamos
		localStorage.setItem('secretsWords', JSON.stringify(listaPalabras));
		// Insertamos en la variable, la lista
		lista = listaPalabras
	// Si existe insertamos la lista obtenida en la variable
	} else lista = JSON.parse(localStorage.getItem('secretsWords'));
}

// De esta forma limpiamos el preload
const preload = () => html("#preload", "")

// Cargamos el fondo
const bodybg = (bg = '.bgStart') => document.body.className = bg.replace('.', '')

// Cargamos la pantalla
const screen = (page, display = 'block') => {
	// Ocultamos todas las pantallas
	selector('.principal', true).map( div => div.style.display = 'none')
	// Y mostramos la pantalla que debemos mostrar
	selector('.principal' + page).style.display = display
}

// Dejamos un rango de 1s al cargar
setTimeout(() => {
	preload()
	bodybg()
	screen('.inicio', 'grid')
}, 1000)

// Obtenemos todos los botones
on(".button", "click", btn => {
	// Si el atributo contiene el "data-page"
	if(!!btn.target.dataset.page) {
		bodybg(btn.target.dataset.bg)
		screen(btn.target.dataset.page, 'grid')
	}
	// Cargamos algunas funciones necesarias 
	if(btn.target.dataset.page === '.agregando') listaTotal()
	if(btn.target.dataset.page === '.jugando') reiniciarJuego()
	// Si el atributo contiene el "data-action"
	if(!!btn.target.dataset.action) {
		const fn = btn.target.dataset.action
		switch (fn) {
			case 'agregarPalabra':
				agregarPalabra()
			break;
			case 'reiniciarLista':
				reiniciarLista()
			break;
			case 'finalizar':
				finalizar()
			break;
		}
	}
}, true)

/**
 * Eventos del teclado
*/
on("#newWords", "keyup", () => {
	// Forzamos a las mayusculas por las minusculas
	let nuevovalor = selector("#newWords").value.toLowerCase()
	// Reemplazamos letras con tilde o ñ por letras comunes
	.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
	// Reemplazamos números/simbolos por vacio
	.replace(/[^a-z- ]/g, "").replace(/\s+/g, "-");
	// Reemplazamos el contenido actual
	selector("#newWords").value = nuevovalor
})

/**
 * Desde este punto creamos las funciones para
 * Agregar palabras, eliminar palabra, jugar, etc
*/
const actualizarLista = () => {
	actualizar()
	listaTotal()
}
// Reiniciamos la lista a 0, un array vacio [...]
const reiniciarLista = () => {
	localStorage.setItem('secretsWords', JSON.stringify([]))
	actualizarLista()
}
// Función para en listar las palabras
const listaTotal = () => {
	// Iniciamos la lista guardada
	actualizar()
	let li = '';
	// Recorremos todos los items de la lista
	lista.forEach((i, c) => li += `<li class="lista-item" id="item${c}">${i}</li>`)
	// Insertamos los items en la lista
	html("ul.lista", li)
	html("h3 > strong", lista.length)
	// Dependiendo de cual seleccionaremos, es la que borraremos!
	on(".lista-item", "click", e => {
		// Limpiamos la lista
		html("ul.lista", "")
		// Guardamos la nueva lista editada
		localStorage.setItem('secretsWords', 
			// Para guardarlo en formato de Array y filtramos la lista, excetuando la que quitamos
			JSON.stringify(lista.filter(item => item !== e.target.textContent))
		);
		// Actualizamos la lista guardada, pero ya modificada y volvemos a cargar la lista modificada
		actualizarLista()
	}, true)
}
const verifyWord = array => {
	let n = []
	array.map( a => {
		if(!lista.includes(a)) n.push(a)
	})
	return n
}
// Agregamos palabra/s a la lista
const agregarPalabra = () => {
	const texto = selector("#newWords").value.split('-')
	let conjuntoPalabras = new Set()
	conjuntoPalabras.clear();
	texto.map( w => {
		if(w.length >= 4) {
			conjuntoPalabras.add(w)
			let nuevaLista = Array.from(conjuntoPalabras)
			if(lista.length !== 0) nuevaLista = [...lista, ...verifyWord(nuevaLista)]
			localStorage.setItem('secretsWords', JSON.stringify(nuevaLista));
			// Actualizamos la lista guardada, pero ya modificada y volvemos a cargar la lista modificada
			actualizarLista()
		}
	})
}
// Seleccionamos una palabra aleatoria
let newArray = [];
let aleatorio;
let intentos = selector(".bx > b").textContent;
const random = () => {
	const listar = JSON.parse(localStorage.getItem('secretsWords'))
	aleatorio = listar[Math.round(Math.random() * listar.length)]
}

/**
 * Función para iniciar el juego
*/
const iniciarJuego = () => {
	// Creamos un arreglo de la palabra aleatoria
	newArray = aleatorio.split('')
	let html = '';
	// Creamos input por cada letra existente
   for (let i = 0; i < aleatorio.split('').length; i++) html += `<input type="text">`
   // Agregamos los campos creados
   selector(".inputs").innerHTML = html;
}

if ( isMobile ) {
	selector(".inputs > input:first-child").focus()
}
/**
 * Con esta función juntamos las letras escrita por el usuario
*/
const palabraEscrita = () => {
	let campos = selector(".inputs > input", true)
	let armar = []
	campos.map( has => {
		// Obtenemos todos los campos que no esten vació
		if(has.value !== '') armar.push(has.value)
	})
	// Unimos todas las letras
	return armar.join('')
}

/**
 * Esta función sirve para reiniciar el juego,
 * o para comenzar uno nuevo en caso de que pierda|gane
*/
const reiniciarJuego = (act = false) => {
	// Eligimos nueva palabra
	random();
	// Iniciamos nuevo juego
	iniciarJuego();
	// Reiniciamos algunos valores
	intentos = 10;
	html(".bx > b", intentos);
	html(".letras", "");
	// Reiniciamos el ahorcado
	html(".ahorcado", '<div class="cuerpo-contenedor"></div>')
	// Quitamos el modal
	if(act) html("#mymodal", "")
}

/**
 * Mostramos modal si gana o pierde
*/
const accionModal = bool => {
	modal.title = bool ? 'Ganaste' : 'Perdiste';
	modal.body = bool ? 'Felicidades, ganaste el juego!' : 'Lo siento, era <b>' + aleatorio.toUpperCase() + '</b>';
	modal.button = `<div class="card--button">Nuevo juego</div>`;
	modal.init();
	on(".card--button", "click", () => reiniciarJuego(true))
}

/**
 * Función para comprobar si la letra es incorrecta
*/
const errores = tecla => {
	// Variable para continuar 
	let continuar = true;
	// Creamos span para añadir letra equivocada
	const span = document.createElement("span")
	span.classList.add('letra')
	span.innerHTML = tecla
	// Obtenemos todas las letras equivocadas
	const existen = selector(".letras > span", true)
	// Recorremos la lista de letras erroneas
	for(let init = 0; init < existen.length; init++) continuar = (existen[init].textContent !== tecla);
	// Si la letra NO existe, continuamos
	if(continuar) {
		selector(".letras").appendChild(span)
		html(".bx > b", intentos)
		// Si la cantidad de intentos ha llegado a 0
		if(intentos === 0) accionModal(false)
	}
}

/**
 * Función para crear el muñeco
*/
const crearMuneco = () => {
	// Todas las partes del cuerpo y horca
	let muneco = ["piernaDer", "brazoDer", "piernaIzq", "brazoIzq", "cuerpo", "cabeza", "soga", "arriba", "palo", "base"];
	// Creamos un div
	const div = document.createElement("div")
	div.classList.add('iguales')
	// Para saber si creamos horca o muñeco
	div.className += " " + muneco[intentos];
	selector(".ahorcado" + (intentos >= 6 ? "" : " > .cuerpo-contenedor")).appendChild(div)
}

/**
 * Evento de teclado
 * Solo admite desde la "A" hasta la "Z"
*/
document.onkeypress = tecla => {
	if(tecla.which >= 97 || tecla.which <= 122) {
		// Si la letra coincide con la palabra aleatoria
		if(newArray.includes(tecla.key)) {
			let campos = selector(".inputs > input", true)
			for(let pos = 0; pos < newArray.length; pos++) {
				// Solo si son iguales, las agregamos
				if(newArray[pos] === tecla.key) {
					campos[pos].setAttribute("value", newArray[pos])
				}
			}
		// Si no coincide, restamos puntos.
		} else {
			intentos = intentos - 1;
			crearMuneco()
			errores(tecla.key)
		}
	}
	// Una vez completada la palabra, ejecutamos el modal
	if(palabraEscrita() === aleatorio) accionModal(true)
}

const finalizar = () => {
	modal.title = 'Que lastima';
	modal.body = 'Bueno pero la palabra era <b>' + aleatorio.toUpperCase() + '</b>';
	modal.button = `<div class="card--button">Salir</div>`;
	modal.init();
	on(".card--button", "click", () => location.reload())
}