import { saveToDoList } from "./localStorage.js";

const form = document.getElementById("inputForm");
const input = document.getElementById("input");
const lists = document.getElementById("lists");

// Manage empty state UI by checking if the todo list is empty
export const noLists = () => {
  const hasList = lists.querySelectorAll("li").length > 0;
  let note = document.querySelector(".noListNote");
  if (!hasList) {
    if (!note) {
      note = document.createElement("p");
      note.classList.add("noListNote");
      note.innerText = "No tasks yet!";
      lists.appendChild(note);
    }
    return;
  }
  if (note) {
    note.remove();
  }
};
noLists();

// Create
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  let errorMessage = document.querySelector(".err");
  if (!text) {
    if (!errorMessage) {
      errorMessage = document.createElement("p");
      errorMessage.classList.add("err");
      errorMessage.innerText = "📝 Please type your task!";
      input.insertAdjacentElement("afterend", errorMessage);
    } else {
      // Reset animation to allow replay on repeated invalid submissions
      errorMessage.style.animation = "none";
      errorMessage.offsetHeight; // force browser reflow
      errorMessage.style.animation = "shake 0.3s ease-in-out";
    }
    return;
  }
  if (errorMessage) {
    errorMessage.remove();
  }

  const list = document.createElement("li");
  list.innerHTML = `
  <input type="checkbox" class="checkbox" />
  <p>${text}</p>
  <div>
  <button class="edit">✏️</button>
  <button class="delete">🗑️</button>
  </div>
  `;

  lists.appendChild(list);
  saveToDoList();

  input.value = "";
  noLists();
});

// Update
let editItem = null;
lists.addEventListener("click", (e) => {
  if (e.target.textContent === "✏️") {
    const list = e.target.closest("li");

    // Enter edit mode: disable input, add, other edit actions, checkboxes, and delete
    // 1. Prevent editing other tasks during edit mode
    if (editItem && editItem !== list) return;
    editItem = list;
    // 2. Disable input field during edit mode
    input.disabled = true;
    // 3. Disable add button during edit mode
    const submitBtn = form.querySelector("button");
    submitBtn.disabled = true;
    // 4. Disable all checkboxes during edit mode
    const checkboxes = document.querySelectorAll(".checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.disabled = true;
    });

    const text = list.querySelector("p");
    const buttons = list.querySelector("div");

    const edit = document.createElement("input");
    edit.type = "text";
    edit.value = text.textContent;

    const save = document.createElement("button");
    save.innerText = "💾";

    const editMode = document.createElement("div");
    editMode.classList.add("edit");
    editMode.appendChild(edit);
    editMode.appendChild(save);

    list.replaceChild(editMode, text);
    list.removeChild(buttons);

    save.addEventListener("click", (e) => {
      text.textContent = edit.value.trim() || text.textContent;
      list.replaceChild(text, editMode);
      saveToDoList();

      list.appendChild(buttons);
      editItem = null;
      input.disabled = false;
      submitBtn.disabled = false;
      checkboxes.forEach((checkbox) => {
        checkbox.disabled = false;
      });
    });
  }
});

// Delete
lists.addEventListener("click", (e) => {
  // Enter edit mode: disable input, add, other edit actions, checkboxes, and delete
  // 5. Prevent deleting tasks during edit mode
  if (editItem) return;

  if (e.target.textContent === "🗑️") {
    const list = e.target.closest("li");
    list.remove();
    saveToDoList();
    noLists();
  }
});

// Complete Tasks
lists.addEventListener("change", (e) => {
  if (e.target.tagName === "INPUT") {
    const list = e.target.closest("li");
    list.classList.toggle("completed", e.target.checked);

    const editBtn = list.querySelector(".edit");
    editBtn.disabled = e.target.checked;

    saveToDoList();
  }
});
