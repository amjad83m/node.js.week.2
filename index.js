var fs = require('fs');
var help = require('./files/help.js');

var todoList = [];
var appDataFilePath = 'files/todos.json';

var appCommand = process.argv[2];

switch (appCommand) {
    case 'add':
        addTodoItem();
        break;
    case 'list':
        listTodoItems();
        break;
    case 'reset':
        resetTodoItems();
        break;
    case 'remove':
        removeTodoItem();
        break;
    case 'update':
        updateTodoItem();
        break;
    case 'help':
        help();
        break;
    default:
        help();
}

function TodoItem(id, name, done) {
    this.id = id;
    this.name = name;
    this.done = done;
}


function addTodoItem() {
    var id = process.argv[3];
    var name = process.argv[4];
    var done = process.argv[5];
    
    var todoItem = new TodoItem(id, name, done);
    
    if (isValidEntryId(id)) {
        if (!done) {
        console.log("Please make sure you supply a (yes / no) option!");
        return;
        } else {
            done = done.toLowerCase();
        }
        if (process.argv[6]) {
            console.log("There is a problem with either your (entry_text) input or the number of arguments input, please check the help section!");
            return;
        }
        switch (done) {
            case 'yes':
                // do nothing
                break;
            case 'no':
                // do nothing
                break;
            default:
                console.log("Please check your (yes / no) option entry!");
                return;
        }
        fs.readFile(appDataFilePath, function(err, data) {
            if (err) {
                console.log("File does not exist, creating a new file...");
                todoList.push(todoItem);
                fs.writeFile(appDataFilePath, JSON.stringify(todoList), function(err) {
                    if (err) throw err;
                    console.log("Todo item added!");
                });
            } else {
                todoList = JSON.parse(data);
                todoList.push(todoItem);
                fs.writeFile(appDataFilePath, JSON.stringify(todoList), function(err) {
                    if (err) throw err;
                    console.log("Todo item added!");
                });
            }
        });
    }
}

function listTodoItems() {
    fs.readFile(appDataFilePath, function(err, data) {
        if (err) {
            console.log("\nThere is currently no todo items, the list is empty!");
        } else {
            todoList = JSON.parse(data);
            console.log("\nCurrent Todos List: (ID, Title, Done)");
            console.log("=====================================");
            for (var i = 0; i < todoList.length; i++) {
            console.log(todoList[i].id + ", " + todoList[i].name + ", " + todoList[i].done);
            }
        }
    });
}

function removeTodoItem() {
    var index = process.argv[3];
    if (isValidEntryId(index)) {
        fs.readFile(appDataFilePath, function(err, data) {
            if (err) {
                console.log("No todo items to remove. The list is empty!");
            } else {
                todoList = JSON.parse(data);
                var todoItemIndex = index - 1;
                if (todoItemIndex >= 0 && todoItemIndex <= todoList.length - 1) {
                    todoList.splice(todoItemIndex, 1);
                    fs.writeFile(appDataFilePath, JSON.stringify(todoList), function(err) {
                        if (err) throw err;
                        console.log("Todo item removed!")
                    });
                } else {
                    console.log("The desired todo item is not found. Check the (entry_id) or see help!");
                }
            }
        });
    }
}

function resetTodoItems() {
    fs.readFile(appDataFilePath, function(err, data) {
        if (err) {
            console.log("The list of todo items is already empty!");
        } else {
            fs.unlink('files/todos.json', function(err) {
                if (err) throw err;
                console.log("App was reset!");
            })
        }
    });
}

function updateTodoItem() {
    var index = process.argv[3];
    var newName = process.argv[4];

    if (isValidEntryId(index)) {
        if (process.argv[5]) {
            console.log("There is a problem with your (new_entry_text), for more than 1 word please use quotation marks!");
            return;
        }
        fs.readFile(appDataFilePath, function(err, data) {
           if (err) {
               console.log("No todo items to update. The list is empty!");
           } else {
               todoList = JSON.parse(data);
               var todoItemIndex = index - 1;
               if (todoItemIndex >=0 || todoItemIndex <= todoList.length - 1) {
                   todoList[todoItemIndex].name = newName;
                   fs.writeFile(appDataFilePath, JSON.stringify(todoList), function(err) {
                       if (err) throw err;
                       console.log("Todo item updated!")
                   })
               } else {
                   console.log("The desired todo item is not found. Check the (entry_id) or see help!");
               }
           }
        });
    }
}

function isValidEntryId(id) {
    if (isNaN(id * 1) || id <= 0) {
        console.log("The (entry_id) entered is not valid. Please enter a positive number > 0 and try again!");
        return false;
    } else {
        return true;
    }
}