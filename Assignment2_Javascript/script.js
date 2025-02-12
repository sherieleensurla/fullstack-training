// Initialize tasks from localStorage (if available)
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// DOM elements
const addTaskBtn = document.getElementById("addTaskBtn");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskDueDateInput = document.getElementById("taskDueDate");
const outputTable = document.getElementById("outputTable");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const editTaskModal = document.getElementById("editTaskModal");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const confirmationModal = document.getElementById("confirmationModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

let currentEditIndex = null; // Track the task index being edited

// Function to apply search and filter logic
function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const filterValue = filterSelect.value;

  return tasks.filter(task => {
    // Filter by title or description (search)
    const matchesSearch = task.title.toLowerCase().includes(searchText) || 
                          task.description.toLowerCase().includes(searchText);

    // Filter by completion status
    const matchesCompletion = filterValue === "all" || 
                              (filterValue === "completed" && task.completed) || 
                              (filterValue === "incomplete" && !task.completed);

    return matchesSearch && matchesCompletion;
  });
}

// Function to render tasks to the table
function renderTasks() {
  const filteredTasks = applyFilters();  

  // Clear the current table contents
  outputTable.innerHTML = `
    <tr>
      <th>Title</th>
      <th>Description</th>
      <th>Date</th>
      <th>Actions</th>
    </tr>`;

  filteredTasks.forEach((task, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="${task.completed ? 'completed' : ''}">${task.title}</td>
      <td class="${task.completed ? 'completed' : ''}">${task.description}</td>
      <td class="${task.completed ? 'completed' : ''}">${task.dueDate}</td>
      <td>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
        <button class="complete-btn" data-index="${index}">${task.completed ? 'Undo' : 'Completed'}</button>
      </td>
    `;
    outputTable.appendChild(row);
  });
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
addTaskBtn.addEventListener("click", () => {
  const title = taskTitleInput.value;
  const description = taskDescriptionInput.value;
  const dueDate = taskDueDateInput.value;

  if (title && description && dueDate) {
    tasks.push({
      title,
      description,
      dueDate,
      completed: false,
    });

    saveTasks();
    renderTasks();  // Re-render after adding a task

    // Clear the form fields after adding
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskDueDateInput.value = "";
  } else {
    alert("Please fill out all fields.");
  }
});

// Edit task
function editTask(index) {
  currentEditIndex = index; // Store the task index

  // Populate the modal with the task's data
  const task = tasks[index];
  document.getElementById("editTaskTitle").value = task.title;
  document.getElementById("editTaskDescription").value = task.description;
  document.getElementById("editTaskDueDate").value = task.dueDate;

  // Display the modal
  editTaskModal.style.display = "block";
}

// Save the edited task
saveEditBtn.addEventListener("click", () => {
  const updatedTitle = document.getElementById("editTaskTitle").value;
  const updatedDescription = document.getElementById("editTaskDescription").value;
  const updatedDueDate = document.getElementById("editTaskDueDate").value;

  if (updatedTitle && updatedDescription && updatedDueDate) {
    // Update the task with the new data
    tasks[currentEditIndex] = {
      title: updatedTitle,
      description: updatedDescription,
      dueDate: updatedDueDate,
      completed: tasks[currentEditIndex].completed, // Keep the completed status
    };

    // Save updated tasks to localStorage
    saveTasks();
    renderTasks();  // Re-render after editing

    // Close the edit modal
    editTaskModal.style.display = "none";
  } else {
    alert("Please fill out all fields.");
  }
});

// Cancel editing (close the modal without saving)
cancelEditBtn.addEventListener("click", () => {
  editTaskModal.style.display = "none"; // Close the modal without saving
});

// Close the modal if the user clicks anywhere outside of it
window.addEventListener("click", (event) => {
    if (event.target === editTaskModal) {
        editTaskModal.style.display = "none"; // Close the modal if clicked outside
    }
  });

// Event delegation for the task actions (edit, delete, complete)
outputTable.addEventListener("click", (event) => {
  const index = event.target.getAttribute("data-index");

  if (event.target.classList.contains("edit-btn")) {
    editTask(index); // Open the edit modal
  } else if (event.target.classList.contains("delete-btn")) {
    // Use native confirm() for confirmation before deletion
    deleteTask(index);
  } else if (event.target.classList.contains("complete-btn")) {
    tasks[index].completed = !tasks[index].completed; // Toggle completion status
    saveTasks();
    renderTasks(); // Re-render after completion status change
  }
});

// Function to delete a task
// Variable to store the index of the task to delete
let taskToDeleteIndex = null;

// Function to handle the deletion
function deleteTask(index) {
  taskToDeleteIndex = index; // Store the task index
  confirmationModal.style.display = "block"; // Show the confirmation modal
}

// Event listener for confirming the delete action
confirmDeleteBtn.addEventListener("click", () => {
  tasks.splice(taskToDeleteIndex, 1); // Delete the task
  saveTasks();
  renderTasks();
  confirmationModal.style.display = "none"; // Close the modal
});

// Event listener for canceling the delete action
cancelDeleteBtn.addEventListener("click", () => {
  confirmationModal.style.display = "none"; // Close the modal
});

// Close the modal if the user clicks anywhere outside of it
window.addEventListener("click", (event) => {
  if (event.target === confirmationModal) {
    confirmationModal.style.display = "none"; // Close the modal if clicked outside
  }
  
});


// Handle filtering and searching
filterSelect.addEventListener("change", renderTasks);
searchInput.addEventListener("input", renderTasks);

// Initial render of tasks
renderTasks();
