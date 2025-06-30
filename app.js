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
