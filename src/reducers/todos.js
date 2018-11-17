const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      let found = false;
      let newState = state.map(val => {
        if (val.id === action.id) {
          found = true;
          return action;
        } else {
          return val;
        }
      });
      if (!found) {
        newState.push(action);
      }
      return newState;

    case "TOGGLE_TODO":
      return state.map(todo =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
    default:
      return state;
  }
};

export default todos;
