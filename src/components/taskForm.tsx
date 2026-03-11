import type { FormEvent } from "react";

type TaskFormProps = {
  onAdd: (title: string) => void;
};

function TaskForm({ onAdd }: TaskFormProps) {

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = String(formData.get("task") || "");

    onAdd(title);

    e.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="task" />
      <button type="submit">Adicionar</button>
    </form>
  );
}

export default TaskForm;