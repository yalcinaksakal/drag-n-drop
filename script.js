const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.querySelector(".backlog-list");
const progressList = document.querySelector(".progress-list");
const completeList = document.querySelector(".complete-list");
const onHoldList = document.querySelector(".on-hold-list");

// Items
let updatedOnLoad = false;
// Initialize Arrays(if no local storage)
let backlogListArray = ["Release the course", "Sit back and relax"];
let progressListArray = ["Work on projects", "Listen to music"];
let completeListArray = ["Being cool", "Getting stuff done"];
let onHoldListArray = ["Being uncool"];
let listArrays = [
  { name: "backlog", arr: backlogListArray },
  { name: "progress", arr: progressListArray },
  { name: "complete", arr: completeListArray },
  { name: "onHold", arr: onHoldListArray },
];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragCounter = 0;
let isDragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("kanbanBoard"))
    listArrays = JSON.parse(localStorage.kanbanBoard);
  //set array's DOM elements
  listArrays[0].el = backlogList;
  listArrays[1].el = progressList;
  listArrays[2].el = completeList;
  listArrays[3].el = onHoldList;
}

// Set localStorage Arrays
function updateSavedColumns() {
  localStorage.setItem(`kanbanBoard`, JSON.stringify(listArrays));
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true; ///dragable
  listEl.setAttribute("ondragstart", `drag(event)`);
  listEl.contentEditable = true;
  listEl.id = index;

  // listEl.setAttribute(`onfocusout`, `updateItem(${index},${column})`);
  // const img = document.createElement("img");
  // img.setAttribute("src", "./trash.png");
  // img.style.width = "5px";
  // img.style.height = "auto";
  // img.style.float = "left";
  // img.style.marginRight='2px';
  // listEl.prepend(img);
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) getSavedColumns();
  //
  listArrays.forEach((arr, i) => {
    arr.el.textContent = "";
    arr.arr.forEach((item, j) => createItemEl(arr.el, i, item, j));
  });
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

function updateItem(id, column) {
  const selectedColumnEl = listColumns[column].children;
  if (!isDragging) {
    listArrays[column].arr[id] = selectedColumnEl[id].textContent;
    //if text content is empty delete item
    listArrays[column].arr = listArrays[column].arr.filter(el => el !== "");
    updateDOM();
  }
}
//allow arrays to reflect drag and drop

function rebuildArrays() {
  listArrays.forEach(arr => {
    arr.arr = [];
    Array.from(arr.el.children).forEach(el => arr.arr.push(el.textContent));
  });
  updateDOM();
}

//when item starts dragging
function drag(e) {
  isDragging = true;
  if (e.target.classList?.contains("drag-item")) draggedItem = e.target;
}
//column allows for item to drop
function allowDrop(e) {
  e.preventDefault();
}

//Item enters column area
function dragEnter(column) {
  //use drag counter to ovoid entering/leaving child node
  dragCounter++;
  listColumns[column].classList.add("over");
  currentColumn = column;
}

//Item enters column area
function dragLeave(column) {
  dragCounter--;
  if (!dragCounter) listColumns[column].classList.remove("over");
}

function drop(e) {
  e.preventDefault();
  console.log(e);
  //remove background color/padding
  listColumns.forEach(c => c.classList.remove("over"));
  //drag is over
  dragCounter = 0;
  //add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  rebuildArrays();
  isDragging = false;
}
//add new items, reset input field
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  if (itemText) {
    listArrays[column].arr.push(itemText);
    updateDOM();
    addItems[column].textContent = "";
  }
}

function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
  addItems[column].focus();
}

function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

//onload
updateDOM();
