

export const addTodo = ({id, text, completed}) => ({
    type: 'ADD_TODO',
    id,
    text,
    completed
  })


  export const toggleTodo = id => ({
    type: 'TOGGLE_TODO',
    id
  })