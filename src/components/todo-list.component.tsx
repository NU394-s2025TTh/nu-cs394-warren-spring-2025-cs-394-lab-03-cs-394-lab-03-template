// src/components/TodoList.tsx

import React, { useEffect } from 'react';

import { Todo } from '../types/todo-type';

type Filter = 'All' | 'Open' | 'Completed';

interface TodoListProps {
  onSelectTodo: (id: number) => void;
}
interface FetchTodosParams {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}
/**
 * fetchTodos function fetches todos from the API and updates the state.
 * @param setTodos - React setState Function to set the todos state.
 * @param setFilteredTodos - React setState Function to set the filtered todos state.
 * @param setLoading - react setState Function to set the loading state.
 * @param setError - react setState Function to set the error state.
 *
 * @returns {Promise<void>} - A promise that resolves when the todos are fetched and state is updated.  You should call this in useEffect.
 * setup useEffect to call this function when the component mounts
 * wraps the fetch API call in a try-catch block to handle errors gracefully and update the loading and error states accordingly.
 * The function uses async/await syntax to handle asynchronous operations, making the code cleaner and easier to read.
 * fetch from the URL https://jsonplaceholder.typicode.com/todos
 */

export const fetchTodos = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTodos,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setFilteredTodos,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLoading,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setError,
}: FetchTodosParams): Promise<void> => {
  setLoading(true);
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (!response.ok) {
      throw new Error('HTTP error! Status: 404');
    }
    const data: Todo[] = await response.json();
    setTodos(data);
    setFilteredTodos(data);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'unknown error occurred');
  } finally {
    setLoading(false);
  }
};
/**
 * TodoList component fetches todos from the API and displays them in a list.
 * It also provides filter buttons to filter the todos based on their completion status.
 * @param onSelectTodo - A function that is called when a todo is selected. It receives the todo id as an argument.
 * @returns
 */

// remove the following line when you use onSelectTodo in the component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TodoList: React.FC<TodoListProps> = ({ onSelectTodo }) => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = React.useState<Todo[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<Filter>('All');

  useEffect(() => {
    fetchTodos({ setTodos, setFilteredTodos, setLoading, setError });
  }, []);

  useEffect(() => {
    let updated = todos;
    if (filter === 'Open') {
      updated = todos.filter((todo) => !todo.completed);
    } else if (filter === 'Completed') {
      updated = todos.filter((todo) => todo.completed);
    }
    setFilteredTodos(updated);
  }, [filter, todos]);

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <p>
        These are the filter buttons. the tests depend on the data-testids; and use
        provided styles. Implement click event handlers to change the filter state and
        update the UI accordingly to show just those todo&apos;s. other hints: you can
        change the styling of the button with <code>className</code> property. if the
        className of a button is &quot;active&quot; it will use the{' '}
        <code> .todo-button.completed</code> CSS style in App.css
      </p>
      <div className="filter-buttons">
        <button
          data-testid="filter-all"
          className={filter === 'All' ? 'active' : ''}
          onClick={() => setFilter('All')}
        >
          All
        </button>

        <button
          data-testid="filter-open"
          className={filter === 'Open' ? 'active' : ''}
          onClick={() => setFilter('Open')}
        >
          Open
        </button>

        <button
          data-testid="filter-completed"
          className={filter === 'Completed' ? 'active' : ''}
          onClick={() => setFilter('Completed')}
        >
          Completed
        </button>
      </div>

      {loading && <p>Loading todos...</p>}
      {error && <p className="error">Error loading todos: {error}</p>}

      <ul data-testid="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <button onClick={() => onSelectTodo(todo.id)} data-testid={`todo-${todo.id}`}>
              {todo.title}
            </button>
          </li>
        ))}
      </ul>
      <p>
        Show a list of todo&apos;s here. Make it so if you click a todo it calls the event
        handler onSelectTodo with the todo id to show the individual todo
      </p>
    </div>
  );
};
