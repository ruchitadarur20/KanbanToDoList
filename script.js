<script>
      function addTask(columnId) {
            const input = document.querySelector(`#${columnId}-input`);
            const dateInput = document.querySelector(`#${columnId}-date`);
            const priorityInput = document.querySelector(`#${columnId}-priority`);
            const taskList = document.querySelector(`#${columnId} .task-list`);
            console.log("Adding task with priority:", priorityInput.value);

            if (input.value.trim() !== "" && dateInput.value !== "") {
                const priority = document.querySelector(`#${columnId}-priority`).value;
                const task = createTaskElement(input.value, columnId, dateInput.value, priority);
                taskList.appendChild(task);
                input.value = "";
                dateInput.value = "";
                priorityInput.value = "medium";
                saveTasks();
            }
        }

function createTaskElement(taskText, columnId, startDate, priority, endDate = null) {
    const task = document.createElement("div");
    task.className = `task ${priority}`;
    task.style.opacity = 0; // Initially transparent for animation

    // Task Title
    const text = document.createElement("span");
    text.textContent = taskText;
    task.appendChild(text);

    // Task Date
    const dateInfo = document.createElement("span");
    dateInfo.textContent = `Start: ${startDate}`;
    task.appendChild(dateInfo);

    // End Date (if exists)
    if (endDate) {
        const endDateInfo = document.createElement("span");
        endDateInfo.textContent = `End: ${endDate}`;
        task.appendChild(endDateInfo);
    }

    // Buttons container
    const buttons = document.createElement("div");

    // Buttons for "To-Do" Column
    if (columnId === "todo") {
        const moveToInProgress = document.createElement("button");
        moveToInProgress.textContent = "In Progress";
        moveToInProgress.onclick = () => moveTask(task, "in-progress", startDate, priority);
        buttons.appendChild(moveToInProgress);
    }

    // Buttons for "In Progress" Column
    if (columnId === "in-progress") {
        const moveToDone = document.createElement("button");
        moveToDone.textContent = "Done";
        moveToDone.className = "done"; // Styling for "Done" button
        moveToDone.onclick = () => moveTask(task, "done", startDate, priority);
        buttons.appendChild(moveToDone);

        const moveBackToTodo = document.createElement("button");
        moveBackToTodo.textContent = "To-Do";
        moveBackToTodo.onclick = () => moveTask(task, "todo", startDate, priority);
        buttons.appendChild(moveBackToTodo);
    }

    // Buttons for "Done" Column
    if (columnId === "done") {
        const moveBackToInProgress = document.createElement("button");
        moveBackToInProgress.textContent = "In Progress";
        moveBackToInProgress.onclick = () => moveTask(task, "in-progress", startDate, priority);
        buttons.appendChild(moveBackToInProgress);
    }

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";
    deleteButton.onclick = () => deleteTask(task);
    buttons.appendChild(deleteButton);

    // Append buttons to task
    task.appendChild(buttons);

    // Animate fade-in effect
    setTimeout(() => {
        task.style.opacity = 1;
    }, 10);

    return task;
}

        function moveTask(task, targetColumnId, startDate, priority) {
            const targetList = document.querySelector(`#${targetColumnId} .task-list`);
            const taskText = task.querySelector("span").textContent;
            const endDate = targetColumnId === "done" ? new Date().toISOString().split('T')[0] : null;
            targetList.appendChild(createTaskElement(taskText, targetColumnId, startDate, priority, endDate));
            task.remove();
            saveTasks();
        }

        function deleteTask(task) {
            task.remove();
            saveTasks();
        }

        function saveTasks() {
            const columns = document.querySelectorAll(".column");
            const data = {};

            columns.forEach(column => {
                const columnId = column.id;
                const tasks = Array.from(column.querySelectorAll(".task"));
                data[columnId] = tasks.map(task => {
                    const taskText = task.querySelector("span").textContent;
                    const startDate = task.querySelectorAll("span")[1].textContent.split(": ")[1];
                    const endDate = task.querySelectorAll("span")[2]?.textContent.split(": ")[1] || null;
                    const priority = task.classList[1];
                    return { text: taskText, startDate, priority, endDate };
                });
            });

            localStorage.setItem("kanbanTasks", JSON.stringify(data));
        }

        function loadTasks() {
            const data = JSON.parse(localStorage.getItem("kanbanTasks"));

            if (data) {
                Object.keys(data).forEach(columnId => {
                    const taskList = document.querySelector(`#${columnId} .task-list`);
                    taskList.innerHTML = "";

                    data[columnId].forEach(taskData => {
                        const task = createTaskElement(taskData.text, columnId, taskData.startDate, taskData.priority, taskData.endDate);
                        taskList.appendChild(task);
                    });
                });
            }
        }

        // Load tasks on page load
        loadTasks();
        function filterTasks() {
            const searchInput = document.getElementById("search-input").value.toLowerCase();
            const priorityFilter = document.getElementById("priority-filter").value;
            const tasks = document.querySelectorAll(".task");

            tasks.forEach(task => {
                const taskText = task.querySelector("span").textContent.toLowerCase();
                const taskPriority = task.classList.contains("high") ? "high"
                                    : task.classList.contains("medium") ? "medium"
                                    : "low";

                const matchesSearch = taskText.includes(searchInput);
                const matchesPriority = priorityFilter === "all" || taskPriority === priorityFilter;

                if (matchesSearch && matchesPriority) {
                    task.style.display = "block";
                } else {
                    task.style.display = "none";
                }
            });
        }
    </script>
