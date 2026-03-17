import type { FormEvent } from "react";
import { useState, useRef, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { useTasksContext } from "../contexts/TasksContext";

function TaskForm() {
  const [title, setTitle] = useState("");
  const [fetchUrl, setFetchUrl] = useState<string | null>(null);

  const { addTask } = useTasksContext();
  const { data, loading, error } = useFetch<{ todo: string }>(fetchUrl);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commitCount = useRef(0);

  useEffect(() => {
    commitCount.current +=1
    console.log("Commits:", commitCount.current);
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    addTask(trimmedTitle);
    setTitle("");
    inputRef.current?.focus();
  }

  function handleSuggest() {
    setFetchUrl(`https://dummyjson.com/todos/random?ts=${Date.now()}`);
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <input
        ref={inputRef}
        name="task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button type="button" onClick={handleSuggest} disabled={loading}>
        {loading ? "Buscando..." : "✨ Gerar sugestão"}
      </button>

      {error && <p>Não foi possível carregar sugestão</p>}

      {data && (
        <p onClick={() => setTitle(data.todo)} style={{ cursor: "pointer" }}>
          💡 {data.todo} <small>(clique para usar)</small>
        </p>
      )}

      <button type="submit">Adicionar</button>
    </form>
  );
}

export default TaskForm;