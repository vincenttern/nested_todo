ENTER_KEY = 13;

var util = {
    uuid: function() {
        var startRandomNum = Math.floor(Math.random() * 9) + 1;
        var count = 0;
        var uuid = startRandomNum.toString();
        for (var i = count; i <= 4; i++) {
          var nextRandomNum = Math.floor(Math.random() * 9) + 1;
          uuid += nextRandomNum.toString();
          count++;
        }

        return uuid;
    }
}

var todoList = {
    todos: [],
    addTodo: function (todoText) {
        this.todos.push({
            todoText: todoText,
            id: util.uuid(),
            completed: false
        });
    },
    addNestedTodo: function(todoText, todoId) {
        // get access to current todo index that was clicked.
        this.todos.forEach(function(todo) {
            if (todo.id === todoId) {
                if (todo.hasOwnProperty('nestedArray')) {
                    todo.nestedArray.push({
                        todoText: todoText,
                        id: util.uuid(),
                        completed: false
                    })
                } else {
                    todo.nestedArray = [];
                    todo.nestedArray.push({
                        todoText: todoText,
                        id: util.uuid(),
                        completed: false
                    })
                }
            }
        })      
    },
    changeTodo: function (position, todoText) {
        this.todos[position].todoText = todoText;
    },
    deleteTodo: function (idNum) {

        for (var i = 0; i < this.todos.length; i++) {
            var getTodoId = this.todos[i].id;
            if (getTodoId === idNum.toString()) {
                this.todos.splice(i, 1);
            } 

            var count = 0;
            if ('nestedArray' in this.todos[i]) {
                var nestedArrayExist = this.todos[i].nestedArray;
                nestedArrayExist.forEach(function (nestedTodo) {
                    if (nestedTodo.id === idNum.toString()) {
                        this.todos[i].nestedArray.splice(count, 1);
                    } else {
                        count++;
                    }
                }, this);
            }
        }

    },
    completedNestedTodo: function (e) {
        var idNum = e.parentNode.parentNode.parentNode.parentNode.dataset.id;
        for (var i = 0; i < this.todos.length; i++) {
            var getTodoId = this.todos[i].id;

            if (getTodoId === idNum.toString()) {
                var todoCompleted = this.todos[i].completed;
                todoCompleted = !todoCompleted;
            } 

            var count = 0;
            if ('nestedArray' in this.todos[i]) {
                var nestedArrayExist = this.todos[i].nestedArray;
                nestedArrayExist.forEach(function (nestedTodo) {
                    if (nestedTodo.id === idNum.toString()) {
                        var todoCompleted = this.todos[i].nestedArray[count];
                        todoCompleted.completed = !todoCompleted.completed;
    
                        controllers.checkCompleted(e, nestedTodo);
                    } else {
                        count++;
                    }
                }, this);
            }
        }
    }
};

var controllers = {
    addTodo: function () {
        var addTodoTextInput = document.getElementById('addTodoTextInput');
        if (addTodoTextInput.value === "") {
            M.toast({
                html: '<h3>Hi! Please write something before clicking add.</h3>', 
                classes: 'rounded', 
                displayLength: 4000,
                
            });
        } else {
            todoList.addTodo(addTodoTextInput.value);
        }
    
        addTodoTextInput.value = '';
        view.displayTodos();
    },
    addNestedTodo: function (e) {
        
        if (!e.value.trim()) {
            this.deleteInputElement();
            return;
        }

        var targetElement = e.parentNode.parentNode.parentNode.dataset.id;

        var addNestedTodoTextInput = document.getElementById('addNestedTodoTextInput');
        if (typeof addNestedTodoTextInput.value === 'string') {
            todoList.addNestedTodo(addNestedTodoTextInput.value, targetElement);
        }

       view.displayTodos();
    },
    changeTodo: function (e) {
        var input = e.parentNode;
        if (input.localName === 'li') {
            input.className = 'editing';
        } else {
            return this.changeTodo(input);
        }
        
    },
    indexFromEl: function(e) {
        var id = e.parentNode.dataset.id;
        var todos = todoList.todos;
        var i = todos.length;

        while (i--) {
            if (todoList.todos[i].id === id) {
                return i;
            }
        }
    },
    update: function (e) {
        var el = e.target;
        var val = el.value.trim();

        todoList.todos[this.indexFromEl(el)].todoText = val;

        view.displayTodos();
    },
    todoIndexFromEl: function (e) {
        var id = e.parentNode.dataset.id;
        var todos = todoList.todos;
        var i = todos.length;

        while (i--) {
            if ('nestedArray' in todos[i]) {
                var nestedArrayLength = todos[i].nestedArray.length;
                for (var j = 0; j < nestedArrayLength; j++) {
                    if (todos[i].nestedArray[j].id === id) {
                        return i;
                    }
                }
            }
        }
    },
    nestedIndexFromEl: function (e) {
        var id = e.parentNode.dataset.id;
        var todos = todoList.todos;
        var i = todos.length;

        while (i--) {
            if ('nestedArray' in todos[i]) {
                var nestedArrayExist = todos[i].nestedArray;
                var nestedArrayLength = todos[i].nestedArray.length;
                for (var j = 0; j < nestedArrayLength; j++) {
                    if (todos[i].nestedArray[j].id === id) {
                        return j;
                    }
                }
            }
        }
    },
    updateNested: function (e) {
        var el = e.target;
        var val = el.value.trim();

        todoList.todos[this.todoIndexFromEl(el)].nestedArray[this.nestedIndexFromEl(el)].todoText = val;

        view.displayTodos();
    },
    editKeyup: function (e) {
        if (e.which === ENTER_KEY) {
            e.target.blur();
        }
    },
    deleteTodo: function (position) {
        todoList.deleteTodo(position);
        view.displayTodos();
    },
    deleteInputElement: function () {
        var el = document.getElementById('nested-ul');
        el.remove();
    },
    completeNestedTodo: function (e) {
        todoList.completedNestedTodo(e);
        
    },
    checkCompleted: function (e, nestedTodo) {
        var checkElementCompleted = e.parentNode.parentNode.firstElementChild.firstElementChild;
        if (nestedTodo.completed === true) {
            if (checkElementCompleted.localName === 'label') {
                checkElementCompleted.className = 'completed';
            }
        } else {
            if (checkElementCompleted.localName === 'label') {
                checkElementCompleted.classList.remove('completed');
            }
        }
    },
    checkAllWithCompleted: function () {
        var todos = todoList.todos;
        for (var i = 0; i < todos.length; i++) {
            if ('nestedArray' in todos[i]) {
                var nestedArrayExist = todos[i].nestedArray;
                nestedArrayExist.forEach(function (todo) {
                    if (todo.completed === true) {
                        this.addStrikeToCompleted(todo.id);
                    }
                }, this);
            }
        }
    },
    addStrikeToCompleted: function (todoId) {
        var allLiId = document.querySelectorAll('li');
        for (var i = 0; i < allLiId.length; i++) {
            if (allLiId[i].dataset.id === todoId) {
                allLiId[i].firstElementChild.firstElementChild.firstElementChild.firstElementChild.className = 'completed';
            }
        }
    }
};

var view = {
    displayTodos: function () {
        
        var getTodosTemplate = document.getElementById('todo-template');
        this.todoTemplate = Handlebars.compile((getTodosTemplate).innerHTML);
        var todos = todoList.todos;
        document.getElementById('todo-list').innerHTML = this.todoTemplate(todos);

        controllers.checkAllWithCompleted();
    },
    displayEachNestedTodo: function(todoIdThatWasClicked) {
        var todosUl = document.getElementById(todoIdThatWasClicked);
        todoList.todos[todoIdThatWasClicked].nestedArray.forEach(function(todo, position) {

            var todoTextWithCompletion = '';

            if (todo.completed === true) {
                todoTextWithCompletion = '(x) ' + todo.todoText;
            } else {
                todoTextWithCompletion = '() ' + todo.todoText;
            }

            var todoNestedDiv = this.createDiv();
            var todoNestedUl = this.createUl();
            var todoNestedLi = this.createLi();

            todoNestedDiv.appendChild(todoNestedUl);
            todoNestedUl.appendChild(todoNestedLi);

            todoNestedLi.id = position + 'A';
            todoNestedLi.textContent = todoTextWithCompletion;
            todoNestedLi.appendChild(this.createDeleteButton());
            todosUl.appendChild(todoNestedDiv);
        }, this);
    },
    displayNestedTodo: function (e) {
        var selectId = e.parentNode;

        // Base case.
        if (selectId.localName === 'li') {
            selectId = selectId;
            
        // Recursive case.
        } else {
            return this.displayNestedTodo(selectId);
        }

        var createUl = this.createUl();
        var createLi = this.createLi();
        var createInput = this.createInput();

        selectId.appendChild(createUl);
        createUl.appendChild(createLi);
        createLi.appendChild(createInput);
    },
    createDeleteButton: function () {
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteButton';
        return deleteButton;
    },
    createButton: function () {
        var createNewButton = document.createElement('button');
        createNewButton.setAttribute('onclick', 'controllers.addNestedTodo()');
        createNewButton.innerHTML = 'Add';
        return createNewButton;
    },
    createInput: function () {
        var createNewInput = document.createElement('input');
        createNewInput.id = 'addNestedTodoTextInput';
        createNewInput.type = 'text';
        createNewInput.placeholder = 'add a todo...';
        return createNewInput;
    },
    createUl: function () {
        var createNewUl = document.createElement('ul');
        createNewUl.id = 'nested-ul';
        return createNewUl;
    },
    createLi: function () {
        var createNewLi = document.createElement('li');
        return createNewLi;
    },
    createDiv: function () {
        var createNewDiv = document.createElement('div');
        return createNewDiv;
    }
};


var events = {
    setUpEventListeners: function () {

        var getTodoList = document.getElementById('todo-list');

        // Delete todo when delete button is click.
        getTodoList.addEventListener('click', function(e) {
            elementClicked = e.target.parentNode;
            if (elementClicked.id === 'destroy') {
                var elementDatasetId = elementClicked.parentNode.parentNode.parentNode.parentNode.dataset.id;
                events.setUpEventListeners.bind(this, controllers.deleteTodo(parseInt(elementDatasetId)));
            }
        });

        // Delete nested todo.
        getTodoList.addEventListener('click', function(e) {
            elementClicked = e.target.parentNode;
            if (elementClicked.id === 'destroyNestedTodo') {
                var elementDatasetId = elementClicked.parentNode.parentNode.parentNode.parentNode.dataset.id;
                events.setUpEventListeners.bind(this, controllers.deleteTodo(parseInt(elementDatasetId)));
            }
        })

        // Add nested todo when add is clicked
        getTodoList.addEventListener('click', function(e) {
            // debugger;
            elementClicked = e.target.parentNode;
            if (elementClicked.id === 'addNestedTodo') {
                view.displayNestedTodo(e.target.parentNode);
            }
        });

        // Want to add some editing when todo is double clicked.
        getTodoList.addEventListener('dblclick', function(e) {
            elementClicked = e.target;
            if (elementClicked.localName === 'label') {
                events.setUpEventListeners.bind(this, controllers.changeTodo(elementClicked));
            }
        });

        // When inside a input and cursor is click outside of it, it will blur out the input.
        getTodoList.addEventListener('keyup', function(e) {
            elementClicked = e.target;
            if (elementClicked.className === 'edit') {
                events.setUpEventListeners.bind(this, controllers.editKeyup(e));
            }

            if (elementClicked.id === 'addNestedTodoInput') {
                events.setUpEventListeners.bind(this, controllers.editKeyup(e))
            }

            if (elementClicked.id === 'addNestedTodoTextInput') {
                events.setUpEventListeners.bind(this, controllers.editKeyup(e));
            }
        });

        // When enter key is clicked.
        getTodoList.addEventListener('focusout', function(e) {
            // debugger;
            elementClicked = e.target;
            if (elementClicked.id = 'addTodoTextInput') {
                events.setUpEventListeners.bind(this, controllers.addTodo());
            }
            if (elementClicked.className === 'edit') {
                events.setUpEventListeners.bind(this, controllers.update(e));
            }

            if (elementClicked.id === 'addNestedTodoInput') {
                events.setUpEventListeners.bind(this, controllers.updateNested(e));
            }

            if (elementClicked.id === 'addNestedTodoTextInput') {
                events.setUpEventListeners.bind(this, controllers.addNestedTodo(elementClicked));
            }
        });

        getTodoList.addEventListener('click', function(e) {
            var elementClicked = e.target.parentNode;
            if (elementClicked.id === 'completeNestedTodo') {
                events.setUpEventListeners.bind(this, controllers.completeNestedTodo(elementClicked));
            }
        });
    }
}

events.setUpEventListeners();