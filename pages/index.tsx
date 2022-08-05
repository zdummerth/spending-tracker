import Pricing from 'components/Pricing';
import BlogList from '@/components/BlogList';
import {
  getActiveProductsWithPrices,
  getBlogPostsWithImage
} from 'utils/supabase-client';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { Product, Post } from 'types';
import { GetStaticPropsResult } from 'next';

interface Props {
  products: Product[];
  posts: Post[];
}

export default function PricingPage({ products, posts }: Props) {
  return (
    <div>
      <BlogList data={posts} isMember={false} />
      <Pricing products={products} />
    </div>
  );
}

// export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
//   const products = await getActiveProductsWithPrices();

//   return {
//     props: {
//       products,
//       posts: []
//     },
//     revalidate: 60
//   };
// }

export const getServerSideProps = withPageAuth({
  redirectTo: '/',
  async getServerSideProps(ctx) {
    try {
      const posts = await getBlogPostsWithImage(ctx, true);
      const products = await getActiveProductsWithPrices();

      return { props: { posts, products } };
    } catch (e) {
      console.log('error: ', e);
      return { props: { posts: [], products: [] } };
    }
  }
});
