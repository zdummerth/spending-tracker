import {
  User,
  withPageAuth,
  supabaseServerClient
} from '@supabase/auth-helpers-nextjs';

export default function BlogPage() {
  return (
    <div>{/* <h1 className="text-2xl text-center">{post.name}</h1> */}</div>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/'
});
