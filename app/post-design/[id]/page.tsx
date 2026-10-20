import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { PostEditor } from "@/components/post-design/post-editor";
import { getAuthenticatedProfile } from "@/lib/auth/token_check";
import {
  displayProjectName,
  getPostProjectForProfile,
} from "@/lib/post-projects";

export const metadata: Metadata = {
  title: "Post editor",
  description:
    "Create, edit, schedule, and export social content with postpooch.",
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function PostDesignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    notFound();
  }

  const authenticated = await getAuthenticatedProfile();
  if (!authenticated) {
    redirect("/auth/login");
  }

  const project = await getPostProjectForProfile(id, authenticated.profile.id);
  if (!project || project.media.length === 0) {
    notFound();
  }

  return (
    <PostEditor
      key={project.id}
      projectId={project.id}
      initialName={displayProjectName(project.name)}
      initialMedia={project.media.map((item) => ({
        id: item.id,
        displayOrder: item.display_order,
        imageDesign: item.image_design,
      }))}
    />
  );
}
