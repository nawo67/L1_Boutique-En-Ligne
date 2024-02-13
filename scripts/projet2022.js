// Lucas Deloison & Alexandre Hemelsdael

// ===  variables globales === 

// constantes
const MAX_QTY = 9;

//  tableau des produits à acheter
const cart = []
// total actuel des produits dans le panier
let total = 0;


// === initialisation au chargement de la page ===

/**
* Création du Magasin, mise à jour du total initial
* Mise en place du gestionnaire d'événements sur filter
*/
const init = function () {
	createShop();
	updateTotal();
	const filter = document.getElementById("filter");
	filter.addEventListener("keyup", filterDisplaidProducts);
}
window.addEventListener("load", init);



// ==================== fonctions utiles ======================= 

/**
* Crée et ajoute tous les éléments div.produit à l'élément div#boutique
* selon les objets présents dans la variable 'catalog'
*/
const createShop = function () {
	const shop = document.getElementById("boutique");
	for(let i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	}
}

/**
* Crée un élément div.produit qui posséde un id de la forme "i-produit" où l'indice i 
* est correpond au paramètre index
* @param {Object} product - le produit pour lequel l'élément est créé
* @param {number} index - l'indice (nombre entier) du produit dans le catalogue (utilisé pour l'id)
* @return {Element} une div.produit
*/
const createProduct = function (product, index) {
	// créer la div correpondant au produit
	const divProd = document.createElement("div");
	divProd.className = "produit";
	// fixe la valeur de l'id pour cette div
	divProd.id = index + "-product";
	// crée l'élément h4 dans cette div
	divProd.appendChild(createBlock("h4", product.name));
	
	// Ajoute une figure à la div.produit... 
	// /!\ non fonctionnel tant que le code de createFigureBlock n'a pas été modifié /!\ 
	divProd.appendChild(createFigureBlock(product));

	// crée la div.description et l'ajoute à la div.produit
	divProd.appendChild(createBlock("div", product.description, "description"));
	// crée la div.prix et l'ajoute à la div.produit
	divProd.appendChild(createBlock("div", product.price, "prix"));
	// crée la div.controle et l'ajoute à la div.produit
	divProd.appendChild(createOrderControlBlock(index));
	return divProd;
}

//appendChild : crée un élément pour le rajouter dans la section voulue


/** Crée un nouvel élément avec son contenu et éventuellement une classe
 * @param {string} tag - le type de l'élément créé (example : "p")
 * @param {string} content - le contenu html de l'élément a créé  (example : "bla bla")
 * @param {string} [cssClass] - (optionnel) la valeur de l'attribut 'classe' de l'élément créé
 * @return {Element} élément créé
 */
const createBlock = function (tag, content, cssClass) {
	const element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className =  cssClass;
	}
	element.innerHTML = content;
	return element;
}

//innerHTML : permet de récupérer un morceau de code HTML dans un élément donné

/** Met à jour le montant total du panier en utilisant la variable globale total
 */
const updateTotal = function () {
	const montant = document.getElementById("montant");
	montant.textContent = total;
}
//textContent : affiche le contenu de total
// ======================= fonctions à compléter =======================


/**
* Crée un élément div.controle pour un objet produit
* @param {number} index - indice du produit considéré
* @return {Element}
* TODO : AJOUTER les gestionnaires d'événements
*/
const createOrderControlBlock = function (index) {
	const control = document.createElement("div");
	control.className = "controle";

	// crée l'élément input permettant de saisir la quantité
	const input = document.createElement("input");
	input.id = index + "-qte";
	input.type = "number";
	input.step = "1";
	input.value = "0";
	input.min = "0";
	input.max = MAX_QTY.toString();

	// TODO :  Q5 mettre en place le gestionnaire d'événément pour input permettant de contrôler les valeurs saisies
	control.appendChild(input);
	input.addEventListener("change", verifQuantity)

	// Crée le bouton de commande
	const button = document.createElement("button");
	button.className = 'commander';
	button.id = index + "-order";
	control.appendChild(button);

	return control;
}


/** 
* Crée un élément figure correspondant à un produit
* @param {Object} product -  le produit pour lequel la figure est créée
* @return {Element}
*/
const createFigureBlock = function (product) {
	const element = document.createElement("figure")
	const img = document.createElement("img")
	img.src = product.image
	img.alt = product.name
	element.appendChild(img)// on ajoute image à l'élément element
	return element
}

/** 
* @todo Q8
*/

const orderProduct = function () {
	const idx = parseInt(this.id); // récupère l'entier de l'id de -qte
	const qty = parseInt(document.getElementById(idx + "-qte").value);//récupère l'entier de la quantité
	if (qty > 0) {
		addProductToCart(idx, qty); // ajoute un produit au panier
		//TODO gérer la remise à zéro de la quantité après la commande
		const input = document.getElementById(idx + "-qte")
		input.value = 0
		// changement de l'opacité du bouton chariot
		const button2 = document.getElementById(idx + "-order")
		button2.style.opacity = '0.25'
		// et tous les comportements du bouton représentant le chariot 
		const button = document.getElementById(idx+'-order')
		button.removeEventListener("click",orderProduct)
	}
}


// ======================= fonctions à coder =======================

/**
* @todo Q6- Q7
*/
const verifQuantity = function () {
	const input = document.getElementById(this.id) //récupère l'entier de l'input -qte
	const button = document.getElementById(parseInt(this.id)+"-order") //récupère l'id du bouton chariot
	if (input.value <= 0 || input.value > 9){
		input.value = 0
		button.style.opacity = 0.25
		button.removeEventListener("click", orderProduct)
	// si la quantité est inférieure à 0 et supérieure à 9 la quantité vaut 0 et l'opacité 0.25 et on supprime l'article du panier
	}
	else if (input.value != 0){
		button.style.opacity = 1
		button.addEventListener("click", orderProduct)
	}
	// si la quantité est comprise entre 1 et 9 l'opacité vaut 1 et on ajoute l'article dans le panier
}
/**
* @todo Q9
* @param {number} index
* @param {number} qty
*/
const addProductToCart = function (index, qty) {
	const produit = document.getElementById(index+"-product")
	const panier = document.getElementsByClassName("achats")
	// gère si le produit est déjà dans le panier ou pas
	if (document.getElementById(index+'-achat'))
	{
		const divAchat = document.getElementById(index+"-achat")
		divAchat.children[3].textContent = parseInt(divAchat.children[3].textContent) + qty
	}
	else
	{
		const achat = createBlock("div",'','achat')
		achat.setAttribute("id",index+"-achat")
		panier[0].appendChild(achat)

		//on ajoute les éléments 1 par 1 dans notre div consacré à un produit du panier
		const divAchat = document.getElementById(index+"-achat")
		divAchat.appendChild(createBlock("img", ''));
		divAchat.children[0].src = produit.childNodes[1].firstChild.src
		divAchat.children[0].setAttribute('width',32+'px')

		divAchat.appendChild(createBlock("p", '&nbsp'));
		//&nbsp : mettre un espace entre les caractères pour plus de lisibilité

		divAchat.appendChild(createBlock("h4", produit.childNodes[2].textContent));

		divAchat.appendChild(createBlock("div",'',"quantite"))
		divAchat.children[3].textContent = produit.childNodes[4].firstChild.value

		divAchat.appendChild(createBlock("p", '&nbsp'));

		divAchat.appendChild(createBlock("div",produit.childNodes[3].textContent,"prix"))

		divAchat.appendChild(createBlock("div","","controle"))
		const button = document.createElement("button");
		button.className = 'retirer';
		button.id = index + "-remove";
		divAchat.children[6].appendChild(button)
		button.addEventListener('click',() => retraitachat(index, divAchat))
	}
	// on gère l'ajustement du montant
	const montant = document.getElementById('montant')
	montant.textContent = parseInt(montant.textContent) + parseInt(produit.childNodes[3].textContent) * qty
}

/** 
* Supprime le produit présent dans notre panier et rectifie le montant
* @param {Object} produit -  le produit qui va être supprimé
* @param {Object} index - indice de notre produit
*/
const retraitachat = function(index, produit){

	const produitinitial = document.getElementById(index+"-product") 
	const montant = document.getElementById('montant')
	montant.textContent = parseInt(montant.textContent) - (parseInt(produitinitial.childNodes[3].textContent) * parseInt(produit.children[3].textContent))
	produit.remove()

}


/**
* @todo Q10
*/
const filterDisplaidProducts = function () {
	const input = document.getElementById(this.id)// récupère l'entier de input -qte
	const boutique = document.getElementById('boutique') //pareil avec l'id boutique
	tailleboutique = boutique.children.length // une liste avec la longueur des fils de boutique
	for(i = 0;i < tailleboutique; i++){
		const produit = document.getElementById(i + '-product')
		const name = produit.children[0].textContent
		if (name.indexOf(input.value) >= 0){
			produit.style.display = ''
		}
		// si le name de produit est supérieur à 0 alors on affiche l'article 
		else{
			produit.style.display = 'none'
		}
		// Sinon on affiche rien
	}
}