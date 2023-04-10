//-----------------------------IIFE function will automatically as soon as the file is loaded-----------------------------
(function () {
    let tasks = [];
    const taskList = document.getElementById('list');
    const addTaskInput = document.getElementById('add');
    const tasksCounter = document.getElementById('tasks-counter');

    // function fetchTodos(){
    //     //Get request
    //     fetch('https://jsonplaceholder.typicode.com/todos')                         //we will fetch data from this website and it will return as object
    //       .then(function(response){
    //         return response.json();                                                 //response will have the promise from the URL and we are convertin that into json type which will return a promise again so we can again use then on it

    //       })
    //       .then(function(data){
    //         tasks=data.slice(0,10);                                                 //the data will have all the tasks from above json response we will use slice to ghet only 10 tasks from 200
    //         renderList();
    //       })
    //       .catch(function(error){                                                    //if there is any error in any promises we will catch it here
    //         console.log('error',error);
    //       })
    // }

    //----------------- Using Acync await function 

    async function fetchTodos() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');     //we have to fetch data from here
            const data = await response.json();                                             //converting into json type which will return promises
            tasks = data.slice(0, 10);                                                       //taking only 10 tasks
            renderList();

        } catch (error) {
            console.log(error);
        }
    }


    function addTaskToDOM(task) {
        const li = document.createElement('li');                                        //creatin the element li and adding html inside li using innerHTML attribute
        li.innerHTML = `
          <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''} class="custom-checkbox">
          <label for="${task.id}">${task.title}</label>
          <img src="bin.png" class="delete" data-id="${task.id}" />
    
    `;
        taskList.append(li);                                                           //adding the entire li into the taskList means inside ul(unordered list)
    }

    function renderList() {
        taskList.innerHTML = '';                                                         //clearing all thye li element in the ul tag of html
        for (let i = 0; i < tasks.length; i++) {
            addTaskToDOM(tasks[i]);                                                    //traversing througn the entire tasks array and calling addTaskDom function on the current tasks element
        }
        tasksCounter.innerHTML = tasks.length;                                           //updating the value of tasksCounter's innerHTML to the tasks length
    }

    function toggleTasks(taskId) {
        const task = tasks.filter(function (task) {                                        //to get the task with the given id 
            return task.id == taskId;
        });
        if (task.length > 0) {                                                             //check if the task with the gievn id is present or not
            const currentTask = task[0];
            currentTask.completed = !currentTask.completed;
            markTaskAsComplete(taskId);                                      //change the task done condition frm 1 to 0 or viseversa
            renderList();
            // showNotification("Task Toggled Successfully");
            return;

        }
        showNotification("Error While Toggling the Tasks");
    }

    function markTaskAsComplete(taskId) {
        tasks.filter(function (task) {                                                      //check the task done as true fot the given task id
            if (task.id == taskId) {
                task.completed = true;
            }
        });
        renderList();
        showNotification("Task Marked Completed");

    }

    function deleteTask(taskId) {
        const tempTask = tasks.filter(function (task) {                                     //filter out the task whose id is given
            return task.id != taskId;                                                     //for comparision of the id of the tasks
        });
        tasks = tempTask;                                                                 //tasks is updated
        renderList();
        showNotification("tasks deleted!!");
    }

    // function addTask (task) {
    //     tasks.push(task);
    //     renderList();
    //     showNotification("task added");
    // }

    //---------------------addTask using POST method in json with API------------------------------------------------

    function addTask(task) {
        if (task) {
            fetch('https://jsonplaceholder.typicode.com/todos', {                         //another argument for fetch where we are declaring the post method 
                method: "POST", // or 'PUT'
                headers: {                                                                //from here we are copying everything from monzilla file from Upload JSON data method
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(task),
            }).then(function (response) {
                return response.json();                                                   //converting into json
            }).then(function (data) {
                tasks.push(task);                                                         //pushing tasks
                renderList();
                showNotification('Task Added Successfully');
            })
                .catch(function (error) {
                    console.log('error', error);                                               //catching error
                });
        }
    }



    function showNotification(text) {
        alert(text);
    }

    function handelInputKeyPress(e) {
        if (e.key == 'Enter') {                                                               //if enter is pressed 
            const text = e.target.value;                                                    //value of the input is stored in text
            if (!text) {
                showNotification('Task Can Not Be Empty!!');                              //if text is empty
                return;
            }
            // console.log("task",text);
            const task = {                                                                  //making an object of task
                title: text,                                                                     //shorthand property of writing text:text because both are same
                id: Date.now().toString(),                                                 //making id unique for every task for selecting the time as id
                completed: false

            }
            e.target.value = "";                                                             //making value of the input back yo empty
            addTask(task);                                                                //adding task function called here
        }
    }

    function handleClickListener(e) {                                                      //adding the event deligation function
        const target = e.target;                                                            //getting the element with the target attribute
        if (target.className == 'delete') {                                                   //if clicked on the bin image
            const taskId = target.dataset.id;                                               //targeted the dataset,id and called the deleteTask func
            deleteTask(taskId);
            return;
        }
        else if (target.className == 'custom-checkbox') {                                    //if checkbos is clicked
            const taskId = target.id;                                                      //checking if checkbox is clicked with the help of id

            toggleTasks(taskId);                                                         //toggleTasks func is called to change the done condition
            return;
        }

    }

    function initializeApp() {                                                             //added this function to make code much clean
        fetchTodos();
        addTaskInput.addEventListener('keyup', handelInputKeyPress);
        document.addEventListener('click', handleClickListener);                            //-------EVENT DELIGATION !!!!! --------------
    }

    initializeApp();

})()
