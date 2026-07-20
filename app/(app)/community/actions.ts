"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim()
  const body = String(formData.get("body") ?? "").trim()
  const league = String(formData.get("league") ?? "").trim()

  if (!title) return { error: "Give your post a title." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "You must be signed in." }

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      title,
      body: body || null,
      league_id: league || null,
    })
    .select("id")
    .single()

  if (error) return { error: error.message }

  // author auto-upvotes their own post
  await supabase.from("post_votes").insert({ post_id: post.id, user_id: user.id })

  revalidatePath("/community")
  return { id: post.id }
}

export async function toggleVote(postId: string, hasVoted: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "You must be signed in." }

  if (hasVoted) {
    await supabase.from("post_votes").delete().eq("post_id", postId).eq("user_id", user.id)
    await supabase.rpc("noop") // placeholder, upvotes updated below
  } else {
    await supabase.from("post_votes").insert({ post_id: postId, user_id: user.id })
  }

  // recompute count from votes table
  const { count } = await supabase
    .from("post_votes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)

  await supabase
    .from("posts")
    .update({ upvotes: count ?? 0 })
    .eq("id", postId)

  revalidatePath("/community")
  return { upvotes: count ?? 0 }
}

export async function addComment(postId: string, formData: FormData) {
  const body = String(formData.get("body") ?? "").trim()
  if (!body) return { error: "Write something first." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "You must be signed in." }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    body,
  })
  if (error) return { error: error.message }

  revalidatePath(`/community/${postId}`)
  return { ok: true }
}
