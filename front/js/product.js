let api = "http://localhost:3000/api/products";
let item;


/* RECUPERE LES INFORMATIONS DU PRODUIT */
function getProductData() {
    let urlString = window.location.href;
    let url = new URL(urlString);
    let id = url.searchParams.get("id");

    fetch((api + "/" + id), {
        method: "GET"
    }).then(res => res.json()).then(data => {
        generateProduct(data);
    }).catch(function () {
        alert("Une erreur est survenue, veuillez réessayer ulterieurement");
    });
}


/* INITIE LA CONSTRUCTION DU PRODUIT */
function generateProduct(product) {

    /* AJOUT DE L'IMAGE DU PRODUIT */
    function generateImage(product) {
        let productImage = document.createElement("img");
        productImage.src = product.imageUrl;
        productImage.alt = product.altTxt;

        let imageContainer = document.getElementsByClassName("item__img");
        imageContainer[0].appendChild(productImage);
    }
    generateImage(product);

    /* AJOUT DU TITRE DU PRODUIT */
    function generateTitle(product) {
        let productTitle = document.createTextNode(product.name);

        let titleContainer = document.getElementById("title");
        titleContainer.appendChild(productTitle);
    }
    generateTitle(product);

    /* AJOUT DU PRIX DU PRODUIT */
    function generatePrice(product) {
        let productPrice = document.createTextNode(product.price);

        let priceContainer = document.getElementById("price");
        priceContainer.appendChild(productPrice);
    }
    generatePrice(product);

    /* AJOUT DE LA DESCRIPTION DU PRODUIT */
    function generateDescription(product) {
        let productDescription = document.createTextNode(product.description);

        let descriptionContainer = document.getElementById("description");
        descriptionContainer.appendChild(productDescription);
    }
    generateDescription(product);

    /* AJOUT DE LA LISTE DES COULEURS DU PRODUIT */
    function generateColorsList(product) {
        let colorsContainer = document.getElementById("colors");
        product.colors.forEach(color => {
            let productColor = document.createElement("option");
            productColor.value = color;
            let textValue = document.createTextNode(color);
            productColor.appendChild(textValue);

            colorsContainer.appendChild(productColor);
        });
    }
    generateColorsList(product);

    /* AJOUT DU TITRE DU PRODUIT */
    function generatePageTitle(product) {
        document.title = product.name;
    }
    generatePageTitle(product);

    item = product;
}

getProductData();

document.getElementById('quantity').addEventListener('change', function (e) {
    checkQuantity(e.target);
});

/* VÉRIFIE LA VALIDITÉ DE LA QUANTITÉ */
function checkQuantity(inputQuantity) {
    if (inputQuantity.value.match(/^(0|[1-9]\d*)$/)) {
        if (inputQuantity.value > 100 || inputQuantity.value < 1) {
            inputQuantity.value = 1;
        }
    } else {
        inputQuantity.value = 1;
    }
}

/*********************************************************************************/


/* AJOUTE LE PRODUIT DANS LE PANIER (LOCALSTORAGE) */
function addToCart() {
    if (isColorValid() && isQuantityValid()) {
        let products = [];

        if (localStorage.getItem('products')) {
            products = JSON.parse(localStorage.getItem('products'));
        }

        if (products.length != 0) {

            if (isAlreadyIn(products)) {
                increaseQuantity(products);
            } else {
                products.push(addItemToList(item));
            }

        } else {
            products.push(addItemToList(item));
        }

        localStorage.setItem('products', JSON.stringify(products));

        alert(parseInt(document.getElementById("quantity").value) + " " + item.name +
            " - " + document.getElementById("colors").value + " a/ont été ajouté a votre panier.");

    } else {
        if (isQuantityValid()) {
            alert('Couleur invalide.');
        } else if (isColorValid()) {
            alert('Quantité invalide.');
        } else {
            alert('Couleur invalide.\nQuantité invalide.')
        }
    }
}


/* INCREMENTE LA QUANTITEE DU PRODUIT DEJA DANS LE PANIER */
function increaseQuantity(products) {
    products.forEach(cart => {
        if ((cart._id == item._id) && (cart.color == document.getElementById("colors").value)) {
            cart.quantity = parseInt(cart.quantity) + parseInt(document.getElementById("quantity").value);
            if (cart.quantity > 100) {
                cart.quantity = 100;
            }
        }
    });
}

/* VERIFIE SI LE PRODUIT EST DEJA DANS LE PANIER → Boolean */
function isAlreadyIn(products) {
    return (products.some(e => e._id === item._id && e.color === document.getElementById("colors").value)) ? true : false;
}


/* AJOUTE LE PRODUIT A LA LISTE DES PRODUITS → String */
function addItemToList(item) {
    return {
        '_id': item._id, 'imageUrl': item.imageUrl,
        'altTxt': item.altTxt, 'name': item.name, 'price': item.price, 'color': document.getElementById("colors").value,
        'quantity': document.getElementById("quantity").value
    };
}

/* VERIFIE SI LA COULEUR EST VALIDE → Boolean */
function isColorValid() {
    let dropDown = document.getElementById('colors');

    return (dropDown.options[dropDown.selectedIndex].value.length == 0) ? false : true;
}

/* VERIFIE SI LA QUANTITÉE EST VALIDE → Boolean */
function isQuantityValid() {
    return (document.getElementById('quantity').value > 0 && document.getElementById('quantity').value < 101) ? true : false;
}

document.getElementById('addToCart').addEventListener("click", function () {
    addToCart();
});
