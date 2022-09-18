// Función para seleccionar DOM
export function selector(el, all = false) {
	return all ? [...document.querySelectorAll(el)] : document.querySelector(el)
}
// Función para insertar HTML
export function html(el, html, all = false) {
	return selector(el, all).innerHTML = html
}
//
export function on(el, type, listener, all = false) {
	let element = selector(el, all)
	if (element) {
		if (all) {
		 	element.forEach(e => e.addEventListener(type, listener))
		} else {
		  	element.addEventListener(type, listener)
		}
	}
}

/**
 * Creamos una plantilla predeterminada
*/
export const modal = new function() {
	this.title = '',
	this.body = '',
	this.button = '',
	this.template = `<div class="card__modal--content">
		<div class="card">
			<div class="card__title"></div>
			<div class="card__body"></div>
			<div class="card__buttons"></div>
		</div>
   </div>`,
   this.init = () => {
   	document.body.className += ' modal'
   	html('#mymodal', this.template)
   	html('.card__title', this.title)
   	html('.card__body', this.body)
   	html('.card__buttons', this.button)
   },
   this.close = () => {
   	document.body.classList.remove('modal')
   	html('#mymodal', '')
   }
}