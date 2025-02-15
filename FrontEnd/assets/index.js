let gallery = document.querySelector(".gallery")
let filtersNavigation = document.querySelector(".filters-navigation");
let modal = document.querySelector("#modal");
let modalGalleryImage = document.querySelector(".modal-gallery-image");
let modalGallery = document.querySelector(".modal-gallery");
let modalAddImage = document.querySelector(".modal-add-image");
let selectForm = document.querySelector("#category");
let body = document.querySelector("body");
let imgSophie = document.querySelector("#introduction img");
let galleryTitle = document.querySelector("#portfolio h2");
let token = window.sessionStorage.getItem("token");
let formAddWork = document.querySelector("#add-box");
let inputElement = document.querySelector("#uploadTitle");
let selectElement = document.querySelector("#category");
let fileInputElement = document.querySelector("#image");
let confirmButton = document.querySelector("#confirm-button");
let inputFile = document.querySelector("#image");

initialize();

async function initialize() {
    await getWorks();
    await getCategories();
};

if (token !== null) {
    admin();
}

function createProject(project) {
    let projectFigure = document.createElement("figure");
    projectFigure.setAttribute("data-tag", project.category.name);
    projectFigure.setAttribute("data-id", project.id);

    let projectImage = document.createElement("img");
    projectImage.src = project.imageUrl;
    projectImage.alt = project.title;

    let projectCaption = document.createElement("figcaption");
    projectCaption.innerText = project.title;

    projectFigure.appendChild(projectImage);
    projectFigure.appendChild(projectCaption);
    gallery.appendChild(projectFigure);
};

function createButton(category) {
    let filtersButton = document.createElement("button");
    filtersButton.setAttribute("data-tag", category.name);
    filtersButton.setAttribute("data-id", category.id);
    filtersButton.innerText = category.name;
    filtersNavigation.appendChild(filtersButton);
};

function createOption(category) {
    let formOption = document.createElement("option");
    formOption.setAttribute("value", category.id);
    formOption.innerText = category.name;
    selectForm.appendChild(formOption);
};

function dropElement(parent_element) {
    while (parent_element.childNodes.length > 0) {
        parent_element.removeChild(parent_element.lastChild);
    }
};

async function getWorks(categoryId) {
    await fetch("http://localhost:5678/api/works")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Error");
            }
        })
        .then((project) => {
            dropElement(gallery);
            dropElement(modalGallery);
            project.forEach((project) => {
                if (categoryId == project.category.id || categoryId == null) {
                    createProject(project);
                    createModalProject(project);
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

async function getCategories(category) {
    await fetch("http://localhost:5678/api/categories")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Error");
            }
        })
        .then((category) => {
            category.forEach((category) => {
                createButton(category);
                createOption(category);
            });
        })
        .then((filter) => {
            let buttons = document.querySelectorAll(".filters-navigation button");

            buttons.forEach((button) => {
                button.addEventListener("click", function() {
                    let catId = button.getAttribute("data-id");
                    console.log(catId);
                    buttons.forEach((button) => button.classList.remove("is-active"));
                    this.classList.add("is-active");
                    getWorks(catId);
                });
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

function logOut() {
    sessionStorage.removeItem("token");
    window.location.href = "./index.html";
};

function admin() {
    galleryTitle.insertAdjacentHTML(
        "afterend",
        `<a id="open-modal" href="#modal" class="edit-link">
      <i class="fa-regular fa-pen-to-square"></i>Edit
    </a>`
    );

    document.querySelector(".filters-navigation").style.display = "none";
    document.querySelector(".portfolio-title").style.paddingBottom = "76px";

    let logButton = document.querySelector("#logButton");
    logButton.innerHTML = `<a href="./index.html">Logout</a>`;
    logButton.addEventListener("click", logOut);
    let modalLink = document.querySelector("#open-modal");
    modalLink.addEventListener("click", openModal);
};

async function deleteWork(workID) {
    await fetch("http://localhost:5678/api/works/" + workID, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    }).catch((error) => {
        console.log(error);
    });

    getWorks();
};

function createModalProject(project) {
    let figureModalProject = document.createElement("figure");
    figureModalProject.setAttribute("data-id", project.id);
    let imageModalProject = document.createElement("img");
    imageModalProject.src = project.imageUrl;
    imageModalProject.alt = project.title;
    imageModalProject.classList.add("modal-project-img");
    let trashIcon = document.createElement("img");
    trashIcon.src = "assets/icons/trash-icon.svg";
    trashIcon.classList.add("trash-icon");
    trashIcon.setAttribute("data-id", project.id);
    let trashIconID = trashIcon.getAttribute("data-id");
    trashIcon.addEventListener("click", function(event) {
        event.preventDefault();
        if (confirm("Are you sure you want to delete this project ?") == true) {
            deleteWork(trashIconID);
        }
    });

    figureModalProject.appendChild(imageModalProject);
    figureModalProject.appendChild(trashIcon);

    modalGallery.appendChild(figureModalProject);
};

function showFile(e) {
    e.preventDefault();
    let reader = new FileReader();
    reader.readAsDataURL(inputFile.files[0]);
    reader.addEventListener("load", function() {
        previewImage.src = reader.result;
    });
    let previewBox = document.querySelector(".upload-image-box");
    let previewImage = document.createElement("img");
    previewImage.setAttribute("id", "preview-image");
    let photoUploadButton = document.querySelector(".photo-upload-button");
    photoUploadButton.style.display = "none";
    let pictureIcon = document.querySelector(".picture-icon");
    pictureIcon.style.display = "none";
    let typeFiles = document.querySelector(".type-files");
    typeFiles.style.display = "none";
    previewBox.appendChild(previewImage);
};

function checkForm() {
    if (inputElement.value !== "" && selectElement.value !== "" && fileInputElement.value !== "") {
        confirmButton.style.backgroundColor = "#1D6154";
        confirmButton.style.color = "#ffffff";
    } else {
        return console.log("Incomplete form");
    }
};

inputFile.addEventListener("change", showFile);
inputElement.addEventListener("input", checkForm);
selectElement.addEventListener("input", checkForm);
fileInputElement.addEventListener("change", checkForm);

async function addWork() {
    let getPhoto = document.getElementById("image").files[0];
    let getTitle = document.getElementById("uploadTitle").value;
    let getCategory = document.getElementById("category").value;
    let formData = new FormData();
    formData.append("image", getPhoto);
    formData.append("title", getTitle);
    formData.append("category", getCategory);

    await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                Accept: "application/json",
            },
            body: formData,
        })
        .then((response) => {
            if (response.ok) {
                getWorks();
                closeModal();
                console.log("Your project has been successfully added!");
                return response.json();
            } else {
                console.log("Error");
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

function confirmForm(e) {
    e.preventDefault();
    const errMessImg = document.querySelector("#error-img");
    const errMessTitle = document.querySelector("#error-title");
    const errMessCat = document.querySelector("#error-category");
    if (inputElement.value !== "" && selectElement.value !== "" && fileInputElement.value !== "") {
        addWork();
    }
    if (inputFile.value == "") {
        errMessImg.innerHTML = "Image Required";
    } else {
        errMessImg.innerHTML = "";
    }
    if (inputElement.value == "") {
        errMessTitle.innerHTML = "Title Required";
    } else {
        errMessTitle.innerHTML = "";
    }
    if (selectElement.value == "") {
        errMessCat.innerHTML = "Category Required";
    } else {
        errMessCat.innerHTML = "";
    }
};

function openModal() {
    modal.classList.remove("modal-non-active");
    modal.setAttribute("aria-hidden", "false");
    modalGalleryImage.classList.remove("modal-non-active");
    let addButton1 = document.querySelector("#add-image-button1");
    addButton1.addEventListener("click", (event) => {
        modalGalleryImage.classList.add("modal-non-active");
        modalAddImage.classList.remove("modal-non-active");
        let closeIcon2 = document.querySelector(".close-icon-2");
        closeIcon2.addEventListener("click", closeModal);
        let backIcon = document.querySelector(".back-icon");
        backIcon.addEventListener("click", (event) => {
            modalGalleryImage.classList.remove("modal-non-active");
            modalAddImage.classList.add("modal-non-active");
        });
    });

    formAddWork.addEventListener("submit", confirmForm);
    let closeIcon = document.querySelector(".close-icon");
    closeIcon.addEventListener("click", closeModal);

    document.getElementById("modal").addEventListener("click", (event) => {
        if (event.target === document.getElementById("modal")) {
            closeModal();
        }
    });

    getWorks();
};

function closeModal() {
    modal.classList.add("modal-non-active");
    modalGalleryImage.classList.add("modal-non-active");
    modalAddImage.classList.add("modal-non-active");

    document.querySelector("#add-box").reset();

    let previewBox = document.querySelector(".upload-image-box");
    let previewImage = document.querySelector("#preview-image");
    if (previewImage !== null) {
        previewBox.removeChild(previewImage);
    }

    let photoUploadButton = document.querySelector(".photo-upload-button");
    photoUploadButton.style.display = "";
    let pictureIcon = document.querySelector(".picture-icon");
    pictureIcon.style.display = "";
    let typeFiles = document.querySelector(".type-files");
    typeFiles.style.display = "";

    confirmButton.style.backgroundColor = "#a7a7a7";
};