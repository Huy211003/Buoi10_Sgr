document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.querySelector(".add-btn");
    const taskInput = document.querySelector(".add-task input");
    const taskList = document.querySelector(".task-list ul");

    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach(taskContent => {
        const newTask = createTaskElement(taskContent);
        taskList.appendChild(newTask);
        addDeleteEvent(newTask);
    });

    addButton.addEventListener("click", function () {
        const taskContent = taskInput.value.trim();

        if (taskContent !== "") {
            const newTask = createTaskElement(taskContent);
            taskList.appendChild(newTask);
            addDeleteEvent(newTask);

            saveTasksToLocalStorage();

            taskInput.value = "";
            // Ẩn border khi có công việc được thêm vào
            taskList.parentElement.classList.remove("empty");
        }
    });

    function createTaskElement(taskContent) {
        const newTask = document.createElement("li");
        newTask.classList.add("task");
        newTask.innerHTML = `
            <span>${taskContent}</span>
            <button class="delete-btn">Delete</button>
            <button class="edit-btn">Edit</button>
        `;
        return newTask;
    }

    function addDeleteEvent(taskElement) {
        const deleteButton = taskElement.querySelector(".delete-btn");
        deleteButton.addEventListener("click", function () {
            taskElement.remove();
            saveTasksToLocalStorage();
        });
    }

    function saveTasksToLocalStorage() {
        const tasks = [];
        taskList.querySelectorAll(".task span").forEach(task => {
            tasks.push(task.textContent);
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});
