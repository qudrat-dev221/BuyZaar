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
    // alert(eventName);
    if (!eventName) return;
    let html = component[eventName];
    containerDiv.innerHTML = "";
    showLoader();
    setTimeout(() => {
      containerDiv.innerHTML = html;

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      hideLoader();
    }, 300);

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

const showLoader = () => {
  document.getElementById("loader").classList.remove("d-none");
};

const hideLoader = () => {
  document.getElementById("loader").classList.add("d-none");
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
          <span class="mx-2 quntity-cartItem">${product.quantity}</span>
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

// Buy Now Button LOgic and rendering

document.body.addEventListener("click", function (e) {
  const clicked = e.target.closest("button");

  if (clicked && clicked.textContent.trim().includes("Buy Now")) {
    const unitPriceEl = document.getElementById("unitPrice");
    const quantityEl = document.getElementById("quantity");

    if (unitPriceEl && quantityEl) {
      // Remove commas and parse price
      const unitPrice = parseFloat(
        unitPriceEl.textContent.replace(/,/g, "").trim()
      );

      const quantity = parseInt(quantityEl.value.trim());

      const totalPrice = unitPrice * quantity;
      buyPage(totalPrice, quantity);
    }
  }
});

// show buy page save info
function showSaveConfirmation() {
  // Create the popup div
  const popup = document.createElement("div");
  popup.textContent = "Your information are saved now";
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  popup.style.color = "white";
  popup.style.padding = "15px 30px";
  popup.style.borderRadius = "5px";
  popup.style.zIndex = "1000";
  popup.style.transition = "opacity 0.3s";

  // Add the popup to the document
  document.body.appendChild(popup);

  // Remove the popup after 300ms
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 300);
  }, 300);
}

// Function to show thank you message and clear form
function showThankYouMessage() {
  // First validate all required fields
  const requiredInputs = document.querySelectorAll("#deliveryForm [required]");
  let allFilled = true;

  requiredInputs.forEach((input) => {
    if (input.type === "radio") {
      const radioGroup = document.querySelectorAll(
        `input[name="${input.name}"]`
      );
      if (!Array.from(radioGroup).some((radio) => radio.checked)) {
        allFilled = false;
        radioGroup.forEach((radio) => {
          radio.parentElement.style.border = "1px solid red";
        });
      }
    } else if (!input.value.trim()) {
      allFilled = false;
      input.style.border = "1px solid red";
    } else {
      input.style.border = "";
      if (input.type === "radio") {
        input.parentElement.style.border = "";
      }
    }
  });

  if (!allFilled) {
    // Show error popup if any field is empty
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0,0,0,0.2);
        text-align: center;
        z-index: 10000;
        border: 2px solid red;
      ">
        <h2 style="color: #ff0000; margin-bottom: 15px;">Please fill all fields</h2>
        <p style="font-size: 18px;">All fields are required</p>
      </div>
    `;
    document.body.appendChild(errorDiv);
    setTimeout(() => {
      document.body.removeChild(errorDiv);
    }, 3000);
    return;
  }

  // Original thank you message code
  const thankYouDiv = document.createElement("div");
  thankYouDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0,0,0,0.2);
      text-align: center;
      z-index: 10000;
      animation: fadeIn 0.5s, bounce 0.5s;
    ">
      <h2 style="color: #ff0000; margin-bottom: 15px;">Thank you for choosing us</h2>
      <p style="font-size: 18px;">Your order will be delivered in 2 days</p>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translate(-50%, -50%); }
      40% { transform: translate(-50%, -60%); }
      60% { transform: translate(-50%, -40%); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(thankYouDiv);

  setTimeout(() => {
    thankYouDiv.style.animation = "fadeOut 0.5s";
    setTimeout(() => {
      document.body.removeChild(thankYouDiv);
      document.head.removeChild(style);
    }, 500);
  }, 4000);

  clearForm();
}

// Your original clearForm function remains exactly the same
function clearForm() {
  const form = document.getElementById("deliveryForm");
  if (form) {
    const inputs = form.querySelectorAll(
      'input[type="text"], input[type="tel"], textarea'
    );
    inputs.forEach((input) => {
      input.value = "";
    });

    const selects = form.querySelectorAll("select");
    selects.forEach((select) => {
      select.selectedIndex = 0;
    });

    const radios = form.querySelectorAll('input[type="radio"]');
    if (radios.length > 0) {
      radios[0].checked = true;
    }
  }
}

// buyPage Function

const buyPage = (totalPrice, quantity) => {
  finalPrice = totalPrice + 260;
  const deliveryInformation = ` <div class="container py-4 py-lg-5">
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card product-card">
            <div class="card-header card-header-custom">
              <h2 class="mb-0 section-title ">
                Delivery Information
              </h2>
            </div>
            <div class="card-body p-4 p-lg-5">
              <form id="deliveryForm">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label form-label-custom"
                      >Full name</label
                    >
                    <input
                      type="text"
                      id="fullName"
                      class="form-control input-custom"
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label form-label-custom"
                      >Phone Number</label
                    >
                    <input
                      type="tel"
                      id="phoneNumber"
                      class="form-control input-custom"
                      placeholder="+92 300 1234567"
                      required
                    />
                  </div>
                </div>

                <div class="mt-3">
                  <label class="form-label form-label-custom"
                    >Building Address</label
                  >
                  <input
                    type="text"
                    id="buildingAddress"
                    class="form-control input-custom"
                    placeholder="House #123, Floor 2"
                    required
                  />
                </div>

                <div class="mt-3">
                  <label class="form-label form-label-custom"
                    >Street/Landmark</label
                  >
                  <input
                    type="text"
                    id="streetLandmark"
                    class="form-control input-custom"
                    placeholder="Main Boulevard, Near Park"
                    required
                  />
                </div>

                <div class="row g-3 mt-1">
                  <div class="col-md-4">
                    <label class="form-label form-label-custom">Province</label>
                    <select id="province" class="form-select input-custom" required>
                      <option value="" selected>Select Province</option>
                      <option>Punjab</option>
                      <option>Sindh</option>
                      <option>Khyber Pakhtunkhwa</option>
                      <option>Balochistan</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label form-label-custom">City</label>
                    <select id="city" class="form-select input-custom" required>
                      <option value="" selected>Select City</option>
                      <option>Lahore</option>
                      <option>Karachi</option>
                      <option>Islamabad</option>
                      <option>Peshawar</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label form-label-custom">Area</label>
                    <select id="area" class="form-select input-custom" required>
                      <option value="" selected>Select Area</option>
                      <option>Gulberg</option>
                      <option>DHA</option>
                      <option>Model Town</option>
                      <option>Faisal Town</option>
                    </select>
                  </div>
                </div>

                <div class="mt-3">
                  <label class="form-label form-label-custom"
                    >Complete Address</label
                  >
                  <textarea
                    id="completeAddress"
                    class="form-control input-custom"
                    rows="3"
                    placeholder="House# 123, Street# 10, Sector ABC"
                    required
                  ></textarea>
                </div>

                <div class="mt-4">
                  <label class="form-label form-label-custom d-block mb-3"
                    >Delivery Type</label
                  >
                  <div class="d-flex gap-4">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="deliveryLabel"
                        id="home"
                        checked
                        required
                      />
                      <label class="form-check-label fw-medium" for="home">
                        <i class="fas fa-home me-2"></i> Home Delivery
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="deliveryLabel"
                        id="office"
                        required
                      />
                      <label class="form-check-label fw-medium" for="office">
                        <i class="fas fa-building me-2"></i> Office Delivery
                      </label>
                    </div>
                  </div>
                </div>

                <div class="mt-4">
                  <button
                    type="button"
                    id="saveInfoBtn"
                    class="btn btn-danger w-100 btn-custom"
                  >
                    <i class="fas fa-save me-2"></i> SAVE INFORMATION
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4 product-card">
          <div class="sticky-top sticky-column" style="top: 30px" id="stick">
            <div class="card">
              <div class="card-header card-header-custom">
                <h3 class="mb-0 section-title ">Order Summary</h3>
              </div>
              <div class="card-body p-4">
                <div
                  class="d-flex justify-content-between align-items-center summary-item"
                >
                  <span class="text-muted"
                    >Subtotal (<span id="itemCount">${quantity}</span> items)</span
                  >
                  <span class="fw-semibold"
                    >Rs. <span id="subtotal">${totalPrice}</span></span
                  >
                </div>
                <div
                  class="d-flex justify-content-between align-items-center summary-item"
                >
                  <span class="text-muted">Delivery Fee</span>
                  <span class="fw-semibold"
                    >Rs. <span id="deliveryFee">260</span></span
                  >
                </div>
                <div
                  class="d-flex justify-content-between align-items-center summary-item mb-2"
                >
                  <span class="text-muted">Taxes</span>
                  <span class="fw-semibold">Rs. <span id="taxes">0</span></span>
                </div>

                <hr class="my-3" />

                <div
                  class="d-flex justify-content-between align-items-center summary-total py-2"
                >
                  <span class="fw-bold">Total Amount</span>
                  <span class="fw-bold text-danger"
                    >Rs. <span id="totalAmount">${finalPrice}</span></span
                  >
                </div>

                <div class="mt-4">
                  <button
                    id="proceedToBuyBtn"
                    class="btn btn-danger w-100 btn-custom-lg"
                  >
                    PROCEED TO BUY <i class="fas fa-arrow-right ms-2"></i>
                  </button>
                </div>

                <div class="mt-4 pt-3">
                  <h6 class="fw-semibold mb-3">Payment Methods</h6>
                  <div class="payment-method">
                    <div class="payment-card">
                      <i class="fab fa-cc-visa text-primary"></i>
                    </div>
                    <div class="payment-card">
                      <i class="fab fa-cc-mastercard text-danger"></i>
                    </div>
                    <div class="payment-card">
                      <i class="fab fa-cc-paypal"></i>
                    </div>
                    <div class="payment-card">
                      <i class="fas fa-mobile-alt"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="card mt-4"
              style="
                background: #fafafa;
                border: 1px solid #eee;
                border-radius: 14px;
              "
            >
              <div class="card-body p-4">
                <h6 class="fw-bold mb-3">Need Help?</h6>

                <div class="d-flex align-items-center mb-3">
                  <div
                    style="
                      width: 48px;
                      height: 48px;
                      background: #ffe6ea;
                      border-radius: 12px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      margin-right: 1rem;
                      color: #ff2e4d;
                    "
                  >
                    <i class="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <div class="small text-muted">Call us 24/7</div>
                    <div class="fw-semibold">+92 21 111 111 111</div>
                  </div>
                </div>

                <div class="d-flex align-items-center">
                  <div
                    style="
                      width: 48px;
                      height: 48px;
                      background: #ffe6ea;
                      border-radius: 12px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      margin-right: 1rem;
                      color: #ff2e4d;
                    "
                  >
                    <i class="fas fa-comment-dots"></i>
                  </div>
                  <div>
                    <div class="small text-muted">Chat with us</div>
                    <div class="fw-semibold">Live Chat Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  containerDiv.innerHTML = deliveryInformation;
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  let buttonSaveINfo = document.getElementById("saveInfoBtn");
  buttonSaveINfo.addEventListener("click", () => {
    showSaveConfirmation();
  });

  document
    .getElementById("proceedToBuyBtn")
    .addEventListener("click", showThankYouMessage);

  //  toggle cart
  let button = document.querySelector(".cart-container");
  if (button) {
    let buttonONe = document.querySelector(".cart-container");
    buttonONe.classList.remove("cart-container1");
    buttonONe.classList.add("cart-container");
  }
};

const proceedFunction = () => {
  let quantity = 0;
  let total = 0;
  let totalCartText = document.querySelector("#total").textContent;
  let totalCart = parseInt(totalCartText.replace(/[^0-9]/g, ""));
  total = totalCart;
  const cartItems = document.querySelectorAll(".quntity-cartItem");
  cartItems.forEach((Element) => {
    let quantityNumber = parseInt(Element.textContent);
    quantity += quantityNumber;
  });

  buyPage(total, quantity);
};

document
  .querySelector(".proceed-btn")
  .addEventListener("click", proceedFunction);
