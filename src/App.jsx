import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [showFinished, setshowFinished] = useState(true);

  // Load todos from localStorage once
  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) {
      const savedTodos = JSON.parse(todoString);
      setTodos(savedTodos);
    }
    setIsFirstLoad(false);
  }, []);

  // Save todos to localStorage after todos change (except first load)
  useEffect(() => {
    if (!isFirstLoad) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isFirstLoad]);

  const handleEdit = (e, id) => {
    const t = todos.find((item) => item.id === id);
    if (t) setTodo(t.todo);

    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
  };

  const handleDelete = (e, id) => {
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
  };

  const handleAdd = () => {
    if (!todo.trim()) return;
    setTodos([
      ...todos,
      { id: uuidv4(), todo: todo.trim(), isCompleted: false },
    ]);
    setTodo("");
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const index = todos.findIndex((item) => item.id === id);
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
  };

  const toggleFinished = (e) => {
    setshowFinished(!showFinished);
  };

  return (
    <>
      <Navbar />
      <div className="mx-2 md:container md:mx-auto my-3 rounded-md p-3 bg-violet-100 min-h-[100vh] md:w-1/2">
        <h1 className="font-bold text-center text-xl">
          JotDot - Quick Notes. Faster Tasks.
        </h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-lg p-2 font-bold">Add a Todo</h2>
          <input
            onChange={handleChange}
            value={todo}
            type="text"
            className="w-full rounded-full border px-2 py-1"
          />
          <button
            onClick={handleAdd}
            className="bg-violet-800 hover:bg-violet-950 text-white rounded-lg p-1 text-md"
          >
            Save
          </button>
        </div>
        <input
          className="my-4"
          onChange={toggleFinished}
          type="checkbox"
          checked={showFinished}
        />{" "}
        Show Finished
        <h2 className="text-lg font-bold">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && (
            <div className="m-5">No ToDos have been added</div>
          )}
          {todos.map((item) => {
            return (
              (showFinished || !item.isCompleted) && (
                <div
                  key={item.id}
                  className="todo flex md:w-3/4 justify-between items-center my-2"
                >
                  <div className="flex gap-5 items-center">
                    <input
                      name={item.id}
                      onChange={handleCheckbox}
                      type="checkbox"
                      checked={item.isCompleted}
                    />
                    <div className={item.isCompleted ? "line-through" : ""}>
                      {item.todo}
                    </div>
                  </div>
                  <div className="buttons flex">
                    <button
                      onClick={(e) => handleEdit(e, item.id)}
                      className="bg-violet-800 hover:bg-violet-950 px-2 text-white rounded-lg mx-2 text-md"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="bg-violet-800 hover:bg-violet-950 px-2 text-white rounded-lg mx-2 p-1 text-md"
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
