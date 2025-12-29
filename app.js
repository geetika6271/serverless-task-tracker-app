window.onload = function () {
    // Fetch and display existing tasks when the page loads
    fetchTasks();

      async function fetchTasks() {
        try {
            const response = await fetch('<api-url>/recipes', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',  // Accept header to specify the response type
                    'Content-Type': 'application/json',  // Content-Type header (if needed)
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';  


            if (data && Array.isArray(data.tasks)) {
                data.tasks.forEach(task => {
                    const taskItem = document.createElement('div');
                    taskItem.classList.add('task-item');
                    taskItem.textContent = `${task.name}: ${task.status}`;

                    // Create a delete button
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = () => deleteTask(task.id);

                    // Create an update button
                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update';
                    updateButton.onclick = () => updateTask(task.id);

                    // Append buttons to the task item
                    taskItem.appendChild(deleteButton);
                    taskItem.appendChild(updateButton);
                    taskList.appendChild(taskItem);
                });
            } else {
                console.error('Unexpected data format', data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    // Function to add a new task
    window.addTask = async function () {
        const taskInput = document.getElementById('taskInput');
        const taskName = taskInput.value.trim();

        if (!taskName) {
            alert("Please enter a task!");
            return;
        }

        const newTask = {
            name: taskName,
            status: 'pending' 
        };

        try {
            const response = await fetch('<api-url>/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) {
                throw new Error('Failed to add task');
            }

            const data = await response.json();
            console.log('Task added:', data);

            taskInput.value = ''; 
            fetchTasks();  
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    // Function to update a task
    window.updateTask = async function (taskId) {
        const newStatus = prompt('Enter the new status (e.g., "completed", "pending")');

        if (!newStatus) {
            alert("Please enter a valid status!");
            return;
        }

        const updatedTask = {
            status: newStatus
        };

        try {
            const response = await fetch(`<api-url>/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            const data = await response.json();
            console.log('Task updated:', data);

            fetchTasks();  
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    // Function to delete a task
    window.deleteTask = async function (taskId) {

        try {
            const response = await fetch(`<api-url>/${taskId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            const data = await response.json();
            console.log('Task deleted:', data);

            fetchTasks(); 
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };
};
