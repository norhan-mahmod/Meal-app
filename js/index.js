let settingbtn = document.querySelector("button.setting-btn");
let exitbtn = document.querySelector("button.exit-btn");
let nav = document.querySelector("nav.navbar");
let mealsList = document.querySelector("section div.meals-list");
let cardData = document.querySelector("section div.card-data");
let contactUs = document.querySelector("section.contact-us");
let searchSection = document.querySelector("section.search");
let searchByName = document.querySelector("section.search input.name-search");
let searchByFirstLetter = document.querySelector("section.search input.first-letter-search");
let baseurl = "https://www.themealdb.com/api/json/v1/1/";

class mappingObject {
    constructor(name,image,head,parag){
        this.name = name;
        this.image = image;
        this.head = head;
        this.parag = parag;
    }
}
let mealsData = new mappingObject("meals","strMealThumb","strMeal");
getData(baseurl + "search.php?s=" , mealsData);

// Get Recipes
async function getData(url ,indexData){
    let response = await fetch(url);
    let data = await response.json();
    display(data , indexData);
    cardClicked();
}

// card Clickeds
function cardClicked(){
    let cards = document.querySelectorAll("div.meals-list div.card");
    for(let i=0 ; i< cards.length;i++){
        cards[i].addEventListener("click", function(){
            if(this.getAttribute("cardType") == "meals"){
                mealsList.classList.add("d-none");
                cardData.classList.replace("d-none","d-flex");
                getMealData(this.querySelector("div h2").innerHTML);
            }
            else if(this.getAttribute("cardType") == "categories"){
                mealsList.innerHTML = "";
                getData(baseurl + `filter.php?c=${this.querySelector("div h2").innerHTML}` , mealsData);
            }
            else if(this.getAttribute("cardType") == "areas"){
                mealsList.innerHTML = "";
                getData(baseurl + `filter.php?a=${this.querySelector("h2").innerHTML}` , mealsData);
            }
            else if(this.getAttribute("cardType") == "ingrediants"){
                mealsList.innerHTML = "";
                getData(baseurl + `filter.php?i=${this.querySelector("h2").innerHTML}`, mealsData);
            }
        });
    }
}

// Display Recipes
function display(data ,indexData){
    let meals = data[indexData.name];
    for(let i = 0 ; i< meals.length ; i++){
        let card = document.createElement("div");
        card.classList.add("card","position-relative","overflow-hidden","border-0", "bg-black","p-1");
        card.setAttribute("cardType",indexData.name);
        let img = document.createElement("img");
        img.src = meals[i][indexData.image] ;
        img.classList.add("w-100");
        card.append(img);
        let content = document.createElement("div");
        content.classList.add("card-content","position-absolute","d-flex","flex-column","align-items-center","justify-content-center","top-0","bottom-0","start-0","end-0");
        let heading = document.createElement("h2");
        heading.textContent = meals[i][indexData.head];
        content.append(heading);
        if(indexData.parag != undefined){
            let paragraph = document.createElement("p");
            paragraph.classList.add("px-2")
            paragraph.textContent = meals[i][indexData.parag].slice(0,100);
            content.append(paragraph);
        }
        card.append(content);
        mealsList.append(card);
    }
}

// Show side bar menu
settingbtn.addEventListener("click" , showNav);
function showNav(){
    exitbtn.classList.replace("d-none" , "d-block");
    settingbtn.classList.add("d-none");
    nav.style.setProperty("transform" ,"translateX(0)");
    var navItems = document.querySelectorAll("nav.navbar li.nav-item");
    for(let i = 0 ; i< navItems.length ; i++)
        navItems[i].style.setProperty("transform","translateY(0)");
}
// Hide side bar menu
exitbtn.addEventListener("click" , hideNav);
function hideNav(){
    exitbtn.classList.replace("d-block","d-none");
    settingbtn.classList.replace("d-none","d-block");
    nav.style.setProperty("transform" ,"translateX(-85%)");
    var navItems = document.querySelectorAll("nav.navbar li.nav-item");
    for(let i = 0 ; i< navItems.length ; i++)
        navItems[i].style.setProperty("transform","translateY(500%)");
}

// Show Search inputs
document.querySelector("nav.navbar li.item-1").addEventListener("click",function(){
    searchSection.classList.replace("d-none" , "d-block");
    hideNav();
});

//Search By Name 
searchByName.addEventListener("input", function(){
    mealsList.innerHTML = '';
    getData(baseurl+ "search.php?s=" + this.value ,mealsData);
});

// Search By First Letter
searchByFirstLetter.addEventListener("input", function(){
    mealsList.innerHTML = '';
    getData(baseurl + "search.php?f=" + this.value ,mealsData);
});

// Show Categories
document.querySelector("nav.navbar li.item-2").addEventListener("click",function(){
    searchSection.classList.replace("d-block","d-none");
    mealsList.classList.replace("d-none","d-flex");
    cardData.classList.replace("d-flex","d-none");
    contactUs.classList.replace("d-block","d-none");
    hideNav();
    mealsList.innerHTML = '';
    let categoriesData = new mappingObject("categories","strCategoryThumb","strCategory","strCategoryDescription");
    getData(baseurl+ "categories.php" ,categoriesData);
});


async function getMealData(name){
    let response = await fetch(baseurl +`search.php?s=${name}`);
    let data = await response.json();
    let meal = data["meals"][0];
    cardData.firstElementChild.querySelector("img").src = meal["strMealThumb"];
    cardData.firstElementChild.querySelector("h2").textContent = name;
    let paragraph = cardData.children[1].querySelector("p");
    paragraph.textContent = meal["strInstructions"];
    paragraph.nextElementSibling.querySelector("span").textContent = meal["strArea"];
    paragraph.nextElementSibling.nextElementSibling.querySelector("span").textContent = meal["strCategory"];
    let recipes = cardData.children[1].querySelector("div.recipes");
    recipes.innerHTML = "";
    for(let i = 1 ; i<= 20 ; i++){
        if(meal[`strIngredient${i}`] == "" || meal[`strIngredient${i}`] == null)
            break;
        else{
            let recipe = document.createElement("p");
            recipe.classList.add("d-inline-block","bg-primary","p-2","mx-2","rounded-2");
            recipe.textContent = meal[`strMeasure${i}`] + " "+ meal[`strIngredient${i}`];
            recipes.append(recipe);
        }
    }
}
// Show Areas
document.querySelector("nav.navbar li.item-3").addEventListener("click",function(){
    searchSection.classList.replace("d-block","d-none");
    mealsList.classList.replace("d-none","d-flex");
    cardData.classList.replace("d-flex","d-none");
    contactUs.classList.replace("d-block","d-none");
    hideNav();
    mealsList.innerHTML = "";
    var areaindex = new mappingObject("","fa-house","strArea");
    getCardData(baseurl + "list.php?a=list",areaindex);
});

async function getCardData(url , index){
    let response = await fetch(url);
    let data = await response.json();
    displayCards(data , index);
    cardClicked();
}

function displayCards(data , index){
    let length = index.parag != undefined ? 20 : data["meals"].length;
    for(let i = 0 ; i<length;i++){
        let card = document.createElement("div");
        card.classList.add("card","overflow-hidden","border-0" , "text-white", "bg-black","p-2" , "text-center" , "fs-2");
        card.setAttribute("cardType","areas");
        let icon = document.createElement("i");
        icon.classList.add("fa-solid", index.image);
        card.append(icon);
        let head = document.createElement("h2");
        head.classList.add("m-1");
        head.textContent = data["meals"][i][index.head];
        card.append(head);
        if(index.parag != undefined){
            card.setAttribute("cardType","ingrediants");
            let paragraph = document.createElement("p");
            paragraph.classList.add("fs-6");
            paragraph.textContent = data["meals"][i][index.parag].slice(0, 100);
            card.append(paragraph);
        }
        mealsList.append(card);
    }
}

// Show Ingrediants
document.querySelector("nav.navbar li.item-4").addEventListener("click",function(){
    searchSection.classList.replace("d-block","d-none");
    mealsList.classList.replace("d-none","d-flex");
    cardData.classList.replace("d-flex","d-none");
    contactUs.classList.replace("d-block","d-none");
    hideNav();
    mealsList.innerHTML = "";
    var areaindex = new mappingObject("","fa-drumstick-bite","strIngredient","strDescription");
    getCardData(baseurl + "list.php?i=list",areaindex);
});

// Show Contact Us

let isvalidName = false ;
let isvalidEmail = false ;
let isvalidPhone = false ;
let isvalidAge = false ;
let isvalidPassword = false ;
let isvalidRepassword = false ;
let submitbtn = contactUs.querySelector("div.row button");
document.querySelector("nav.navbar li.item-5").addEventListener("click", function(){
    searchSection.classList.replace("d-block","d-none");
    if(mealsList.classList.contains("d-flex"))
        mealsList.classList.replace("d-flex","d-none");
    else
    mealsList.classList.add("d-none");
    cardData.classList.replace("d-flex","d-none");
    contactUs.classList.replace("d-none","d-block");
    hideNav();
    let firstInputDiv = contactUs.querySelector("div.row").firstElementChild;
    let nameInput = firstInputDiv.querySelector("input");
    let nameRegex = /^[A-Za-z]+$/;
    let emailInput = firstInputDiv.nextElementSibling.querySelector("input");
    let emailRegex = /^[A-Za-z]+@gmail.com$/;
    let phoneInput = emailInput.parentElement.nextElementSibling.firstElementChild;
    let phoneRegex = /^01[0-9]{9}$/;
    let ageInput = phoneInput.parentElement.nextElementSibling.firstElementChild;
    let ageRegex = /^[1-9]+$/;
    let passwordInput = ageInput.parentElement.nextElementSibling.firstElementChild;
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    let repassword = passwordInput.parentElement.nextElementSibling.firstElementChild;
    
    validateInput(nameInput,nameRegex , (isvalid) => isvalidName = isvalid);
    validateInput(emailInput,emailRegex , (isvalid) => isvalidEmail = isvalid);
    validateInput(phoneInput,phoneRegex, (isvalid) => isvalidPhone = isvalid);
    validateInput(ageInput,ageRegex, (isvalid) => isvalidAge = isvalid);
    validateInput(passwordInput,passwordRegex , (isvalid) => isvalidPassword = isvalid);
    

    repassword.addEventListener("input", function(){
        if(repassword.value != passwordInput.value)
        {
            showOrHideErrorMessage(false , repassword);
            isvalidRepassword = false;
        }
        else
        {
            showOrHideErrorMessage(true ,repassword);
            isvalidRepassword = true;
        }
        toggleSubmitButton();
    });
});

function validateInput(input , regex, setValidationStatus){
    input.addEventListener("input" , function(){
        let isValid = regex.test(this.value);
        setValidationStatus(isValid);
        showOrHideErrorMessage(isValid, input);
        toggleSubmitButton();
    });
}

function showOrHideErrorMessage(isValid , input){
    if(!isValid)
        input.nextElementSibling.classList.replace("d-none","d-block");
    else
        input.nextElementSibling.classList.replace("d-block" , "d-none");
}
function toggleSubmitButton(){
    
    if(isvalidName && isvalidEmail && isvalidPhone && isvalidAge && isvalidPassword &&isvalidRepassword)
        submitbtn.classList.remove("disabled");
    else
        if(!submitbtn.classList.contains("disabled"))
            submitbtn.classList.add("disabled");
}