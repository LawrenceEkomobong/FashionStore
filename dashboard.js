let hintShown = false;

//The code below is the drop down for the first menu icon in the navbar //

const menu = document.getElementById("menu");
const menuDropDown = document.getElementById("dropdown");
const closeBtn = document.getElementById("Close-drop-down");

menu.addEventListener("click", function () {
    menuDropDown.style.left = "0";
});

closeBtn.addEventListener("click", function () {
    menuDropDown.style.left = "-280px";
});

document.addEventListener("click", function (e) {

    if (
        e.target !== menu &&
        !menuDropDown.contains(e.target)
    ) {
        menuDropDown.style.left = "-280px";
    }

});

//Below is the code for Log out button functionality//
document.getElementById("logout").addEventListener("click", function (e) {
  e.preventDefault();
  // redirect to login page
  window.location.replace("Login.html");
});
const desktopLogout = document.getElementById("logout-desktop");

if (desktopLogout) {

desktopLogout.addEventListener("click", function(e){

e.preventDefault();

window.location.replace("Login.html");

});

}




/* fetching products from the Json file */

const url = "data.json";

const cart = [];

let totalAmount = 0;


async function fetchData(url) {

  try {

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Response is not ok");
    }

    const data = await response.json();

    const div = document.querySelector(".images");

    let productsHTML = "";

data.forEach((el, index) => {

  productsHTML += `
  <div class="product-card">

    <img src="${el.images}" loading="lazy">

    <h3>${el.name}</h3>

    <p>${el.Price}</p>

    <button class="cart-btn" data-id="${index}">
      Add To Cart
    </button>

    <div class="quantity-box">
      <button class="minus">-</button>
      <span>0</span>
      <button class="plus">+</button>
    </div>

  </div>
  `;
});

div.innerHTML = productsHTML;
div.style.visibility = "visible";

  } catch (err) {

    console.log(err);

  }

}

fetchData(url);



/* CART DROPDOWN */

const cartIcon = document.getElementById("cart-icon");
const dropdown = document.querySelector(".cart-dropdown");

cartIcon.addEventListener("click", (e) => {

  e.stopPropagation();

  dropdown.style.display =
    dropdown.style.display === "block"
      ? "none"
      : "block";

});

dropdown.addEventListener("click", (e) => {

  e.stopPropagation();

});

document.body.addEventListener("click", () => {

  dropdown.style.display = "none";

});



/* ADD TO CART */

document.addEventListener("click", (e) => {

  if (!e.target.classList.contains("cart-btn")) return;

  const card = e.target.closest(".product-card");

  const name = card.querySelector("h3").textContent;
  const price = card.querySelector("p").textContent;

  const existingItem =
    cart.find(item => item.name === name);

  if (!existingItem) {

    cart.push({
      name,
      price,
      quantity: 1
    });

  }

  updateCart();

  e.target.style.display = "none";

  const qtyBox =
    card.querySelector(".quantity-box");

  qtyBox.style.display = "flex";

});


/* PLUS AND MINUS in the add to cart functionality */

document.addEventListener("click", (e) => {

  const card =
    e.target.closest(".product-card");

  if (!card) return;

  const name =
    card.querySelector("h3").textContent;

  const item =
    cart.find(product => product.name === name);

  if (!item) return;

  if (e.target.classList.contains("plus")) {

    const span =
      e.target.previousElementSibling;

    let value =
      Number(span.textContent);

    value++;

    span.textContent = value;

    item.quantity = value;

    updateCart();

  }

  if (e.target.classList.contains("minus")) {

    const span =
      e.target.nextElementSibling;

    let value =
      Number(span.textContent);

    if (value > 0) {

      value--;

      span.textContent = value;

      item.quantity = value;

      updateCart();

    }

  }

});




/* UPDATE CART */

function updateCart() {

  const cartContent =
    document.querySelector(".cart-content");

  const payBtn =
    document.getElementById("pay-btn");

  let total = 0;

  cartContent.innerHTML = "";

  cart.forEach(item => {

    if (item.quantity > 0) {

      cartContent.innerHTML += `
      
      <div class="cart-item">

        <p><strong>${item.name}</strong></p>

        <p>${item.price}</p>

        <p>Quantity: ${item.quantity}</p>

        <hr>

      </div>

      `;

      const numericPrice =
        Number(
          item.price
            .replace("#", "")
            .replace(",", "")
            .replace(" naira", "")
        );

      total += numericPrice * item.quantity;

    }

  });

  totalAmount = total;

  const hasItems =
    cart.some(item => item.quantity > 0);

  if (!hasItems) {

    cartContent.innerHTML =
      "Your cart is empty.";

    payBtn.style.display = "none";

    return;

  }

  payBtn.style.display = "block";

  cartContent.innerHTML += `
  
    <h3>
      Total: ₦${total.toLocaleString()}
    </h3>

  `;

}




/* PAY NOW BUTTON */

const payBtn =
document.getElementById("pay-btn");

payBtn.addEventListener("click", () => {
  if (totalAmount <= 0) {

    showAlert("Your cart is empty");

    return;

  }

  document.querySelector(".checkout-form")
    .style.display = "block";

});




//listens for a click on any part of the page and closes the checkoutForm //

document.addEventListener("click", (e) => {
  const checkoutForm = document.querySelector(".checkout-form");
  const payBtn = document.getElementById("pay-btn");

  // if form is not visible, do nothing
  if (checkoutForm.style.display !== "block") return;

  // if user clicked inside the form, do nothing
  if (checkoutForm.contains(e.target)) return;

  // if user clicked the pay button, do nothing (so it doesn't instantly close)
  if (payBtn.contains(e.target)) return;

  // otherwise close the form
  checkoutForm.style.display = "none";
});



/* CHECKOUT FORM */

const checkoutBtn =
document.getElementById("checkout-btn");

checkoutBtn.addEventListener("click", () => {

  const name =
    document.getElementById("customer-name").value.trim();

  const email =
    document.getElementById("customer-email").value.trim();

  if (!name || !email) {

    showAlert("Please fill all fields");

    return;

  }

  payWithPaystack(email);

});



/* PAYSTACK */

function payWithPaystack(email) {

  let handler = PaystackPop.setup({

    key: "pk_test_fecd1c99bd1f2280c2df71dec7ad034ab8934c40",

    email: email,

    amount: totalAmount * 100,

    currency: "NGN",

    callback: function(response) {

      showAlert(
        "Payment successful! Reference: " +
        response.reference
      );

    },

    onClose: function() {

      showAlert("Transaction cancelled");

    }

  });

  handler.openIframe();

}


//Code for alerts //

function showAlert(message, type = "success") {

  const alert = document.getElementById("alert");

  alert.textContent = message;

  // color based on type
  alert.style.background =
    type === "error" ? "#e74c3c" : "#111";

  alert.classList.add("show");

  setTimeout(() => {
    alert.classList.remove("show");
  }, 2500);

}


//email js code //
const SERVICE_ID='service_met3e0y';
      const TEMPLATE_ID='template_bssk34y';
      const PUBLIC_KEY='X_-sn64XwLluHTdAO';
      
// Initialize once
emailjs.init({ publicKey: PUBLIC_KEY });

// Select your elements
const contactDiv = document.querySelector('.email');
const sendBtn = document.querySelector('.send-btn');


// On button click
sendBtn.addEventListener('click', function () {
  const nameVal = contactDiv.querySelector('[name="name"]').value.trim();
  const emailVal = contactDiv.querySelector('[name="email"]').value.trim();
  const messageVal = contactDiv.querySelector('[name="message"]').value.trim();

  if (!nameVal || !emailVal || !messageVal) {
   showAlert('Please fill in all fields.');
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailVal)) {
    showAlert('Please enter a valid email address.');
    return;
  }

  const templateParams = { name: nameVal, email: emailVal, message: messageVal };

  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
    .then(() => {
      showAlert('✅ Message sent successfully!');
      contactDiv.querySelectorAll('input, textarea').forEach(el => el.value = '');
    })
    .catch((err) => {
      console.error(err);
      showAlert('❌ Failed to send. Check console.');
    })
    .finally(() => {
      sendBtn.disabled = false;
      sendBtn.textContent = 'SEND MESSAGE';
    });
});