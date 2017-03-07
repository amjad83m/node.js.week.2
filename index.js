/*
* The data of the app (todo item list) is stored as JSON.
* For simplicity, this app ignores I/O file system problems (physical or software corruption), so if it can't read from or wrire to
the data file, then the file doesn not exist and the app creates a new one.
* 
*/

var fs = require('fs');
var help = require('./files/help.js');

var todoList = [];
var appDataFilePath = 'files/todos.json';

const addedMsg = "\nTodo item added!";
const removedMsg = "\nTodo item removed!";
const resetMsg = "\nTodo app reset!";
const updateMsg = "\nTodo item updated!";

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
    
    /*
    nesting 3 layers of validation, first for the todo item id, then for the completion of the todo item (yes / no), and last for the
    description of the todo item (quotation marks if more than 1 word)
    */
    if (isValidEntryId(id)) {
        if (!done) {
        console.log("\nPlease make sure you supply a (yes / no) option!");
        return;
        } else {
            done = done.toLowerCase();
        }
        if (process.argv[6]) {
            console.log("\nThere is a problem with either your (entry_text) input or the number of arguments input, please check the help section!");
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
                console.log("\nPlease check your (yes / no) option entry!");
                return;
        }
        
        /*
        on each addition, trying to read the previous data, if not (no data) then creating a new file to save the data
        and then writing the new todo item to it.
        */
        fs.readFile(appDataFilePath, function(err, data) {
            if (err) {
                console.log("\nFile does not exist, creating a new file...");
                todoList.push(todoItem);
                writeToJsonFile(appDataFilePath, todoList, addedMsg);
            } else {
                /*
                File exists, reading the data and storing it into the todo item array (todo list)
                then adding the new todo item to it, and finally writing the result back to the file
                */
                todoList = JSON.parse(data);
                todoList.push(todoItem);
                writeToJsonFile(appDataFilePath, todoList, addedMsg);
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
            console.log("=======================================");
            for (var i = 0; i < todoList.length; i++) {
            console.log(todoList[i].id + ", " + todoList[i].name + ", " + todoList[i].done);
            }
        }
    });
}

function removeTodoItem() {
    var id = process.argv[3];
    var itemFound = false;
    /*
    To remove a todo item, first validating the id entered (positive number > 0)
    then checking if there is a data file (todo item list exists)
    */
    if (isValidEntryId(id)) {
        fs.readFile(appDataFilePath, function(err, data) {
            if (err) {
                console.log("\nNo todo items to remove. The list is empty!");
            } else {
                todoList = JSON.parse(data);
                for (var i = 0; i < todoList.length; i++) {
                    if (todoList[i].id == id) {
                        itemFound = true;
                        todoList.splice(i, 1);
                        writeToJsonFile(appDataFilePath, todoList, removedMsg);
                        break;
                    }
                }
                if (!itemFound) {
                    console.log("\nThe desired todo item to be removed is not found. Check the (entry_id) or see help!");
                }
            }
        });
    }
}

function resetTodoItems() {
    fs.readFile(appDataFilePath, function(err, data) {
        if (err) {
            console.log("\nThe list of todo items is already empty!");
        } else {
            /*
            To reset the app, I'm deleting the data file entirely
            */
            fs.unlink(appDataFilePath, function(err) {
                if (err) throw err;
                console.log(resetMsg);
            })
        }
    });
}

function updateTodoItem() {
    var id = process.argv[3];
    var newName = process.argv[4];
    var itemFound = false;

    if (isValidEntryId(id)) {
        if (process.argv[5]) {
            console.log("\nThere is a problem with your (new_entry_text), for more than 1 word please use quotation marks!");
            return;
        }
        fs.readFile(appDataFilePath, function(err, data) {
           if (err) {
               console.log("\nNo todo items to update. The list is empty!");
           } else {
               todoList = JSON.parse(data);
               for (var i = 0; i < todoList.length; i++) {
                   if (todoList[i].id == id) {
                       itemFound = true;
                       todoList[i].name = newName;
                       writeToJsonFile(appDataFilePath, todoList, updateMsg);
                       break;
                   }
               }
               if (!itemFound) {
                   console.log("\nThe desired todo item to be updated is not found. Check the (entry_id) or see help!");
               }
           }
        });
    }
}


// a function to validate entered todo item id (should be a positive number > 0)
function isValidEntryId(id) {
    if (isNaN(id * 1) || id <= 0) {
        console.log("\nThe (entry_id) entered is not valid. Please enter a positive number > 0 and try again!");
        return false;
    } else {
        return true;
    }
}


function writeToJsonFile(filePath, dataToBeWritten, logMsg) {
    fs.writeFile(filePath, JSON.stringify(dataToBeWritten), function(err) {
        if (err) throw err;
        console.log(logMsg);
    });
}