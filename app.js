let component = {};
let containerDiv = document.querySelector("#app");

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

// Event delegation for dynamically loaded routing buttons
document.body.addEventListener("click", (e) => {
  const button = e.target.closest(".routingButton");
  if (button) {
    const eventName = button.dataset.name;
    // alert(eventName);
    // alert(eventName);
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

// Toggle Menu
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

// cart work here
const cartFuctions = () => {
  // Grand Total Function
  function updateGrandTotal() {
    let total = 0;
    document.querySelectorAll(".total-col strong").forEach((el) => {
      total += parseInt(el.textContent.replace("Rs. ", ""));
    });
    let footer = document.querySelector(".cart-footer span");
    if (footer) footer.textContent = `Rs. ${total}`;
  }

  // Toggle Navbar
  (() => {
    document.querySelectorAll(".cartButton").forEach((icon) => {
      icon.addEventListener("click", () => {
        let cart = document.querySelector(".cart-container");
        if (cart) cart.classList.toggle("cart-container1");
      });
    });
  })();

  // Quantity update
  document.querySelectorAll(".mycart").forEach((Element) => {
    Element.addEventListener("click", (event) => {
      let quantity = event.target.parentNode.children[1];
      let num = parseInt(quantity.textContent);
      let cartItem = event.target.closest(".cart-item");
      let totalEl = cartItem.querySelector(".total-col strong");
      let currentTotal = parseInt(totalEl.textContent.replace("Rs. ", ""));
      let unitPrice = Math.round(currentTotal / num);

      if (event.target.textContent === "+") {
        num++;
        quantity.textContent = num;
      } else if (event.target.textContent === "-") {
        if (num > 1) {
          num--;
          quantity.textContent = num;
        }
      }

      totalEl.textContent = `Rs. ${unitPrice * num}`;
      updateGrandTotal();
    });
  });

  // update cartDigits
  const cartDigits = () => {
    let carts = document.querySelectorAll(".cartDelete");
    document.querySelectorAll(".cartButton span").forEach((Element) => {
      Element.textContent = carts.length;
    });
  };
  cartDigits();

  // Delete cart item
  document.querySelectorAll(".cartDelete").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      let cartItem = event.target.closest(".cart-item");
      if (cartItem) {
        cartItem.remove();
        updateGrandTotal();
        cartDigits();
      }
    });
  });

  // Initial grand total
  updateGrandTotal();
};

cartFuctions();

// Count Down Functions

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

// Just for you more cards function
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

// product page logic start
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

// send data to card on button click

document.body.addEventListener("click", function (e) {
  if (
    e.target.closest(".btn-danger") &&
    e.target.closest(".btn-danger").textContent.includes("Add to Cart")
  ) {
    // Yahan tum localStorage me data save kar sakte ho
    // Example:
    const title = document.querySelector("h2.text-danger").textContent;
    const price = document.getElementById("unitPrice").textContent;
    const quantity = document.getElementById("quantity").value;

    const cartItem = {
      title: title,
      price: price,
      quantity: quantity,
    };

    // Get existing cart from localStorage or empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
});
