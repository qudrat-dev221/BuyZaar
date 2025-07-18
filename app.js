// Global variables
let component = {};
let containerDiv = document.querySelector("#app");

// 1. Initial Page Load Functionality
fetch("components.json")
  .then((res) => res.json())
  .then((res) => {
    component = res;

    // Initial URL load (VERY IMPORTANT)
    let urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get("page") || "home";
    containerDiv.innerHTML = component[page] || "<h2>404 - Page Not Found</h2>";
  })
  .catch((err) => {
    containerDiv.innerHTML = "<h2>Something went wrong while loading!</h2>";
    console.error(err);
  });

// 2. Routing Functionality
// Event delegation for dynamically loaded routing buttons
document.body.addEventListener("click", (e) => {
  const button = e.target.closest(".routingButton");
  if (button) {
    const eventName = button.dataset.name;
    alert(eventName);
    if (!eventName) return;
    let html = component[eventName];
    containerDiv.innerHTML = "";
    containerDiv.innerHTML = html;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    history.pushState({ page: eventName }, "", `?page=${eventName}`);
  }
});

// Back/Forward browser navigation
window.onpopstate = (event) => {
  let urlParams = new URLSearchParams(window.location.search);
  let page = event.state?.page || urlParams.get("page") || "home";
  let html = component[page] || "<h2>404 - Page Not Found</h2>";
  containerDiv.innerHTML = html;
};

// 3. Mobile Menu Toggle Functionality
(() => {
  let isOpen = false;
  let toggleButton = document.querySelector("#toggleMobile");
  let mobileMenu = document.querySelector(".slidemenu1");

  if (toggleButton && mobileMenu) {
    // Toggle button click
    toggleButton.addEventListener("click", () => {
      isOpen = !isOpen;

      // Toggle icon
      toggleButton.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark text-danger"></i>'
        : '<i class="fa-solid fa-bars text-danger"></i>';

      // Toggle menu visibility
      if (isOpen) {
        mobileMenu.classList.add("slidemenu2");
      } else {
        mobileMenu.classList.remove("slidemenu2");
      }
    });

    // Click on the slide menu itself to close it
    mobileMenu.addEventListener("click", () => {
      mobileMenu.classList.remove("slidemenu2");
      toggleButton.innerHTML = '<i class="fa-solid fa-bars text-danger"></i>';
      isOpen = false;
    });
  }
})();

// 4. Cart Functionality

// Grand Total Function
function updateGrandTotal() {
  let total = 0;
  document.querySelectorAll(".total-col strong").forEach((el) => {
    total += parseFloat(el.textContent.replace("Rs. ", "").replace(/,/g, ""));
  });
  let footer = document.querySelector(".cart-footer span");
  if (footer) footer.textContent = `Rs. ${total.toLocaleString()}`;
}

// Toggle Cart Visibility
function toggleCart() {
  document.querySelectorAll(".cartButton").forEach((icon) => {
    icon.addEventListener("click", () => {
      let cart = document.querySelector(".cart-container");
      if (cart) cart.classList.toggle("cart-container1");
    });
  });
}

// Update Cart Quantity
function updateCartQuantity() {
  document.querySelectorAll(".mycart").forEach((Element) => {
    Element.addEventListener("click", (event) => {
      let qtyElement = event.target.closest(".qty-col").querySelector("span");
      let num = parseInt(qtyElement.textContent);
      let cartItem = event.target.closest(".cart-item");
      let totalEl = cartItem.querySelector(".total-col strong");
      let currentTotal = parseFloat(
        totalEl.textContent.replace("Rs. ", "").replace(/,/g, "")
      );
      let unitPrice = currentTotal / num;

      if (event.target.textContent === "+") {
        num++;
      } else if (event.target.textContent === "-" && num > 1) {
        num--;
      }

      qtyElement.textContent = num;
      totalEl.textContent = `Rs. ${(unitPrice * num).toLocaleString()}`;

      // Update localStorage
      let index = cartItem.dataset.index;
      let data = JSON.parse(localStorage.getItem("data")) || [];
      if (data[index]) {
        data[index].quantity = num;
        data[index].total = unitPrice * num;
        localStorage.setItem("data", JSON.stringify(data));
      }

      updateGrandTotal();
    });
  });
}

// Update Cart Digits (item count)
function updateCartDigits() {
  let carts = document.querySelectorAll(".cartDelete");
  document.querySelectorAll(".cartButton span").forEach((Element) => {
    Element.textContent = carts.length;
  });
}

// Render cart items from localStorage
function showCarts() {
  const cartData = JSON.parse(localStorage.getItem("data")) || [];
  const cartContainer = document.querySelector("#cartContainer");
  cartContainer.innerHTML = ""; // clear previous content before re-rendering

  cartData.forEach((product, index) => {
    const newCart = document.createElement("div");
    newCart.classList.add("cart-item");
    newCart.dataset.index = index;

    newCart.innerHTML = `
      <div class="product-col">
        <img src="${product.image}" class="product-img" alt="${
      product.title
    }" />
        <strong>${product.title}</strong>
      </div>

      <div class="qty-col">
        <div class="d-flex align-items-center">
          <button class="btn quantity-btn mycart">-</button>
          <span class="mx-2">${product.quantity}</span>
          <button class="btn quantity-btn mycart">+</button>
        </div>
      </div>

      <div class="total-col"><strong>Rs. ${product.total.toLocaleString()}</strong></div>

      <div class="delete-col">
        <button class="btn btn-danger btn-sm cartDelete" data-index="${index}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    cartContainer.appendChild(newCart);
  });
  updateCartQuantity();
  updateCartDigits();
  updateGrandTotal();
}

// Add product to localStorage on "Add to Cart"
document.body.addEventListener("click", function (e) {
  if (e.target.closest("button")?.textContent.includes("Add to Cart")) {
    const image = document.querySelector(".detail-img").src;
    const title = document.querySelector("h2").textContent;
    const price = parseFloat(
      document.getElementById("unitPrice").textContent.replace(",", "")
    );
    const quantity = parseInt(document.getElementById("quantity").value);

    let data = JSON.parse(localStorage.getItem("data")) || [];

    const product = {
      image,
      title,
      price,
      quantity,
      total: price * quantity,
    };

    const exists = data.find((item) => item.title === title);

    if (!exists) {
      data.push(product);
      localStorage.setItem("data", JSON.stringify(data));
    }

    showCarts(); // Re-render updated cart
  }
});

// Delete cart item
document.body.addEventListener("click", function (e) {
  if (e.target.closest(".cartDelete")) {
    const index = e.target.closest(".cartDelete").dataset.index;
    let data = JSON.parse(localStorage.getItem("data")) || [];

    data.splice(index, 1); // Remove item by index
    localStorage.setItem("data", JSON.stringify(data));

    showCarts(); // Refresh cart UI
  }
});

// Show cart items on page load
window.addEventListener("DOMContentLoaded", showCarts);

// Initialize all cart functions
function initializeCartFunctions() {
  toggleCart();
  updateCartQuantity();
  updateCartDigits();
  updateGrandTotal();
}

initializeCartFunctions();

// 5. Countdown Timer Functionality
(() => {
  function updateCountdown(id) {
    const countdownElement = document.getElementById(id);
    if (!countdownElement) return;

    let time = countdownElement.textContent.split(":");
    let hours = parseInt(time[0]);
    let minutes = parseInt(time[1]);
    let seconds = parseInt(time[2]);

    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
    }
    if (minutes < 0) {
      minutes = 59;
      hours--;
    }
    if (hours < 0) {
      hours = 0;
      minutes = 0;
      seconds = 0;
    }

    countdownElement.textContent = `${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  setInterval(() => updateCountdown("countdown"), 1000);
  setInterval(() => updateCountdown("hotdeals-countdown"), 1000);
})();

// 6. Load More Cards Functionality
(() => {
  const loadmoreButton = document.querySelector(".loadmore");
  let isVisible = false;

  if (loadmoreButton) {
    loadmoreButton.addEventListener("click", () => {
      const cards = document.querySelectorAll(".ghum");

      cards.forEach((card) => {
        card.style.display = isVisible ? "none" : "block";
      });

      loadmoreButton.textContent = isVisible ? "LOAD MORE" : "HIDE";
      isVisible = !isVisible;
    });
  }
})();

// 7. Product Page Specific Functionality
document.body.addEventListener("click", (e) => {
  // Increase Qty
  if (e.target.closest("#increase")) {
    const qty = e.target.closest(".qty-box")?.querySelector("#quantity");
    const price = document.getElementById("unitPrice");
    const total = document.getElementById("totalPrice");

    if (qty && price && total) {
      qty.value = parseInt(qty.value) + 1;
      total.textContent = (
        parseFloat(price.textContent.replace(/[^0-9.]/g, "")) * qty.value
      ).toFixed(2);
    }
  }

  // Decrease Qty
  if (e.target.closest("#decrease")) {
    const qty = e.target.closest(".qty-box")?.querySelector("#quantity");
    const price = document.getElementById("unitPrice");
    const total = document.getElementById("totalPrice");

    if (qty && price && total && parseInt(qty.value) > 1) {
      qty.value = parseInt(qty.value) - 1;
      total.textContent = (
        parseFloat(price.textContent.replace(/[^0-9.]/g, "")) * qty.value
      ).toFixed(2);
    }
  }

  // Submit Review
  if (e.target.id === "submitReview") {
    const name = document.getElementById("reviewerName")?.value.trim();
    const comment = document.getElementById("userComment")?.value.trim();
    const rating = document.getElementById("userRating")?.value;

    if (!name || !comment) return alert("Name aur comment likho!");

    const letter = name[0].toUpperCase();
    const colors = ["bg-danger", "bg-success", "bg-warning", "bg-info"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const date = new Date().toLocaleDateString();

    const div = document.createElement("div");
    div.className = "review-card";
    div.innerHTML = `
      <div class="d-flex mb-3">
        <div class="me-3">
          <div class="review-avatar ${color}">${letter}</div>
        </div>
        <div>
          <h6 class="mb-1">${name} <small class="text-muted">· ${date}</small></h6>
          <div class="text-warning mb-1">
            ${'<i class="fas fa-star"></i>'.repeat(rating)}
            ${'<i class="far fa-star"></i>'.repeat(5 - rating)}
          </div>
          <p class="mb-0 text-dark">${comment}</p>
        </div>
      </div>`;

    document.getElementById("reviewsList")?.prepend(div);

    document.getElementById("reviewerName").value = "";
    document.getElementById("userComment").value = "";
    document.getElementById("userRating").value = "5";
    alert("Review submitted!");
  }
});
