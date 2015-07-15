var Fluxxor = require('fluxxor');

var constants = {
  ADD_TODO: "ADD_TODO",
  TOGGLE_TODO: "TOGGLE_TODO",
  CLEAR_TODOS: "CLEAR_TODOS"
};

var TodoStore = Fluxxor.createStore({
  initialize: function() {
    this.todoId = 0;
    this.todos = {};

    this.bindActions(
      constants.ADD_TODO, this.onAddTodo,
      constants.TOGGLE_TODO, this.onToggleTodo,
      constants.CLEAR_TODOS, this.onClearTodos
    );
  },

  onAddTodo: function(payload) {
    var id = this._nextTodoId();
    var todo = {
      id: id,
      text: payload.text,
      complete: false
    };
    this.todos[id] = todo;
    this.emit("change");
  },

  onToggleTodo: function(payload) {
    var id = payload.id;
    this.todos[id].complete = !this.todos[id].complete;
    this.emit("change");
  },

  onClearTodos: function() {
    var todos = this.todos;

    Object.keys(todos).forEach(function(key) {
      if(todos[key].complete) {
        delete todos[key];
      }
    });

    this.emit("change");
  },

  getState: function() {
    return {
      todos: this.todos
    };
  },

  _nextTodoId: function() {
    return ++this.todoId;
  }
});

var actions = {
  addTodo: function(text) {
    this.dispatch(constants.ADD_TODO, {text: text});
  },

  toggleTodo: function(id) {
    this.dispatch(constants.TOGGLE_TODO, {id: id});
  },

  clearTodos: function() {
    this.dispatch(constants.CLEAR_TODOS);
  }
};

module.exports = {
  TodoStore: TodoStore,
  actions: actions
};
