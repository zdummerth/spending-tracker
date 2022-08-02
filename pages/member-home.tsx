import { useState, useEffect } from 'react'
import {
  User,
  withPageAuth,
  supabaseServerClient,
} from '@supabase/auth-helpers-nextjs';
import { useUser } from 'utils/useUser';
import MarkdownIt from "markdown-it";



export default function ProtectedPage({
  user,
  data
}: {
  user: User,
  data: any
}) {
  // console.log(data)
  return (
    <>
      <div>Protected content for {user.email}</div>
      <div
        dangerouslySetInnerHTML={{__html: data}}
      />
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/',
  async getServerSideProps(ctx) {
    // Run queries with RLS on the server

    const markdown: MarkdownIt = MarkdownIt({
      html: true,
    });

    const { data: post, error } = await supabaseServerClient(ctx)
      .from('blog_post')
      .select('*')
    const { data: file } = await supabaseServerClient(ctx)
      .storage
      .from('membership-bucket')
      .download('stories/dirt-of-the-surface.md');

    const filetext = await file.text()
    const rendered = await markdown.render(filetext);
    // const filenames = files.map(f => f.name)
    // console.log('files', files)
    // console.log('posts', posts)

    console.log('html', rendered)
    // file.text().then(console.log);

    return { props: { data: rendered } };
  }
});
