// Show preloader initially
document.getElementById("preloader").style.display = "block";

// Handle file input change event
var fileInput = document.getElementById("profile");
fileInput.onchange = function () {
  var input = this.files[0];
  document.getElementById("new-upload-btn").value = "File Selected";
};

// Function to get user's location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// Function to show the user's position
function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  getCityAndState(latitude, longitude);
}

// Function to get city and state based on latitude and longitude
function getCityAndState(lat, lon) {
  fetch(`https://geocode.xyz/${lat},${lon}?geoit=json`)
    .then((response) => response.json())
    .then((data) => {
      if (data.city && data.state) {
        document.getElementById("cityId").value = data.city;
        document.getElementById("stateId").value = data.state;
        console.log(data.city, data.state);
      } else {
        console.log("Unable to fetch city and state.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Call getLocation to fetch city and state
getLocation();

window.onload = function () {
  document.getElementById("preloader").style.display = "none";

  // Verify phone number button click event
  document.getElementById("postotp").addEventListener("click", (e) => {
    if (document.getElementById("phone").value.length !== 10) {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Please enter valid contact number",
      });
      return;
    }

    document.getElementById("postotp").innerHTML = "Sending OTP...";
    fetch("https://verify-2845-0cg3jx.twil.io/start-verify", {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        to: "+91" + document.getElementById("phone").value,
        channel: "sms",
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (!res.success) {
          document.getElementById("postotp").innerHTML =
            "Error while sending OTP";
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "There was some error, contact Dashabhujaathome@gmail.com.",
          });
          document.getElementById("postotp").innerHTML = "Verify phone number!";
        } else {
          Swal.fire({
            title: "Enter OTP",
            input: "number",
            inputAttributes: { autocapitalize: "off" },
            showCancelButton: true,
            confirmButtonText: "Submit",
            showLoaderOnConfirm: true,
          }).then((result) => {
            if (result.isConfirmed) {
              document.getElementById("postotp").innerHTML = "Verifying OTP...";
              fetch("https://verify-2845-0cg3jx.twil.io/check-verify", {
                method: "POST",
                headers: new Headers({ "content-type": "application/json" }),
                body: JSON.stringify({
                  to: "+91" + document.getElementById("phone").value,
                  code: result.value,
                }),
              })
                .then((response) => response.json())
                .then((res) => {
                  if (res.success) {
                    Swal.fire({
                      icon: "success",
                      title: "Yayy",
                      text: "Phone verified successfully!",
                    });
                    document.getElementById("postotp").innerHTML =
                      "Phone verified successfully!";
                    document.getElementById("postotp").removeAttribute("id");
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: res.message,
                    });
                    document.getElementById("postotp").innerHTML =
                      "Verify phone number!";
                  }
                })
                .catch((err) => {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "There was some error, contact Dashabhujaathome@gmail.com.",
                  });
                  document.getElementById("postotp").innerHTML =
                    "Verify phone number!";
                });
            }
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "There was some error, contact Dashabhujaathome@gmail.com.",
        });
        document.getElementById("postotp").innerHTML = "Verify phone number!";
      });
  });

  // Sign up button click event
  document.getElementById("sub").addEventListener("click", function (e) {
    console.log("clicked");
    var email = document.getElementById("email").value;
    console.log(email);
    var password = document.getElementById("password").value;
    console.log(password);
    var name = document.getElementById("name").value;
    console.log(name);
    var phone = document.getElementById("phone").value;
    console.log(phone);
    var city = document.getElementById("cityId").value;
    var state = document.getElementById("stateId").value;
    var prof = document.getElementById("prof").value;
    console.log(prof);

    let status = [];

    let re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

    if (re.test(email.trim())) {
      status.push("true");
    } else {
      document.getElementById("email").style.borderColor = "red";
      document.getElementById("email").value = "";
      document.getElementById("labelEmail").innerHTML =
        "Please enter valid email";
      status.push("false");
    }

    if (name.length <= 1) {
      document.getElementById("name").style.borderColor = "red";
      document.getElementById("name").value = "";
      document.getElementById("labelName").innerHTML =
        "Please enter valid name";
      status.push("false");
    } else {
      status.push("true");
    }

    if (prof.length <= 1) {
      document.getElementById("prof").style.borderColor = "red";
      document.getElementById("prof").value = "";
      document.getElementById("labelProf").innerHTML =
        "Please enter valid profession";
      status.push("false");
    } else {
      status.push("true");
    }

    var len = password.length;
    if (len <= 6) {
      status.push("false");
      document.getElementById("password").style.borderColor = "red";
      document.getElementById("password").value = "";
      document.getElementById("labelPassword").innerHTML =
        "Please enter valid password more than 6 characters";
    } else {
      status.push("true");
    }

    if (phone.length !== 10) {
      document.getElementById("phone").style.borderColor = "red";
      document.getElementById("phone").value = "";
      document.getElementById("labelPhone").innerHTML =
        "Enter valid phone number";
      status.push("false");
    } else {
      status.push("true");
    }

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

    if (status.includes("false")) {
      return false;
    } else {
      let formData = new FormData();
      let input = document.getElementById("profile");
      for (const file of input.files) {
        formData.append("image", file, file.name);
      }

      if (input.files.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Oops...",
          text: "Uploading image is required!",
        });
        return;
      }
      if (input.files.length > 1) {
        Swal.fire({
          icon: "info",
          title: "Oops...",
          text: "Upload only 1 image!",
        });
        return;
      }

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("profession", prof);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("phoneNumber", Number("91" + phone));
      console.log(formData);
      document.getElementById("sub").value = "Loading...";
      fetch("https://dashabhujamain1.azurewebsites.net/auth/signup", {
        method: "POST",
        body: formData,
      })
        .then(function (response) {
          return response.json();
        })
        .then((res) => {
          document.getElementById("sub").value = "SIGN UP";
          if (res.message) {
            Swal.fire({
              icon: "success",
              title: "Yayy",
              text: "Signed up successfully",
            }).then((res) => {
              window.location.href = "login.html";
            });
          } else if (res.alreadyRegistered) {
            Swal.fire({
              icon: "info",
              title: "Already registered",
              text: "You are already registered with us, login now!",
            }).then((res) => {
              window.location.href = "login.html";
            });
          } else if (res.phoneNumberNotVerified) {
            Swal.fire({
              icon: "info",
              title: "Phone number not verified",
              text: "Verify your phone number first, then sign up!",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "There was some error, contact Dashabhujaathome@gmail.com.",
            });
          }
          document.getElementById("sub").value = "SIGN UP";
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "There was some error, contact Dashabhujaathome@gmail.com.",
          });
          document.getElementById("sub").value = "SIGN UP";
        });
    }
  });
};
