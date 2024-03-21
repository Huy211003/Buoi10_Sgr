document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.querySelector(".add-btn");
    const taskInput = document.querySelector(".add-task input");
    const taskList = document.querySelector(".task-list ul");
    const allButton = document.querySelector(".all-btn");
    const doneButton = document.querySelector(".done-btn");
    const undoneButton = document.querySelector(".undone-btn");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all"; // Mặc định là hiển thị tất cả các công việc
    let editedTaskIndex = null; // Lưu chỉ số của task đang được chỉnh sửa

    renderTasks(tasks);

    addButton.addEventListener("click", function () {
        if (editedTaskIndex !== null) {
            handleEditButtonClick();
        } else {
            handleAddButtonClick();
        }
    });

    function renderTasks(tasksToShow) {
        taskList.innerHTML = "";

        tasksToShow.forEach((task, index) => {
            if (currentFilter === "all" || (currentFilter === "done" && task.done) || (currentFilter === "undone" && !task.done)) {
                const newTask = createTaskElement(task.content, task.done, index);
                taskList.appendChild(newTask);
            }
        });
    }

    function createTaskElement(taskContent, isDone, index) {
        const newTask = document.createElement("li");
        newTask.classList.add("task");
        if (isDone) {
            newTask.classList.add("done");
        }
        newTask.innerHTML = `
            <span class="${isDone ? 'done-text' : ''}">${taskContent}</span>
            <button class="delete-btn">Delete</button>
            <button class="edit-btn">Edit</button>
        `;

        newTask.addEventListener("click", function (event) {
            const targetElement = event.target;
            if (targetElement.classList.contains("delete-btn")) {
                event.stopPropagation();
                tasks.splice(index, 1);
                saveTasksToLocalStorage();
                renderTasks(tasks);
            } else if (targetElement.classList.contains("edit-btn")) {
                taskInput.value = taskContent;
                addButton.textContent = 'Edit';
                editedTaskIndex = index; // Lưu chỉ số của task đang được chỉnh sửa
            } else {
                tasks[index].done = !tasks[index].done;
                saveTasksToLocalStorage();
                renderTasks(tasks);
            }
        });

        return newTask;
    }

    function handleAddButtonClick() {
        const taskContent = taskInput.value.trim();
        if (taskContent !== "") {
            const newTask = {
                content: taskContent,
                done: false
            };

            tasks.push(newTask);
            saveTasksToLocalStorage();
            renderTasks(tasks);
            taskInput.value = "";
        }
    }

    function handleEditButtonClick() {
        const updatedTaskContent = taskInput.value.trim();
        if (updatedTaskContent !== "") {
            tasks[editedTaskIndex].content = updatedTaskContent;
            saveTasksToLocalStorage();
            renderTasks(tasks);
            taskInput.value = "";
            addButton.textContent = 'Add';
            editedTaskIndex = null; // Đặt lại chỉ số của task đang được chỉnh sửa về null
        }
    }

    function saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    allButton.addEventListener("click", function () {
        currentFilter = "all";
        setActiveButton(allButton);
        renderTasks(tasks);
    });

    doneButton.addEventListener("click", function () {
        currentFilter = "done";
        setActiveButton(doneButton);
        renderTasks(tasks);
    });

    undoneButton.addEventListener("click", function () {
        currentFilter = "undone";
        setActiveButton(undoneButton);
        renderTasks(tasks);
    });

    function setActiveButton(button) {
        const buttons = document.querySelectorAll(".nav button");
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    }
});
