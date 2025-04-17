import React from "react";
import { UserMinusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteTutor } from "~/app/api/action/squad";
import TutorSearch from "../../ui/tutorSearch";
import { db } from "~/server/db";
import { Students } from "~/app/_components/squad/students";
import { auth } from "~/server/auth";
import { RoleAdmin } from "~/app/_components/squad/roleAdmin";
import { RoleUser } from "~/app/_components/squad/roleUser";
// import { api } from "~/trpc/server";


export default async function Page(props: {
  params: Promise<{ id: string  }>;
  searchParams: Promise<{
    query?: string;
    student?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";  
  const params = await props.params;
  const squad = await db.squad.findUnique({
    where: { id: params.id },
    include: {       
      task: true, 
      tutor: true,
      StudentsOnTasks: {
        include: {
          student: true
        }
      } },
  })
  const task = squad?.task || null;
  const tutor = squad?.tutor || null;

  // const gr = await api.post.hello({ text: "server world" });
  // console.log("\n\nTRPC\n\n", gr);
 
  const session = await auth();
  const role = session?.user.role;
  const mode = role === "ADMIN" || (squad?.tutorId === session?.user.id);

  if (mode) {
    return <RoleAdmin task={task} tutor={tutor} squad={squad} query={query} />;
  }

  return <RoleUser task={task} tutor={tutor} squad={squad} />;
}
