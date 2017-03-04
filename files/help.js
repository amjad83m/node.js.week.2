module.exports = function showHelp() {
    console.log(`\n
******************
Node.js To-Do App!
******************\n
Please use this app as follows (all parentheses are for clarity purposes and should not be typed):\n
* To show this help text, type: node index.js help\n
* To show a list of the current items in the todo list, type: node index.js list\n
* To add an entry to the todo list, type: node index.js add (entry_id) (entry_text) (yes / no)
  where (entry_id) is a positive number representing a counter for the todo items you enter,
  (entry_text) is the text description of the todo item (for more than 1 word please use quotation marks),
  (yes / no) is to indicate if the todo item is done or not yet.\n
* To remove a todo item from the list, type: node index.js remove (entry_id)
  where (entry_id) is the positive number you entered when adding the todo item to the list.\n
* To clear the list of the todo items completely and start with a new empty one, type: node index.js reset\n
* To update or change a previously entered todo item, type: node index.js update (entry_id) (new_entry_text)
  (entry_id) is the positive number you entered when adding the todo item to the list,
  (new_entry_text) is the updated text description of the todo item in question.`);
}