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

    // Button click
    document.querySelectorAll(".change").forEach((btn) => {
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
    };
  })
  .catch((err) => {
    containerDiv.innerHTML = "<h2>Something went wrong while loading!</h2>";
    console.error(err);
  });

// cart work

(function () {
  // Cart toggle
  document.querySelector("#cartButton")?.addEventListener("click", () => {
    let cart = document.querySelector(".cart-container");
    cart.classList.toggle("cart-container1");
  });

  // Quantity update
  document.querySelectorAll(".mycart").forEach((Element) => {
    Element.addEventListener("click", (event) => {
      let quantity = event.target.parentNode.children[1];
      let num = parseInt(quantity.textContent);

      if (event.target.textContent === "+") {
        num++;
        quantity.textContent = num;
      } else if (event.target.textContent === "-") {
        if (num > 1) {
          num--;
          quantity.textContent = num;
        }
      }
    });
  });

  //  Delete item
  document.querySelectorAll(".btn-danger").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      let cartItem = event.target.closest(".cart-item");
      if (cartItem) {
        cartItem.remove();
      }
    });
  });
})();
