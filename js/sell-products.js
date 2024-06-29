// Display the preloader
document.getElementById("preloader").style.display = "block";

// Retrieve the token from local storage
const token = localStorage.getItem("token");

// Get the file input element
var fileInput = document.getElementById("prodImg");

// Function to upload the file and send a request to generate a description
async function uploadFileAndSendRequest(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async function (event) {
      const encodedImage = event.target.result.split(",")[1]; // Extract base64 string

      const headers = {
        "Content-Type": "application/json",
        "api-key": "adccafdcddf64a209f63fe6358e7629e", // Replace with your actual API key
      };

      const payload = {
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: "You will provide the response in this format\nTitle: \nDescription:\nPrice: \nType: \nChoose type from one of the options\nPottery\nDecorative Artifacts\nEmbroidered Materials\nKnitting/Weaving\nHealthy home-made snacks\nHandicrafts\nJewellery\nPaintings\nBaking\nOther\n\nShow only one price(₹) and not a range\nAlso dont generate any other things",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${encodedImage}`,
                },
              },
              {
                type: "text",
                text: "generate",
              },
            ],
          },
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 800,
      };

      const GPT4V_ENDPOINT =
        "https://maths.openai.azure.com/openai/deployments/vision/chat/completions?api-version=2024-02-15-preview";

      try {
        const response = await axios.post(GPT4V_ENDPOINT, payload, { headers });
        const responseData = response.data;

        // Resolve the promise with the product description
        resolve(responseData.choices[0].message.content);
      } catch (error) {
        console.error(`Failed to make the request. Error: ${error}`);
        reject(error);
      }
    };

    reader.readAsDataURL(file);
  });
}

// Event listener for file input change
fileInput.addEventListener("change", async function (event) {
  let files = event.target.files;
  if (files.length > 0) {
    // Display the preloader
    document.getElementById("preloader").style.display = "block";

    try {
      // Get the product description
      const description = await uploadFileAndSendRequest(files[0]);

      // Display the product description in the textarea
      document.getElementById("prodDesc").value = description;
      document.getElementById("prodName").value = description;
      function parseDescription(desc) {
        const titleMatch = desc.match(/Title: (.*)\n\n/);
        const descriptionMatch = desc.match(/Description: (.*)\n\n/);
        const priceMatch = desc.match(/Price: ₹(\d+)/);
        const typeMatch = desc.match(/Type: (.*)/);

        return {
          title: titleMatch ? titleMatch[1] : "",
          description: descriptionMatch ? descriptionMatch[1] : "",
          price: priceMatch ? parseInt(priceMatch[1], 10) : 0,
          type: typeMatch ? typeMatch[1] : "",
        };
      }

      // Parse the description
      const parsedData = parseDescription(description);

      // Assign values to HTML elements
      document.getElementById("prodName").value = parsedData.title;
      document.getElementById("prodDesc").value = parsedData.description;
      document.getElementById("prodPrice").value = parsedData.price;

      const categoryList = document.getElementById("categoryList");
      for (let i = 0; i < categoryList.options.length; i++) {
        if (categoryList.options[i].text === parsedData.type) {
          categoryList.selectedIndex = i;
          break;
        }
      }
    } catch (error) {
      console.error("Error generating description:", error);
    } finally {
      // Hide the preloader
      document.getElementById("preloader").style.display = "none";
    }
  }
});

// Button to trigger file input click
document.getElementById("prodImg").addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = function (event) {
  var input = this.files.length;
  if (input === 1) {
    document.getElementById("new-upload-btn").value = "1 File Selected";
  } else if (input === 2) {
    document.getElementById("new-upload-btn").value = "2 Files Selected";
  } else if (input === 3) {
    document.getElementById("new-upload-btn").value = "3 Files Selected";
  } else {
    //document.getElementById('new-upload-btn').value = 'More than 3 Files Selected';

    event.preventDefault();
    Swal.fire({
      icon: "info",
      title: "Oops...",
      text: "You cannot select more than 3 pictures!",
    });
  }
};

function resetInputValues() {
  document.getElementById("prodName").value = "";
  // document.getElementById("categoryList").selected =
  document.getElementById("prodDesc").value = "";
  document.getElementById("prodPrice").value = "";
  document.getElementById("prodNeg").value = "false";
  document.getElementById("new-upload-btn").value = "Choose files";
}

window.onload = function () {
  document.getElementById("preloader").style.display = "none";
  document.getElementById("submit-btn").addEventListener("click", () => {
    var pname = document.getElementById("prodName").value;
    var pdesc = document.getElementById("prodDesc").value;
    var pcat = document.getElementById("categoryList").value;
    var pprice = document.getElementById("prodPrice").value;
    var pneg = document.getElementById("prodNeg").checked;

    var pimg = document.getElementById("prodImg").value;

    let status = [];

    if (pname.length <= 1) {
      document.getElementById("prodName").style.borderColor = "red";
      document.getElementById("prodName").value = "";
      document.getElementById("labelName").innerHTML =
        "Please enter valid name";
      status.push("false");
    } else {
      status.push("true");
    }

    if (pdesc.length < 1) {
      document.getElementById("prodDesc").style.borderColor = "red";
      document.getElementById("prodDesc").value = "";
      document.getElementById("labelDesc").innerHTML =
        "Please enter valid description";
      status.push("false");
    } else {
      status.push("true");
    }

    if (pcat.length <= 1) {
      document.getElementById("categoryList").style.borderColor = "red";
      status.push("false");
    } else {
      status.push("true");
    }

    if (pprice.length <= 1) {
      document.getElementById("prodPrice").style.borderColor = "red";
      document.getElementById("prodPrice").value = "";
      document.getElementById("labelPrice").innerHTML =
        "Please enter valid price";
      status.push("false");
    } else {
      status.push("true");
    }

    if (status.includes("false")) {
      return false;
    } else {
      let formData = new FormData();
      let input = document.getElementById("prodImg");
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
      if (input.files.length > 3) {
        Swal.fire({
          icon: "info",
          title: "Oops...",
          text: "Upload less than three images!",
        });
        return;
      }

      formData.append("title", pname);
      formData.append("description", pdesc);
      formData.append("category", pcat);
      formData.append("price", pprice);
      formData.append("negotiable", pneg);

      document.getElementById("submit-btn").value = "Please wait...";
      fetch(
        `https://api.meaningcloud.com/sentiment-2.1?key=cdd3596a15c1debe314b912a6895cefd&of=json&txt=${encodeURI(
          pname + " " + pdesc
        )}&lang=en`
      )
        .then((res) => res.json())
        .then((res) => {
          document.getElementById("submit-btn").value = "Submit";
          if (
            res.score_tag === "N" ||
            res.score_tag === "N+" ||
            res.score_tag === "NEU"
          ) {
            Swal.fire({
              icon: "error",
              title: "Submission failed",
              text: "Please do not spread hate!!",
            });
          } else {
            fetch("https://dashabhujamain1.azurewebsites.net/products/add", {
              method: "POST",
              headers: new Headers({
                Authorization: token,
              }),
              body: formData,
            })
              .then(function (response) {
                return response.json();
              })
              .then((res) => {
                if (res.isloggedin && !res.isloggedin) {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Please login first :)",
                  }).then((res) => {
                    window.location.href = "login.html";
                  });
                  return;
                }
                console.log("This is the response", res);
                document.getElementById("submit-btn").value = "Submit";

                if (res.message) {
                  Swal.fire({
                    icon: "success",
                    title: "Yayyy",
                    text: "Your product has been successfully posted!",
                  });
                  // window.location.href = "buyprod.html";
                  document.getElementById("submit-btn").value = "Submit";
                  resetInputValues();
                } else if (res.isloggedin && !res.isloggedin) {
                  Swal.fire({
                    icon: "error",
                    title: "Oops..",
                    text: "Please login to post product",
                  });
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops..",
                    text: "There was an error posting your product. Please try again!",
                  });
                }
              })
              .catch((err) => {
                Swal.fire({
                  icon: "error",
                  title: "Oops..",
                  text: "There was an error posting your product. Please try again!",
                });
                document.getElementById("submit-btn").value = "Submit";
              });
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "There was some error, contact Dashabhujaathome@gmail.com.",
          });
          document.getElementById("submit-btn").value = "Submit";
        });
    }
  });
};

fetch("https://dashabhujamain1.azurewebsites.net/auth/isloggedin", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: token,
  },
})
  .then((response) => response.json())
  .then((res) => {
    let userDetails = "";
    if (res.message) {
      userDetails =
        userDetails +
        `
            <img src=${res.profile_pic} class="buy-prod-profile-navbar">
            <div id="user-navbar-name" style="color: black;"> ${res.name} </div>`;
      document.getElementById("user-navbar-details").innerHTML = userDetails;
    } else {
      document.getElementById(
        "login-signup"
      ).innerHTML = `<li class="nav-item" style="padding-left: 30px; padding-right: 30px;">
      <a class="nav-link" href="signup.html"
        ><span class="fas fa-user-plus"></span> Signup</a
      >
    </li>
    <li class="nav-item" style="padding-left: 30px; padding-right: 30px;">
      <a class="nav-link" href="login.html"
        ><span class="fas fa-sign-in-alt"></span> Login</a
      >
    </li>`;
      Swal.fire({
        icon: "info",
        title: "Oops..",
        text: "Please login to post product",
      }).then(() => {
        window.location.href = "login.html";
      });
    }
  })
  .catch((err) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "There was some error, contact Dashabhujaathome@gmail.com.",
    });
  });

function logout(event) {
  localStorage.removeItem("token");
}
