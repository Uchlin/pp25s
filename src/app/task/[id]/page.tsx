import { RoleAdmind_Tutor } from "~/app/_components/task/roleAdmind_Tutor";
import { RoleUser } from "~/app/_components/task/roleUser";
import Link from "next/link";
import React from "react";

import {
  addUserTask,
  deleteTask,
  deleteUserTask,
  updateTask,
} from "../../api/action/task";
import { db } from "~/server/db";
import { auth } from "~/server/auth";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const task = await db.task.findUnique({
    where: { id: params.id },
    include: { squades: true },
  });
  const taskType = await db.taskType.findUnique({
    where: { id: task?.taskTypeId },
  });

  if (!task)
    return (
      <main>
        <h1>Task not found</h1>
      </main>
    );
  
  const role = (await auth())?.user.role;
  const mode = role === "ADMIN" || role === "TUTOR";
  
  return mode ? (
    <RoleAdmind_Tutor task={task} taskType={taskType} />
  ) : (
    <RoleUser task={task} taskType={taskType} />
  );
}
