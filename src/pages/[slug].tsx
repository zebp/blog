import fs from 'fs';
import {GetStaticPaths, GetStaticProps} from 'next';
import {serialize} from 'next-mdx-remote/serialize';
import Head from 'next/head';
import Link from 'next/link';
import { postFilePaths } from '../utils/mdxUtils';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import Image from 'next/image';
import { globby } from 'globby';
import { WebGLFingerprint } from '../posts/2022/12/reverse-engineering-tiktok-vm-obfuscation/reverse-engineering-tiktok';

interface Props {
	source: any;
	frontMatter: {
		[key: string]: any;
	}
}

const components = {
	Head,
	WebGLFingerprint,
	img: (props: any) => (
    // height and width are part of the props, so they get automatically passed here with {...props}
    <Image {...props} layout="responsive" loading="lazy" width={100} height={100} />
  ),
};

export default function PostPage({source, frontMatter}: Props) {
	return (
		<div className="space-y-4 m-auto max-w-4xl">
			<Head>
				<title>{frontMatter.name}</title>
				<meta name="description" content={frontMatter.excerpt} />
				<meta name="keywords" content={frontMatter.keywords} />
				<meta name="theme-color" content={frontMatter.hidden ? '#ebb305' : '#171717'} />
			</Head>

			{frontMatter.hidden && (
				<div className="bg-yellow-500 text-yellow-900 rounded-md py-2 px-4">
					<p>hey! this post is hidden! please don't share the link for now...</p>
				</div>
			)}

			<div>
				<Link href="/" className="text-blue-500 dark:text-neutral-400 hover:text-blue-800 dark:hover:text-neutral-600">
					../
				</Link>
			</div>

			<p>
				<time dateTime={new Date(frontMatter.date).toISOString()}>{new Date(frontMatter.date).toDateString()}</time>
			</p>
			<small>authored by {frontMatter.author}</small>
			<main className="prose max-w-none prose-blue prose-img:rounded-md prose-img:w-full dark:prose-invert text-lg">
				<h1>{frontMatter.name}</h1>
				<MDXRemote {...source} components={components} />
			</main>
			<footer className="my-8 text-center">
				<span><span className="text-neutral-500">Content on this site is licensed</span> <Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</Link></span>
			</footer>
		</div>
	);
}

export const getStaticProps: GetStaticProps<Props> = async ({params}) => {
	const postFilePath = await globby(`**/${params!.slug}.mdx`);
	const source = fs.readFileSync(postFilePath[0]);

	const { content, data } = matter(source);

	const mdxSource = await serialize(content, {
		scope: data,
		mdxOptions: {
			remarkPlugins: [],
			rehypePlugins: [],
		},
	});

	return {
		props: {
			source: mdxSource,
			frontMatter: data,
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const fps = await postFilePaths;
	const paths = fps.map((path) => path.replace(/\.mdx?$/, '').substring(path.lastIndexOf('/')+1)).map((slug) => ({params: {slug}}));

	return {
		paths,
		fallback: false,
	};
};
