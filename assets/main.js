const h2 = document.querySelector(".text-title");
const p = document.querySelector(".text");
const noteContainer = document.querySelector(".container");

const description = document.querySelector(".text");
description.addEventListener("click", () => {
  const container = document.querySelector(".container");
  const bgColor = document.querySelector(".color");
  bgColor.style.display = "block";
  bgColor.addEventListener("blur", () => {
    container.style.backgroundColor = bgColor.value;
    container.style.border = "0";
  });

  const h2 = document.querySelector(".text-title");
  h2.style.display = "block";
  addToDoBtn.style.display = "block";

  const inputFile = document.getElementById("fileToAdd");
  inputFile.addEventListener("change", () => {
    const filesSelected = inputFile.files;

    if (filesSelected.length > 0) {
      const fileToLoad = filesSelected[0];

      const fileReader = new FileReader();

      fileReader.onload = function (fileLoadedEvent) {
        const srcData = fileLoadedEvent.target.result; // <--- data: base64

        const newImage = document.createElement("img");
        newImage.src = srcData;
        newImage.style.width = "100%";
        newImage.style.height = "300px";

        const image = document.getElementById("showImage");
        image.innerHTML = newImage.outerHTML;
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  });
  const addImage = document.getElementById("attachFile");
  addImage.style.display = "block";
  addImage.addEventListener("click", () => {
    inputFile.click();
  });
});

const addToDoBtn = document.querySelector(".add-btn");
addToDoBtn.addEventListener("click", function () {
  const text = document.querySelector(".text").innerText;
  const title = document.querySelector(".text-title").innerText;
  const bgColor = document.querySelector(".color");
  const noteImage = document.getElementById("showImage");
  const addImage = document.getElementById("attachFile");

  function hideElements() {
    addImage.style.display = "none";
    addToDoBtn.style.display = "none";
    description.innerText = "";
    h2.innerText = "";
    h2.style.display = "none";
    bgColor.style.display = "none";
  }

  if (title !== "" || text !== "") {
    fetch("http://localhost:3000/todos", {
      method: "POST",
      body: JSON.stringify({
        title,
        text,
        completed: false,
        backgroundColor: bgColor.value,
        image: noteImage.innerHTML,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    hideElements();
    location.reload();
  } else {
    hideElements();
  }
});

function getToDos() {
  return fetch("http://localhost:3000/todos", {
    method: "GET",
  }).then((result) => result.json());
}

function createToDoElems(todos) {
  const fragment = document.createDocumentFragment();
  todos.forEach((todo) => {
    const selectedNote = todo.id;
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    const h2 = document.createElement("h2");
    const p = document.createElement("p");
    h2.innerText = todo.title;
    p.innerText = todo.text;
    const edit = document.createElement("button");
    edit.innerText = "Edit";
    edit.classList.add("btn");
    const done = document.createElement("button");
    done.innerText = "Done";
    done.classList.add("btn");
    const remove = document.createElement("button");
    remove.innerText = "Delete";
    remove.classList.add("btn");
    const color = document.createElement("input");
    color.type = "color";
    const attach = document.createElement("input");
    attach.type = "file";
    attach.setAttribute("id", "selectedFile");
    const addFile = document.createElement("input");
    addFile.type = "button";
    addFile.setAttribute("value", "Image");
    addFile.classList.add("btn");
    addFile.addEventListener("click", () => {
      attach.click();
    });
    const image = document.createElement("div");
    image.setAttribute("id", "imageToDisplay");
    const panelOfCommands = document.createElement("div");
    panelOfCommands.classList.add("panel");

    panelOfCommands.appendChild(checkbox);
    panelOfCommands.appendChild(attach);
    panelOfCommands.appendChild(color);
    panelOfCommands.appendChild(addFile);
    panelOfCommands.appendChild(edit);
    panelOfCommands.appendChild(done);
    panelOfCommands.appendChild(remove);
    li.appendChild(image);
    li.appendChild(h2);
    li.appendChild(p);
    li.appendChild(panelOfCommands);

    fragment.appendChild(li);

    function editContent() {
      h2.contentEditable = true;
      p.contentEditable = true;
      h2.classList.add("selected");
      p.classList.add("selected");
    }

    function saveEditedContent() {
      h2.contentEditable = false;
      p.contentEditable = false;
      h2.classList.remove("selected");
      p.classList.remove("selected");

      const selectedNote = todo.id;
      fetch(`http://localhost:3000/todos/${selectedNote}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: h2.innerText,
          text: p.innerText,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      location.reload();
    }

    function saveCheckbox() {
      if (checkbox.checked === true) {
        fetch(`http://localhost:3000/todos/${selectedNote}`, {
          method: "PATCH",
          body: JSON.stringify({
            completed: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
      } else {
        fetch(`http://localhost:3000/todos/${selectedNote}`, {
          method: "PATCH",
          body: JSON.stringify({
            completed: false,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
      }
    }

    function changeColor() {
      let updateColor = li.style.backgroundColor;
      updateColor = color.value;
      fetch(`http://localhost:3000/todos/${selectedNote}`, {
        method: "PATCH",
        body: JSON.stringify({
          backgroundColor: updateColor,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      location.reload();
    }

    function deleteNote() {
      const url = `http://localhost:3000/todos/${selectedNote}`;
      fetch(url, {
        method: "DELETE",
      });
      location.reload();
    }

    function encodeImageFileAsURL() {
      const filesSelected = attach.files;

      if (filesSelected.length > 0) {
        const fileToLoad = filesSelected[0];

        const fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent) {
          const srcData = fileLoadedEvent.target.result; // <--- data: base64

          const newImage = document.createElement("img");
          newImage.src = srcData;
          newImage.style.width = "100%";
          newImage.style.height = "300px";
          image.innerHTML = newImage.outerHTML;

          const selectedNote = todo.id;

          fetch(`http://localhost:3000/todos/${selectedNote}`, {
            method: "PATCH",
            body: JSON.stringify({
              image: image.innerHTML,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => res.json());
        };
        fileReader.readAsDataURL(fileToLoad);
      }
    }

    attach.addEventListener("change", encodeImageFileAsURL);
    color.addEventListener("blur", changeColor);
    edit.addEventListener("click", editContent);
    done.addEventListener("click", saveEditedContent);
    remove.addEventListener("click", deleteNote);
    checkbox.addEventListener("click", saveCheckbox);
  });

  return fragment;
}

async function displayToDos() {
  const toDos = await getToDos();

  const list = document.querySelector(".storedNotes");

  list.innerHTML = null;
  const toDoElems = createToDoElems(toDos);

  list.appendChild(toDoElems);

  const getElements = list.getElementsByTagName("li");
  Array.from(getElements).forEach((item, i) => {
    item.style.background = toDos[i].backgroundColor;
    item.firstChild.innerHTML = toDos[i].image;
  });
}

displayToDos();
