import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { getBlogPostsWithImage } from 'utils/supabase-client';
import { Post } from 'types';
import BlogList from '@/components/BlogList';

export default function ProtectedPage({ data }: { data: Post[] }) {
  console.log(data);
  return <BlogList data={data} isMember={false} />;
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/',
  async getServerSideProps(ctx) {
    try {
      const posts = await getBlogPostsWithImage(ctx, false);
      return { props: { data: posts } };
    } catch (e) {
      console.log('error: ', e);
      return { props: { data: [] } };
    }
  }
});
