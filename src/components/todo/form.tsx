import { useForm } from "react-hook-form";
import { api } from "~/utils/api";

export const AddTodoForm = () => {
  type AddTodo = {
    title: string;
    description: string;
  };
  const { register, handleSubmit, reset } = useForm<AddTodo>();

  const trpcContext = api.useContext();

  const addTodo = api.todo.create.useMutation({
    onSettled() {
      trpcContext.todo.getAll.invalidate();
    },
  });
  const submitForm = (data: AddTodo) => {
    addTodo.mutate(data);
    reset();
  };

  return (
    <>
      <form
        className="mt-4 flex w-4/5 flex-col gap-4"
        onSubmit={handleSubmit(submitForm)}
      >
        <input
          className="w-full border border-black"
          placeholder="Input Title"
          {...register("title")}
        />
        <textarea
          className="w-full border border-black"
          placeholder="Input Description"
          {...register("description")}
        ></textarea>
        <button
          className="mx-auto w-20 rounded-md bg-blue-500 text-white"
          type="submit"
        >
          作成
        </button>
      </form>
    </>
  );
};
