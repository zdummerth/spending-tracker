import Image from 'next/image';
import Link from 'next/link';
import { Post } from 'types';

export default function BlogList({
  data,
  isMember
}: {
  data: Post[];
  isMember: boolean;
}) {
  console.log(data);
  return (
    <div className="grid grid-cols-6 content-center">
      {/* <div className="flex flex-col items-center md:flex-row md:flex-wrap md:justify-center"> */}
      {data.map((post, ind) => {
        return (
          <Link
            key={post.id}
            href={`/${isMember ? 'blog' : 'public-blog'}/${post.handle}`}
          >
            <a
              className={`group flex flex-col items-center justify-center border p-2 col-span-6 ${
                ind === 0 || ind === 1 ? 'lg:col-span-3' : 'lg:col-span-2'
              }`}
            >
              <div className="relative w-full">
                <Image
                  src={post.imageUrl}
                  width={post.handle === 'markhor' ? 200 : 16}
                  height={post.handle === 'markhor' ? 200 : 9}
                  layout="responsive"
                  objectFit="contain"
                />
                <p
                  className="
                    absolute left-0 top-0 bg-gray-600 p-2 group-hover:bg-cyan-300 group-hover:text-black group-hover:w-full"
                >
                  {post.name}
                </p>
              </div>
            </a>
          </Link>
        );
      })}
    </div>
  );
}
