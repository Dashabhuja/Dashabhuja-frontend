let latitude = 0;
let longitude = 0;
let fullName = ""; // Variable to store the full name

if (window.localStorage.getItem("crime-reported") === null) {
  window.localStorage.setItem("crime-reported", "false");
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  getCityAndState(latitude, longitude);
}

function getCityAndState(lat, lon) {
  fetch(`https://geocode.xyz/${lat},${lon}?geoit=json`)
    .then((response) => response.json())
    .then((data) => {
      if (data.city && data.state) {
        document.getElementById("cityId").value = data.city;
        document.getElementById("stateId").value = data.state;
        console.log(data.city);
      } else {
        console.log("Unable to fetch city and state.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

getLocation();

// Fetch user details from localhost server
function fetchUserDetails() {
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
  return fetch("https://dashabhujamain1.azurewebsites.net/auth/isloggedin", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.message) {
        fullName = res.name; // Store the full name
      }
    })
    .catch((err) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was some error, contact Dashabhujaathome@gmail.com.",
      });
    });
}

window.onload = function () {
  fetchUserDetails().then(() => {
    // Ensure user details are fetched before adding event listener
    document.getElementById("submit-btn").addEventListener("click", () => {
      var city = document.getElementById("cityId").value;
      console.log(city);
      var state = document.getElementById("stateId").value;
      console.log(state);
      var street = document.getElementById("streetId").value;
      var age = document.getElementById("agecategoryList").value;
      var crime = document.getElementById("crimecategoryList").value;
      var desc = document.getElementById("prodDesc").value;

      let status = [];

      if (city.length <= 1) {
        document.getElementById("cityId").style.borderColor = "red";
        status.push("false");
      } else {
        status.push("true");
      }

      if (state.length <= 1) {
        document.getElementById("stateId").style.borderColor = "red";
        status.push("false");
      } else {
        status.push("true");
      }

      if (street.length <= 1) {
        document.getElementById("streetId").style.borderColor = "red";
        document.getElementById("streetId").placeholder =
          "Please enter valid street";
        status.push("false");
      } else {
        status.push("true");
      }

      if (desc.length < 1) {
        document.getElementById("prodDesc").style.borderColor = "red";
        document.getElementById("prodDesc").value = "";
        document.getElementById("labelDesc").innerHTML =
          "Please enter valid description";
        status.push("false");
      } else {
        status.push("true");
      }

      if (age === "none") {
        document.getElementById("agecategoryList").style.borderColor = "red";
        document.getElementById("age-dropdown").innerHTML =
          "Please select your age";
        status.push("false");
      } else {
        status.push("true");
      }

      if (crime === "none") {
        document.getElementById("crimecategoryList").style.borderColor = "red";
        document.getElementById("crime-dropdown").innerHTML =
          "Please select a crime";
        status.push("false");
      } else {
        status.push("true");
      }
      console.log(
        JSON.stringify({
          name: fullName, // Use the full name fetched from localhost
          city: city,
          state: state,
          street: street,
          latitude: latitude,
          longitude: longitude,
          age: age,
          type: crime,
          description: desc,
        })
      );
      if (status.includes("false")) {
        return false;
      } else {
        fetch(
          "https://3a59-2409-40e0-1042-bb9c-70cd-54d0-4842-c46.ngrok-free.app/analyse",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: fullName, // Use the full name fetched from localhost
              city: city,
              state: state,
              street: street,
              latitude: latitude,
              longitude: longitude,
              age: age,
              type: crime,
              description: desc,
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            // You can handle further success actions here
          })
          .catch((err) => {
            console.error("Error:", err);
          });
      }
    });
  });
};
