export interface CreatePostPayload{
  userId:string | null,
  content?:string,
  image?:File
}