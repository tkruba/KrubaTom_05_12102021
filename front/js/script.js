let api = "http://localhost:3000/api/products"


/* RECUPERE LA LISTE DES PRODUITS ET LANCE LEUR GENERATION */
function getProductList() {
    fetch(api, {
        method: "GET"
    }).then(res => res.json()).then(data => {
        data.forEach(product => {
            generateProduct(product);
        });
    }).catch(function() {
        alert("Une erreur est survenue, veuillez réessayer ulterieurement");
    });
};

/* GÉNERE UN PRODUIT ET L'AJOUTE A LA LISTE DES PRODUITS */
function generateProduct(product) {

    /* CRÉATION DE LA BALISE A → Object */
    function generateA(product) {
        let a = document.createElement("a");
        a.href = "./product.html?id=" + product._id;
    
        return a;
    }
    let productA = generateA(product);

    /* CRÉATION DE LA BALISE ARTICLE → Object */
    function generateArticle() {
        let article = document.createElement("article");
        return article;
    }
    let productArticle = generateArticle();

    /* CRÉATION DE LA BALISE IMG → Object */
    function generateImage(product) {
        let image = document.createElement("img");
        image.src = product.imageUrl;
        image.alt = product.altTxt;
    
        return image;
    }
    let productImage = generateImage(product);

    /* CRÉATION DE LA BALISE H3 (TITLE) → Object */
    function generateTitle(product) {
        let h3 = document.createElement("h3");
        let text = document.createTextNode(product.name);
        h3.classList.add("productName");
        h3.appendChild(text);
    
        return h3;
    }
    let productTitle = generateTitle(product);

    /* CRÉATION DE LA BALISE P (DESCRIPTION) → Object */
    function generateDescription(product) {
        let p = document.createElement("p");
        let text = document.createTextNode(product.description);
        p.classList.add("productDescription");
        p.appendChild(text);
    
        return p;
    }
    let productDescription = generateDescription(product);

    productArticle.appendChild(productImage);
    productArticle.appendChild(productTitle);
    productArticle.appendChild(productDescription);
    
    productA.appendChild(productArticle);

    /* AJOUTE LE PRODUIT A LA LISTE DE PRODUIT */
    function addProductToList(product) {
        let container = document.getElementById('items');
        container.appendChild(product);
    }
    addProductToList(productA);
}

getProductList();