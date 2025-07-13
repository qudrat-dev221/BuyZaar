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
    prepare();
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
    if (!eventName) return;
    let html = component[eventName] || "<h2>404 - Page Not Found</h2>";
    containerDiv.innerHTML = "";
    containerDiv.innerHTML = html;
    history.pushState({ page: eventName }, "", `?page=${eventName}`);
    prepare();
  }
});

// Back/Forward browser navigation
window.onpopstate = (event) => {
  let urlParams = new URLSearchParams(window.location.search);
  let page = event.state?.page || urlParams.get("page") || "home";
  let html = component[page] || "<h2>404 - Page Not Found</h2>";
  containerDiv.innerHTML = html;
  prepare();
};

const prepare = () => {
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

  // Toggle Menu
  (() => {
    let such = true;
    let toggleButton = document.querySelector("#toggleMobile");
    let mobileMenu = document.querySelector(".slidemenu1");

    if (toggleButton && mobileMenu) {
      toggleButton.addEventListener("click", () => {
        toggleButton.innerHTML = such
          ? '<i class="fa-solid fa-xmark text-danger"></i>'
          : '<i class="fa-solid fa-bars text-danger"></i>';

        mobileMenu.classList.toggle("slidemenu2");
        such = !such;
      });
    }
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
};

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
