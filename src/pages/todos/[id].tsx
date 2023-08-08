import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";

const TodoEdit: NextPage = () => {
  const router = useRouter();
  const id = Number(router.query.id);

  const {
    data: todo,
    isLoading,
    error,
  } = api.todo.get.useQuery(
    Number.isNaN(id)
      ? {}
      : {
          id,
        }
  );

  type EditTodo = {
    title: string;
    description: string;
  };

  const { register, handleSubmit } = useForm<EditTodo>({
    values: {
      title: todo?.title ?? "",
      description: todo?.description ?? "",
    },
  });
  const trpcContext = api.useContext();

  const updateTodo = api.todo.update.useMutation({
    onSettled() {
      trpcContext.todo.getAll.invalidate();
    },
  });

  const submitForm = (data: EditTodo) => {
    updateTodo.mutate({ id, data });
    router.push("/todos");
  };

  if (isLoading) {
    return <></>;
  }
  if (error) {
    return <>{error.message}</>;
  }

  return (
    <>
      <Head>
        <title>{todo?.title}</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <form
          className="mt-16 flex w-4/5 flex-col gap-4"
          onSubmit={handleSubmit(submitForm)}
        >
          <h2 className="mx-auto text-2xl">Edit Todo: {todo?.title}</h2>
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
            更新
          </button>
          <Link
            href="/todos"
            className="mx-auto w-20 rounded-md bg-blue-500 text-center text-white"
          >
            戻る
          </Link>
        </form>
      </main>
    </>
  );
};

export default TodoEdit;
