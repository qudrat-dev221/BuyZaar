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
        let eventName = e.target.dataset.name;
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

  // cart work

  (function () {
    // Cart toggle
    document.querySelectorAll(".cartButton").forEach((icon) => {
      icon.addEventListener("click", () => {
        let cart = document.querySelector(".cart-container");
        cart.classList.toggle("cart-container1");
      });
    });

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

    // Delete item
    document.querySelectorAll(".btn-danger").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        let cartItem = event.target.closest(".cart-item");
        if (cartItem) {
          cartItem.remove();
          updateGrandTotal();
        }
      });
    });

    // Initial grand total
    updateGrandTotal();
  })();

  (() => {
    let such = true;
    let toggleButton = document.querySelector("#toggleMobile");
    let mobileMenu = document.querySelector(".slidemenu1"); // target by class

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
};

document.querySelectorAll(".routingButton").forEach((button) => {
  button.addEventListener("click", (event) => {
    alert(event.currentTarget.dataset.name);
  });
});
