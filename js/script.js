let rowData = document.querySelector("#rowData");
let inputs = document.querySelector("#inputs");

// id
async function getMealDetails(mealId) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  const data = await response.json();
  const meal = data.meals[0];

  displayMealDetails(meal);
}

function displayMealDetails(meal) {
  let ingredients = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients += `<li class="alert alert-info m-2 p-1">${measure} ${ingredient}</li>`;
    }
  }

  let tags = "";
  if (meal.strTags) {
    tags = meal.strTags
      .split(",")
      .map((tag) => `<li class="alert alert-danger m-2 p-1">${tag}</li>`)
      .join("");
  }

  container.innerHTML = `
    <div class="container w-75 py-5">
      <div class="row">
        <div class="col-md-4">
          <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="${
    meal.strMeal
  }">
          <h2 class="text-white mt-3">${meal.strMeal}</h2>
        </div>
        <div class="col-md-8 text-white">
          <h3>Instructions</h3>
          <p>${meal.strInstructions}</p>
          <h4><span class="fw-bolder">Area:</span> ${meal.strArea}</h4>
          <h4><span class="fw-bolder">Category:</span> ${meal.strCategory}</h4>
          <h4>Recipes:</h4>
          <ul class="list-unstyled d-flex flex-wrap">${ingredients}</ul>
          ${
            tags
              ? `<h4>Tags:</h4><ul class="list-unstyled d-flex flex-wrap">${tags}</ul>`
              : ""
          }
          <a target="_blank" href="${
            meal.strSource
          }" class="btn btn-success me-2">Source</a>
          <a target="_blank" href="${
            meal.strYoutube
          }" class="btn btn-danger">YouTube</a>
        </div>
      </div>
    </div>
  `;
  rowData.classList.add("d-none");
  inputs.classList.add("d-none");
}

// search

function showSearchInputs() {
  const searchInputsHTML = `
    <div class="container my-4">
      <div class="row g-3">
        <div class="col-md-6">
          <input id="searchByName" type="text" class="form-control bg-transparent text-white" placeholder="Search by name">
        </div>
        <div class="col-md-6">
          <input id="searchByLetter" type="text" maxlength="1" class="form-control bg-transparent text-white" placeholder="Search by first letter">
        </div>
      </div>
    </div>
  `;

  document.getElementById("inputs").innerHTML = searchInputsHTML;

  document
    .getElementById("searchByName")
    .addEventListener("keyup", function () {
      searchByName(this.value);
    });

  document
    .getElementById("searchByLetter")
    .addEventListener("keyup", function () {
      searchByFirstLetter(this.value.charAt(0));
    });

  document.getElementById("rowData").classList.add("d-none");
}

document.getElementById("searchByName").addEventListener("keyup", function () {
  const query = this.value.trim();
  if (query !== "") {
    searchByName(query);
  } else {
    document.getElementById("container").innerHTML = "";
  }
});

async function searchByName(query) {
  inputs.classList.remove("d-none");

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  const data = await response.json();

  if (data.meals) {
    displayMeals(data.meals);
  }
}

function displaySearchResults(meals) {
  const container = document.getElementById("container");
  container.innerHTML = meals
    .map(
      (meal) => `
  
          <div class="col-md-3">
            <div
              onclick="getMealDetails('${meal.idMeal}')"
              class="meal position-relative overflow-hidden rounded-2 cursor-pointer"
            >
              <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div
                class="meal-layer position-absolute d-flex align-items-center text-black p-2"
              >
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          </div>
    `
    )
    .join("");

}

document
  .getElementById("searchByLetter")
  .addEventListener("keyup", function () {
    const letter = this.value.trim();

    if (letter.length === 1) {
      searchByFirstLetter(letter);
    } else {
      document.getElementById("container").innerHTML = "";
    }
  });

async function searchByFirstLetter(letter) {
  inputs.classList.remove("d-none");

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  const data = await response.json();

  if (data.meals) {
    displayMeals(data.meals);
  }
}

// category

async function getCategories() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const data = await response.json();

  if (data.categories) {
    displayCategories(data.categories);
  }
}

getCategories();

async function getCategoryMeals(categoryName) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
  );
  const data = await response.json();

  if (data.meals) {
    displayMeals(data.meals);
  }
}

function displayCategories(categories) {
  const container = document.getElementById("container");
  container.innerHTML = categories
    .map(
      (category) => `
        <div class="col-md-3">
          <div onclick="getCategoryMeals('${
            category.strCategory
          }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img src="${
              category.strCategoryThumb
            }" class="card-img-top w-100" alt="${category.strCategory}">

            <div
                class="meal-layer position-absolute text-center text-black p-2"
              >
              <h5>${category.strCategory}</h5>
              <p>${category.strCategoryDescription.slice(0, 100)}...</p>
             </div>
            </div>
        </div>
      `
    )
    .join("");
  rowData.classList.add("d-none");
  inputs.classList.add("d-none");
}

// Area

async function getArea() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  const data = await response.json();
  displayArea(data.meals);
}

getArea();

async function getAreaMeals(areaName) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`
  );
  const data = await response.json();

  if (data.meals) {
    displayMeals(data.meals);
  }
}

function displayArea(areas) {
  const container = document.getElementById("container");
  container.innerHTML = areas
    .map(
      (area) => `
        <div class="col-md-3">
          <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center cursor-pointer">
            <i class="fa-solid fa-house-laptop fa-4x mb-2"></i>
            <h4>${area.strArea}</h4>
          </div>
        </div>
      `
    )
    .join("");
  rowData.classList.add("d-none");
  inputs.classList.add("d-none");
}

// Ingredients

async function getIngredients() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  const data = await response.json();
  displayIngredients(data.meals.slice(0, 20)); // نعرض أول 20 فقط للتنظيم
  document.getElementById("container").classList.add("d-none");
  document.getElementById("container").classList.remove("d-none");
}
getIngredients();

async function getIngredientsMeals(ingredientName) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`
  );
  const data = await response.json();

  if (data.meals) {
    displayMeals(data.meals);
  } else {
    document.getElementById("ingredientsContainer").innerHTML =
      "<p class='text-center'>No meals found.</p>";
  }
}

function displayIngredients(ingredients) {
  const container = document.getElementById("container");
  container.innerHTML = ingredients
    .map(
      (ing) => `
        <div class="col-md-3">
          <div onclick="getIngredientsMeals('${ing.strIngredient
        }')"  class="rounded-2 text-center cursor-pointer">
            <i class="fa-solid fa-drumstick-bite fa-4x mb-2"></i>
            <h5>${ing.strIngredient}</h5>
            <p>${ing.strDescription?.split(" ").slice(0, 15).join(" ") || ""
        }...</p>
          </div>
        </div>
      `
    )
    .join("");
  rowData.classList.add("d-none");
  inputs.classList.add("d-none");
}

function displayMeals(meals) {
  const container = document.getElementById("container");
  container.innerHTML = meals
    .map(
      (meal) => `
        <div class="col-md-3">
          <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img src="${meal.strMealThumb}" class="w-100" alt="${meal.strMeal}">
            <div class="meal-layer position-absolute text-center text-black p-2">
              <h5>${meal.strMeal}</h5>
            </div>
          </div>
        </div>
      `
    )
    .join("");
  document.getElementById("container").innerHTML = mealsHTML;
  inputs.classList.remove("d-none");
}

// contact Us

function showContacts() {
  container.innerHTML = `
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
      <div class="container w-75 text-center">
        <div class="row g-4">
          <div class="col-md-6">
            <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
            <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
              Special characters and numbers not allowed
            </div>
          </div>
          <div class="col-md-6">
            <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
            <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
              Email not valid *exemple@yyy.zzz
            </div>
          </div>
          <div class="col-md-6">
            <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
            <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
              Enter valid Phone Number
            </div>
          </div>
          <div class="col-md-6">
            <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
            <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
              Enter valid age
            </div>
          </div>
          <div class="col-md-6">
            <input id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
            <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
              Enter valid password *Minimum eight characters, at least one letter and one number*
            </div>
          </div>
          <div class="col-md-6">
            <input id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
            <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
              Enter valid repassword
            </div>
          </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
      </div>
    </div>
  `;
  rowData.classList.add("d-none");
  inputs.classList.add("d-none");
}

function inputsValidation() {
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const phoneInput = document.getElementById("phoneInput");
  const ageInput = document.getElementById("ageInput");
  const passwordInput = document.getElementById("passwordInput");
  const repasswordInput = document.getElementById("repasswordInput");
  const submitBtn = document.getElementById("submitBtn");

  let nameRegex = /^[A-Za-z ]+$/;
  let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  let phoneRegex = /^01[0125][0-9]{8}$/;
  let ageRegex = /^([1-9][0-9]?|100)$/;
  let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  validateField(nameInput, nameRegex, "nameAlert");
  validateField(emailInput, emailRegex, "emailAlert");
  validateField(phoneInput, phoneRegex, "phoneAlert");
  validateField(ageInput, ageRegex, "ageAlert");
  validateField(passwordInput, passwordRegex, "passwordAlert");
  validateRepassword(passwordInput, repasswordInput, "repasswordAlert");

  if (
    nameRegex.test(nameInput.value) &&
    emailRegex.test(emailInput.value) &&
    phoneRegex.test(phoneInput.value) &&
    ageRegex.test(ageInput.value) &&
    passwordRegex.test(passwordInput.value) &&
    repasswordInput.value === passwordInput.value
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

function validateField(input, regex, alertId) {
  if (regex.test(input.value)) {
    document.getElementById(alertId).classList.add("d-none");
  } else {
    document.getElementById(alertId).classList.remove("d-none");
  }
}

function validateRepassword(passwordInput, repasswordInput, alertId) {
  if (
    repasswordInput.value === passwordInput.value &&
    repasswordInput.value !== ""
  ) {
    document.getElementById(alertId).classList.add("d-none");
  } else {
    document.getElementById(alertId).classList.remove("d-none");
  }
}

function openSideNav() {
  document.querySelector(".side-nav-menu").style.left = "0";
  document.getElementById("openBtn").classList.add("d-none");
  document.getElementById("closeBtn").classList.remove("d-none");
}

function closeSideNav() {
  document.querySelector(".side-nav-menu").style.left = "-250px";
  document.getElementById("closeBtn").classList.add("d-none");
  document.getElementById("openBtn").classList.remove("d-none");
}
