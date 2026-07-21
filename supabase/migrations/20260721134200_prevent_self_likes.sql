-- Prevent users from liking their own designs at database level

drop policy if exists "Users can insert their own likes" on public.likes;

create policy "Users can insert their own likes"
on public.likes for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and not exists (
    select 1 from public.designs
    where id = likes.design_id
      and user_id = (select auth.uid())
  )
);
