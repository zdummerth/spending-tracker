import {
  supabaseClient,
  supabaseServerClient,
  User
} from '@supabase/supabase-auth-helpers/nextjs';
import { ProductWithPrice, UserDetails } from 'types';

export const supabase = supabaseClient;

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || [];
};

export const updateUserName = async (userId: string, name: string) => {
  const { data, error } = await supabase
    .from<UserDetails>('users')
    .update({
      full_name: name
    })
    .eq('id', userId)
    .limit(1)
    .order('id', { ascending: false })
    .single();

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || {};
};

export const getBlogPostsWithImage = async (ctx: any, isMember: Boolean) => {
  const table = isMember ? 'blog_post' : 'public_blog_post';
  const { data: posts, error } = await supabaseServerClient(ctx)
    .from(table)
    .select('*');

  if (error) {
    console.log(error.message);
    throw error;
  }

  const postArray = posts ? posts : [];

  const postsWithImageUrl = postArray.map((post) => {
    const { publicURL, error: urlErr } = supabaseServerClient(ctx)
      .storage.from('public-images')
      .getPublicUrl(post.image);

    if (urlErr) {
      console.log(urlErr.message);
      throw urlErr;
    }

    return {
      ...post,
      imageUrl: publicURL
    };
  });

  return postsWithImageUrl || [];
};
