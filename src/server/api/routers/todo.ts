import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: {
        deletedAt: null,
      },
    });
  }),

  get: publicProcedure
    .input(z.object({ id: z.number().optional() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.todo.findFirst({
        where: { id: input.id, deletedAt: null },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.todo.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          title: z.string(),
          description: z.string(),
        }),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: input.data,
      });
    }),
});
