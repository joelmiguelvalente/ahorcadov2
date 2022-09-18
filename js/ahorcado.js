import { selector, html, on, modal } from './app.js';
import { listaPalabras } from './listaPalabras.js';

let newlista;
const actualizar = () => {
	if(localStorage.getItem('secretsWords') === null) {
		// Como no existe
		localStorage.setItem('secretsWords', JSON.stringify(listaPalabras));
		newlista = listaPalabras
	} else newlista = JSON.parse(localStorage.getItem('secretsWords'));
}

setTimeout(() => {
	document.body.className = 'bgStart'
	selector(".principal.agregando").style.display = 'grid'
	html("#preload", "")
	init()
}, 500)

// Función para inicar la página y cambiar el fondo
const init = () => {
	on(".button", 'click', e => {
		if(!!e.target.dataset.page) {
			// Cambiamos el fondo
			document.body.className = e.target.dataset.bg
			selector(".principal.agregando").style.display = 'grid'
			html("#app", app[e.target.dataset.page])
			if(e.target.dataset.page === 'agregar') {
				listatotal()
			}
		} else {
			if(e.target.dataset.action === 'reboot') rebootList()
			if(e.target.dataset.action === 'addWord') {
				addWords()
				selector("#newWords").innerHTML = ""
			}
		}
		init()
	}, true)
}

const rebootList = () => {
	localStorage.setItem('secretsWords', JSON.stringify([]))
	actualizar()
	listatotal()
};

// Función para en listar las palabras
const listatotal = () => {
	on("#newWords", "keyup", () => {
		// Forzamos a las mayusculas por las minusculas
		let nuevovalor = selector("#newWords").value.toLowerCase();
		// Reemplazamos letras con tilde o ñ por letras comunes
		nuevovalor = nuevovalor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		// Reemplazamos números/simbolos por vacio
		nuevovalor = nuevovalor.replace(/[^a-z- ]/g, "").replace(/\s+/g, "-");
		selector("#newWords").value = nuevovalor
	})
	// Iniciamos la lista guardada
	actualizar()
	let li = '';
	// Recorremos todos los items de la lista
	newlista.forEach((i, c) => li += `<li class="lista-item" id="item${c}">${i}</li>`)
	// Insertamos los items en la lista
	html("ul.lista", li)
	html("h3 > strong", newlista.length)
	// Dependiendo de cual seleccionaremos, es la que borraremos!
	on(".lista-item", "click", e => {
		// Limpiamos la lista
		html("ul.lista", "")
		// Guardamos la nueva lista editada
		localStorage.setItem('secretsWords', 
			// Para guardarlo en formato de Array
			JSON.stringify(
				// Filtramos la lista, excetuando la que quitamos
				newlista.filter(item => item !== e.target.textContent)
			)
		);
		// Actualizamos la lista guardada, pero ya modificada
		actualizar()
		// Volvemos a cargar la lista modificada
		listatotal()
	}, true)
}

let i = 0;
const addWords = () => {
	if(i === 0) {
		const text = selector("#newWords").value.split('-')
		let setWords = new Set()
		setWords.clear();
		// hola-ejemplos-agregar-mucho-mas-ejemplos
		text.map( word => setWords.add(word))
	   console.log(Array.from(setWords))
	}
   console.log(i++)
   
}
