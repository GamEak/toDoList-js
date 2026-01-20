import { noLists } from "./toDoList.js";

export const saveToDoList = () => {
  const lists = [];

  document.querySelectorAll("#lists li").forEach((list) => {
    const text = list.querySelector("p").textContent;
    const completed = list.classList.contains("completed");

    lists.push({ text, completed });
  });

  localStorage.setItem("toDoList", JSON.stringify(lists));
};

window.addEventListener("DOMContentLoaded", () => {
  const lists = JSON.parse(localStorage.getItem("toDoList")) || [];
  lists.forEach(({ text, completed }) => {
    const list = document.createElement("li");
    list.innerHTML = `
    <input type="checkbox" class="checkbox" ${completed ? "checked" : ""} />
    <p>${text}</p>
    <div>
    <button class="edit">✏️</button>
    <button class="delete">🗑️</button>
    </div>
    `;

    const lists = document.getElementById("lists");
    lists.appendChild(list);

    list.classList.toggle("completed", completed);
    const editBtn = list.querySelector(".edit");
    editBtn.disabled = completed;

    noLists();
  });
});
