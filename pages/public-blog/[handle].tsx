import { useState, useEffect } from 'react';
import {
  User,
  withPageAuth,
  supabaseServerClient
} from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { Post } from 'types';
import MarkdownIt from 'markdown-it';

export default function BlogPage({ post }: { post: Post }) {
  console.log({ post });
  return (
    <div>
      <h1 className="text-2xl text-center">{post.name}</h1>

      <div key={post.id} className="w-full">
        <Image
          src={post.imageUrl}
          width={16}
          height={9}
          layout="responsive"
          objectFit="contain"
        />
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="max-w-screen-sm">
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/',
  async getServerSideProps(ctx) {
    // Run queries with RLS on the server
    try {
      const { data: posts, error } = await supabaseServerClient(ctx)
        .from('public_blog_post')
        .select('*')
        .eq('handle', ctx.params?.handle);

      if (error || !posts) {
        throw 'Error Fetching Post';
      }

      const markdown: MarkdownIt = MarkdownIt({
        html: true
      });

      const { data: file, error: storageError } = await supabaseServerClient(
        ctx
      )
        .storage.from('public-blog-posts')
        .download(posts[0].markdown_file);

      if (storageError || !file) {
        throw 'Error Fetching Post';
      }

      const filetext: string = await file.text();
      const html = await markdown.render(filetext);

      const { publicURL, error: urlErr } = supabaseServerClient(ctx)
        .storage.from('public-images')
        .getPublicUrl(posts[0].image);

      if (urlErr) {
        throw 'Error Fetching Post';
      }

      const post = {
        ...posts[0],
        imageUrl: publicURL,
        html
      };

      return { props: { post } };
    } catch (e) {
      return { props: { error: 'Error fetching post' } };
    }
  }
});
