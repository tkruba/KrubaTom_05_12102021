let api = "http://localhost:3000/api/products/order";


/* LANCE LA GENERATION DU PANIER */
function generateCart() {
    if (!isCartEmpty()) {
        let itemList = getItemList().sort((a, b) => a.name.localeCompare(b.name));
        itemList.forEach(item => {
            generateItem(item);
        });
    } else {
        calculateCart();
    }
}


/* VERIFIE SI LE PANIER EST VIDE → Boolean */
function isCartEmpty() {
    return (localStorage.getItem('products')) ? false : true;
}


/* RECUPERE LA LISTE DES PRODUITS DANS LE LOCALSTORAGE → Array [Object] */
function getItemList() {
    return JSON.parse(localStorage.getItem('products'));
}


/* LANCE LA GENERATION D'UNE CARTE PRODUIT */
function generateItem(item) {

    /* CRÉATION DE LA BALISE ARTICLE → Object */
    function itmArticle(item) {
        let article = document.createElement('article');
        article.dataset.id = item._id;
        article.classList.add('cart__item');
        return article;
    }
    let itemArticle = itmArticle(item);

    /* CRÉATION DE LA BALISE IMG → Object */
    function itmImg(item) {
        let div = document.createElement('div');
        div.classList.add('cart__item__img');
        let img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = item.altTxt;
        div.appendChild(img);
        return div;
    }
    let itemImg = itmImg(item);

    itemArticle.appendChild(itemImg);

    /* CRÉATION DE LA BALISE DIV (CONTENT) → Object */
    function itmContent(item) {
        let content = document.createElement('div');
        content.classList.add('cart__item__content');

        /* CRÉATION DE LA BALISE DIV (TITLE & PRICE) → Object */
        function itmTitlePrice(item) {
            let div = document.createElement('div');
            div.classList.add('cart__item__content__titlePrice');
            let title = document.createElement('h2');
            let titleText = document.createTextNode(item.name + ' - ' + item.color);
            title.appendChild(titleText);
            let price = document.createElement('p');
            let priceText = document.createTextNode((item.price * item.quantity) + ' €');
            price.appendChild(priceText);

            div.appendChild(title);
            div.appendChild(price);

            return div;
        }
        let itemTitlePrice = itmTitlePrice(item);

        content.appendChild(itemTitlePrice);

        /* CRÉATION DE LA BALISE DIV (SETTINGS) → Object */
        function itmSettings(item) {
            let div = document.createElement('div');
            div.classList.add('cart__item__content__settings');

            /* CRÉATION DE LA BALISE DIV (QUANTITÉ) → Object */
            function itmSettingsQuantity(item) {
                let div = document.createElement('div');
                div.classList.add('cart__item__content__settings__quantity');
                let quantity = document.createElement('p');
                let quantityText = document.createTextNode('Qté:');
                quantity.appendChild(quantityText);

                div.appendChild(quantity);

                let quantityInput = document.createElement('input');
                quantityInput.classList.add('itemQuantity');
                quantityInput.type = 'number';
                quantityInput.name = 'itemQuantity';
                quantityInput.min = 1;
                quantityInput.max = 100;
                quantityInput.value = item.quantity;

                div.appendChild(quantityInput);

                return div;
            }
            let settingsQuantity = itmSettingsQuantity(item);

            div.appendChild(settingsQuantity);

            /* CRÉATION DE LA BALISE DIV (DELETE) → Object */
            function itmSettingsDelete() {
                let div = document.createElement('div');
                div.classList.add('cart__item__content__settings__delete');
                let del = document.createElement('p');
                del.classList.add('deleteItem');
                let delText = document.createTextNode('Supprimer');
                del.appendChild(delText);
                div.appendChild(del);
                return div;
            }
            let settingsDelete = itmSettingsDelete();

            div.appendChild(settingsDelete);
            return div;
        }
        let itemSettings = itmSettings(item);
        content.appendChild(itemSettings);
        return content;
    }
    let itemContent = itmContent(item);
    itemArticle.appendChild(itemContent);

    let container = document.getElementById('cart__items');
    container.appendChild(itemArticle);
    calculateCart();
}

/* CALCULE LA QUANTITÉ DE PRODUIT TOTALE ET DU PRIX TOTAL  */
function calculateCart() {
    let totalPrice = 0;
    let totalQuantity = 0;

    let items = document.querySelectorAll('.cart__item');
    items.forEach(item => {
        totalPrice += JSON.parse(localStorage.getItem('products')).filter(function (e) {
            return e._id === item.dataset.id;
        })[0].price * item.querySelector('.itemQuantity').value;
    });

    items.forEach(item => {
        totalQuantity += parseInt(item.querySelector('.itemQuantity').value);
    })

    let totalPriceContainer = document.getElementById('totalPrice');
    let totalPriceContainerText = document.createTextNode(totalPrice);
    if (totalPriceContainer.hasChildNodes) {
        totalPriceContainer.removeChild(totalPriceContainer.lastChild);
    }
    totalPriceContainer.appendChild(totalPriceContainerText);

    let totalQuantityContainer = document.getElementById('totalQuantity');
    let totalQuantityContainerText = document.createTextNode(totalQuantity);
    if (totalQuantityContainer.hasChildNodes) {
        totalQuantityContainer.removeChild(totalQuantityContainer.lastChild);
    }
    totalQuantityContainer.appendChild(totalQuantityContainerText);

    document.querySelectorAll('.itemQuantity').forEach(function (e) {
        e.addEventListener('change', function (e) {
            updateQuantity(e.target);
        });
    });

    document.querySelectorAll('.deleteItem').forEach(function (e) {
        e.addEventListener('click', function (e) {
            removeItem(e.target);
        });
    });

}

/* MET A JOUR LA QUANTITÉ DU PRODUIT CHOISIS */
function updateQuantity(inputQuantity) {
    let cartItem = inputQuantity.closest('.cart__item');
    let _id = cartItem.dataset.id;
    let color = inputQuantity.closest('.cart__item__content').firstChild.firstChild.textContent.split(' - ')[1];

    let cart = JSON.parse(localStorage.getItem('products'));

    if (inputQuantity.value.match(/^(0|[1-9]\d*)$/) && (inputQuantity.value <= 100 && inputQuantity.value >= 1)) {

        cart.forEach(item => {
            if ((item._id === _id) && (item.color === color)) {
                item.quantity = parseInt(inputQuantity.value);

                calculatePrice(inputQuantity, parseInt(inputQuantity.value), item.price);
            }
        });
        localStorage.setItem('products', JSON.stringify(cart));
        calculateCart();
    } else {
        let oldQuantity = cart.filter(function (e) {
            return (e._id === _id && e.color === color);
        })[0].quantity;
        inputQuantity.value = oldQuantity;
    }
}

/* MET A JOUR LE PRIX AFFICHÉ DU PRODUIT CHOISIS */
function calculatePrice(product, productQuantity, unitPrice) {
    let newPrice = productQuantity * unitPrice;
    
    let price = product.closest('.cart__item__content').firstChild.lastChild;
    let priceText = document.createTextNode(newPrice + ' €');
    price.removeChild(price.lastChild);
    price.appendChild(priceText);
}

/* RETIRE LE PRODUIT CHOISIS DU PANIER */
function removeItem(removeButton) {
    let cartItem = removeButton.closest('.cart__item');
    let _id = cartItem.dataset.id;
    let color = removeButton.closest('.cart__item__content').firstChild.firstChild.textContent.split(' - ')[1];

    let cart = JSON.parse(localStorage.getItem('products'));
    if (cart) {
        let newCart = cart.filter(function (e) {
            return !(e._id === _id && e.color === color);
        });

        if (newCart.length != 0) {
            localStorage.setItem('products', JSON.stringify(newCart));
        } else {
            localStorage.clear();
        }
        cartItem.remove();
    }
    calculateCart();
}


/* ******************************* */



/* AFFICHE L'ID DE COMMANDE SUR LA PAGE DE CONFIRMATION */
function displayConfirmation() {
    let urlString = window.location.href;
    let url = new URL(urlString);
    let id = url.searchParams.get("orderId");

    let orderId = document.getElementById('orderId');
    let orderIdText = document.createTextNode(id);
    orderId.appendChild(orderIdText);
}

/* VERIFIE LES ERREURS DANS LE FORMULAIRE ET LES AFFICHES OU LES RETIRE */
function checkError(formInput) {
    if (document.getElementById(formInput.id + 'ErrorMsg').firstChild) {
        document.getElementById(formInput.id + 'ErrorMsg')
            .removeChild(document.getElementById(formInput.id + 'ErrorMsg').lastChild);
    }

    switch (formInput.id) {
        case 'firstName':
            if (!formInput.value.match(/^[a-zA-Z \-]+$/)) {
                let errorMsg = document.createTextNode('Prénom invalide.');
                document.getElementById('firstNameErrorMsg').appendChild(errorMsg);
            }
            break;
        case 'lastName':
            if (!formInput.value.match(/^[a-zA-Z \-]+$/)) {
                let errorMsg = document.createTextNode('Nom invalide.');
                document.getElementById('lastNameErrorMsg').appendChild(errorMsg);
            }
            break;
        case 'address':
            if (!formInput.value.match(/^[a-zA-Z0-9 \-]+$/)) {
                let errorMsg = document.createTextNode('Addresse invalide.');
                document.getElementById('addressErrorMsg').appendChild(errorMsg);
            }
            break;
        case 'city':
            if (!formInput.value.match(/^[a-zA-Z \-]+$/)) {
                let errorMsg = document.createTextNode('Ville invalide.');
                document.getElementById('cityErrorMsg').appendChild(errorMsg);
            }
            break;
        case 'email':
            if (!formInput.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                let errorMsg = document.createTextNode('Email invalide.')
                document.getElementById('emailErrorMsg').appendChild(errorMsg);
            }
            break;
    }
}

let formInputList = ['firstName', 'lastName', 'address', 'city', 'email'];

/*
    SI PAGE DE CONFIRMATION APPEL LA FONCTION displayConfirmation
    SINON GENERE LA PAGE DE PANIER
*/
if (location.pathname.includes('confirmation')) {
    displayConfirmation();
} else {
    formInputList.forEach(formInput => {
        document.getElementById(formInput).addEventListener('change', function (e) {
            checkError(e.target);
        });
    });

    document.forms[0].addEventListener('submit', function (e) {
        e.preventDefault();
        if (!isCartEmpty()) {
            if (document.getElementById('firstName').value.match(/^[a-zA-Z \-]+$/) &&
                document.getElementById('lastName').value.match(/^[a-zA-Z \-]+$/) &&
                document.getElementById('address').value.match(/^[a-zA-Z0-9 \-]+$/) &&
                document.getElementById('city').value.match(/^[a-zA-Z \-]+$/) &&
                document.getElementById('email').value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {

                let contact = {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    email: document.getElementById('email').value
                };

                let productsIdList = [];
                document.querySelectorAll('.cart__item').forEach(product => {
                    productsIdList.push(product.dataset.id);
                });

                fetch((api), {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({ contact, products: productsIdList })
                }).then(res => res.json()).then(data => {
                    localStorage.clear();
                    window.location.href = "confirmation.html?orderId=" + data.orderId;
                }).catch(function () {
                    alert("Une erreur est survenue, veuillez réessayer ultérieurement.")
                });

            } else {
                formInputList.forEach(inputList => {
                    checkError(document.getElementById(inputList));
                });
            }
        } else {
            alert('Votre panier est vide. Impossible de passer commande.');
        }
    });
    generateCart();
}