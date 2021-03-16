import { useEffect, useState } from "react";

import "../styles/components/tasklist.scss";

import { FiTrash, FiCheckSquare } from "react-icons/fi";

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const localTasks = JSON.parse(localStorage.getItem("tasks"));
    if (localTasks) setTasks(localTasks);
    else setTasks([]);
  }, []);

  function randomId(min: number, max: number): number {
    const maxInternal = max * 1000;
    const minInternal = min * 1000;
    return Math.floor(
      Math.random() * (maxInternal - minInternal) + minInternal
    );
  }

  function handleCreateNewTask() {
    // Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    if (!newTaskTitle) {
      setError("Preencha o campo com a ToDo");
      return;
    }

    const newTask = {
      id: randomId(1, 200),
      title: newTaskTitle,
      isComplete: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setError("");
  }

  function handleToggleTaskCompletion(id: number) {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
    const newTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            isComplete: !task.isComplete,
          }
        : task
    );
    setTasks(newTasks);
  }

  function handleRemoveTask(id: number) {
    // Remova uma task da listagem pelo ID
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Adicionar novo ToDo"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
            autoFocus
          />
          <button
            type="submit"
            data-testid="add-task-button"
            onClick={handleCreateNewTask}
          >
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </header>

      <main>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <div
                className={task.isComplete ? "completed" : ""}
                data-testid="task"
              >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button
                type="button"
                data-testid="remove-task-button"
                onClick={() => handleRemoveTask(task.id)}
              >
                <FiTrash size={16} />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}
