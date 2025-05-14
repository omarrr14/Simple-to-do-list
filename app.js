// Get DOM elements
const dayName = document.querySelector('#dayName');
const dayNum = document.querySelector('#dayNum');
const taskInput = document.querySelector('#taskInput');
const addBTN = document.querySelector('#addBTN');
const tasksToDo = document.querySelector('#tasks-to-do');
const uncomplatedTasksNum = document.querySelector('.to-do-Num');
const complatedTasksNum = document.querySelector('.done');
const complated = document.querySelector('.complated');
const audio = document.querySelector('audio');

// Set current date
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const currentDate = new Date();

dayNum.innerHTML = currentDate.getDate();
dayName.innerHTML = daysOfWeek[currentDate.getDay()];

// Function to check if it's a new day and reset tasks if needed
const checkForNewDay = function() {
    const lastDate = localStorage.getItem('lastDate');
    const todayDate = currentDate.toDateString();
    
    if (lastDate !== todayDate) {
        // It's a new day, clear all tasks
        localStorage.setItem('uncomplatedTasks', '[]');
        localStorage.setItem('complatedTasks', '[]');
        // Save today's date
        localStorage.setItem('lastDate', todayDate);
        console.log('New day detected! Tasks have been reset.');
    }
};

// Run the check for new day
checkForNewDay();

// Initialize tasks arrays from localStorage or create empty arrays
let currentTasks = JSON.parse(localStorage.getItem('uncomplatedTasks') || '[]');
let complatedTasks = JSON.parse(localStorage.getItem('complatedTasks') || '[]');

// Add task event listener
addBTN.addEventListener('click', function(e) {
    e.preventDefault();
    if (taskInput.value.trim() !== '') {
        currentTasks.push({
            title: taskInput.value.trim(),
            isDone: false,
        });

        // Save to localStorage
        localStorage.setItem('uncomplatedTasks', JSON.stringify(currentTasks));
        
        // Clear input
        taskInput.value = '';
        
        // Update task lists
        updateTasks();
    }
});

// Update tasks in the UI
const updateTasks = function() {
    // Clear containers
    tasksToDo.innerHTML = '';
    complated.innerHTML = '';

    // Handle empty task list
    if (currentTasks.length === 0) {
        tasksToDo.innerHTML = `<p class="text-center text-blue-500">There are no tasks to complete</p>`;
    } else {
        // Generate HTML for uncompleted tasks
        currentTasks.forEach((task, index) => {
            tasksToDo.innerHTML += `
                <div class="flex justify-between items-center w-full py-2 px-4 border-b border-b-cyan-950">
                    <p class="w-4/5 truncate">${task.title}</p>
                    
                    <div class="flex gap-2">
                        <button onclick="finishTask(${index})" class="cursor-pointer hover:text-green-300">
                            <i class="fa-solid fa-circle-check p-2 rounded-full hover:text-green-400"></i>
                        </button>
                        <button onclick="deleteTask(${index})" class="cursor-pointer hover:text-red-500">
                            <i class="fa-solid fa-trash p-2 rounded-full hover:text-red-400"></i>
                        </button>
                    </div>
                </div>`;
        });
    }

    // Update task counters
    uncomplatedTasksNum.innerHTML = `(${currentTasks.length})`;
    complatedTasksNum.innerHTML = `(${complatedTasks.length})`;

    // Generate HTML for completed tasks
    complatedTasks.forEach(task => {
        complated.innerHTML += `
            <div class="p-4 text-emerald-400 line-through">
                <p class="border-b-green-700">${task.title}</p>
            </div>`;
    });
};

// Delete task function - must be global to be accessible from HTML
window.deleteTask = function(index) {
    currentTasks.splice(index, 1);
    localStorage.setItem('uncomplatedTasks', JSON.stringify(currentTasks));
    updateTasks();
};

// Mark task as finished - must be global to be accessible from HTML
window.finishTask = function(index) {
    complatedTasks.push(currentTasks[index]);
    currentTasks.splice(index, 1);
    
    // Save both arrays to localStorage
    localStorage.setItem('uncomplatedTasks', JSON.stringify(currentTasks));
    localStorage.setItem('complatedTasks', JSON.stringify(complatedTasks));
    
    updateTasks();
    audio.play();
};

// Initialize the task lists on page load
updateTasks();