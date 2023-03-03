const url = "https://cms.northernsun.no/wp-json/wc/store/products";
const productContainer = document.querySelector(".products");

const queryString = new URLSearchParams(window.location.search);
const productId = queryString.get("product");

async function getProducts() {
  try {
    const response = await fetch(url);
    const getResults = await response.json();
    createHTML(getResults);
  } catch (error) {
    console.log(error);
  }
}
getProducts();

function createHTML(products) {
  products.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
  const filteredProducts = products.filter(
    (product) => product.price >= 10 && product.price <= 111
  );
  products.forEach(function (product) {
    productContainer.innerHTML += `<div class= 'product' >
        <h2><a onclick="getID('${product.id}')">${product.name}</a></h2>
       <a onclick="getID('${product.id}')">${product.name} <img src ="${product.images[0].src}"> </a>
        <p>Price: ${product.prices.price}$</p>
        </div>`;
  });
}
function getID(id) {
  localStorage.setItem("id", JSON.stringify(id));
  window.location.href = "product.html";
}
showProduct();
function showProduct() {
  // Create a new HTML document
  const dataId = JSON.parse(localStorage.getItem("id"));
  fetch(`https://cms.northernsun.no/wp-json/wc/store/products`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const post = data.find((p) => p.id == dataId);
      console.log(post);

      const postContent = post.permalink;
      const pageTitle =
        post.permalink.charAt(0).toUpperCase() + post.permalink.slice(1);
      const imagesHtml = post.images    
        .map((image) => `<img src="${image.src}" alt="${image.alt}">`)
        .join("");
      const add_to_cart = {
        text: "Add to basket",
        description: "Add “C&C” to your basket",
        url: "?add-to-cart=21",
        minimum: 1,
        maximum: 9999,
        multiple_of: 1,
      };
      // Add the blog post content to the new HTML document
      document.querySelector("title").innerHTML = pageTitle;
      document.querySelector(".detailsOfProduct").innerHTML = `
  <h2>${post.name}</h2>
  <div>${post.description}</div>
  <section class="images-store">${imagesHtml}</section>
  <div class='divBasket'>${post.price_html} <div></div>
  <a href="${dataId.add_to_cart?.url}"><button type="submit">${add_to_cart.text}</button></a>
  </div>
  <style>.divBasket {
	padding: 10px;
	justify-content: center;
}
.divBasket button{
	color: #e78b11;
	padding: 8px;
	background-color: darkblue;
    </style>
	

  
`;
    })
    .catch((error) => console.log(error));
}
