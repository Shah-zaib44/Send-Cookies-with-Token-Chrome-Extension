const http = new EasyHTTP();
const input = document.querySelector("#input");
const formulario = document.querySelector("#sendBtn");
const alertDanger = document.querySelector(".alert-danger");
const alertSuccess = document.querySelector(".alert-success");
let cookiesArray = [];
alertDanger.style.display = "none";
alertSuccess.style.display = "none";

formulario.addEventListener("submit", sendCookies);

getCookies();
document.getElementById("input").value = localStorage.getItem("token");

function getCookies() {
  chrome.tabs.getSelected(null, function (tab) {
    myFunction(tab.url);
  });
  function myFunction(tablink) {
    chrome.cookies.getAll(
      {
        url: tablink,
      },
      function (cookies) {
        for (var i in cookies) {
          cookiesArray[i] = {
            domain: tablink,
            name: cookies[i].name,
            value: cookies[i].value,
          };
        }
      }
    );
  }
  return cookiesArray;
}

function storeTokenInLocalStorage() {
  var tokenValue = document.getElementById("input").value;

  localStorage.setItem("token", tokenValue);
}

function sendCookies(e) {
  storeTokenInLocalStorage();

  http
    .post("http://localhost:3000/posts", getCookies())
    .then(() => (alertSuccess.style.display = "block"))
    .catch(() => (alertDanger.style.display = "block"));

  e.preventDefault();
}
