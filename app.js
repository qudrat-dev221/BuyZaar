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
    // calling function for components inner content
    prepare();
    // Button click
    document.querySelectorAll(".routingButton").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let eventName = e.currentTarget.dataset.name;
        alert(eventName);
        let html = component[eventName] || "<h2>404 - Page Not Found</h2>";
        containerDiv.innerHTML = html;
        history.pushState({ page: eventName }, "", `?page=${eventName}`);
      });
    });

    //  Back/Forward navigation
    window.onpopstate = (event) => {
      // If state not available, read from URL
      let urlParams = new URLSearchParams(window.location.search);
      let page = event.state?.page || urlParams.get("page") || "home";
      let html = component[page] || "<h2>404 - Page Not Found</h2>";
      containerDiv.innerHTML = html;
      prepare();
    };
  })
  .catch((err) => {
    containerDiv.innerHTML = "<h2>Something went wrong while loading!</h2>";
    console.error(err);
  });

const prepare = () => {
  // Grand Total Function
  function updateGrandTotal() {
    let total = 0;
    document.querySelectorAll(".total-col strong").forEach((el) => {
      total += parseInt(el.textContent.replace("Rs. ", ""));
    });
    document.querySelector(".cart-footer span").textContent = `Rs. ${total}`;
  }
  // Grand Total Function end

  // Toggle Navbar
  (function () {
    // Cart toggle
    document.querySelectorAll(".cartButton").forEach((icon) => {
      icon.addEventListener("click", () => {
        let cart = document.querySelector(".cart-container");
        cart.classList.toggle("cart-container1");
      });
    });
    // Toggle Navbar

    // Quantity update
    document.querySelectorAll(".mycart").forEach((Element) => {
      Element.addEventListener("click", (event) => {
        let quantity = event.target.parentNode.children[1];
        let num = parseInt(quantity.textContent);

        // Get parent cart item and total price element
        let cartItem = event.target.closest(".cart-item");
        let totalEl = cartItem.querySelector(".total-col strong");

        // Extract current total price
        let currentTotal = parseInt(totalEl.textContent.replace("Rs. ", ""));

        // Get per unit price from current total / quantity
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

        // Update item total
        totalEl.textContent = `Rs. ${unitPrice * num}`;

        // Update grand total
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
    // Delete item
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
  })();

  // Toggle Menu
  (() => {
    let such = true;
    let toggleButton = document.querySelector("#toggleMobile");
    let mobileMenu = document.querySelector(".slidemenu1");

    toggleButton.addEventListener("click", () => {
      if (such) {
        toggleButton.innerHTML =
          '<i class="fa-solid fa-xmark text-danger"></i>';
      } else {
        toggleButton.innerHTML = '<i class="fa-solid fa-bars text-danger"></i>';
      }

      mobileMenu.classList.toggle("slidemenu2");

      such = !such;
    });
  })();

  // just for you more cards function
  (() => {
    const loadmoreButton = document.querySelector(".loadmore");
    let isVisible = false;

    if (loadmoreButton) {
      loadmoreButton.addEventListener("click", () => {
        const cards = document.querySelectorAll(".ghum");

        if (!isVisible) {
          // Show cards
          cards.forEach((card) => {
            card.style.display = "block";
          });
          loadmoreButton.textContent = "HIDE";
        } else {
          // Hide cards
          cards.forEach((card) => {
            card.style.display = "none";
          });
          loadmoreButton.textContent = "LOAD MORE";
        }

        isVisible = !isVisible;
      });
    }
  })(); // just for you more cards function end

  // Flash sale countdown
  function updateCountdown() {
    const countdownElement = document.getElementById("countdown");
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

  // Hot deals countdown
  function updateHotDealsCountdown() {
    const countdownElement = document.getElementById("hotdeals-countdown");
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

  setInterval(updateCountdown, 1000);
  setInterval(updateHotDealsCountdown, 1000);
};

// document.querySelectorAll(".routingButton").forEach((element) => {
//   element.addEventListener("click", () => {
//     alert("hi");
//   });
// });
