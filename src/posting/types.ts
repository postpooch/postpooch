export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ScheduleRow = {
  id: string;
  created_at: string;
  profile_id: string | null;
  delete_after_use: boolean | null;
  platform: string | null;
  platform_account_id: string | null;
  uses_template: boolean | null;
  text: string | null;
};

export type TemplateRow = {
  id: string;
  created_at: string;
  text: string | null;
};

export type MediaRow = {
  id: string;
  created_at: string;
  schedule_id: string | null;
  image_design: Json | null;
  display_order: number | null;
  template_id: string | null;
  post_project_id: string | null;
  posting_run_id: string | null;
};

export type PostingRunStatus =
  | "queued"
  | "processing"
  | "published"
  | "failed";

export type PostingRun = {
  id: string;
  schedule_id: string;
  occurrence_at: string;
  trigger_run_id: string | null;
  status: PostingRunStatus;
  template_id: string | null;
  zernio_request_id: string;
  zernio_post_id: string | null;
  media_urls: string[] | null;
  acquired: boolean;
};

export type PostContent = {
  caption: string | null;
  media: MediaRow[];
  templateId: string | null;
};

export type UploadedMedia = {
  key: string;
  url: string;
};

export type PublishedPost = {
  postId: string;
};
