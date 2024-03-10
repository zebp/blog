import Link from 'next/link';
import { ReactNode } from 'react';
import { BlogLink } from './client/components/post_link';

export default function Home({ posts }: { posts: any[] }) {
	return (
		<div className="flex flex-col w-full px-0 sm:px-16 transition-all">
			<main className="space-y-8">
				<h2>
					<span>nullpt.rs</span>{' '}
					<a
						target="_blank"
						href="https://github.com/nullpt-rs"
						className="text-neutral-500 hover:text-blue-500"
						rel="noreferrer"
					>
						{' '}
						– github
					</a>
					<a
						target="_blank"
						href="https://twitter.com/nullpt_rs"
						className="text-neutral-500 hover:text-blue-500"
						rel="noreferrer"
					>
						{' '}
						- twitter
					</a>
					<a
						target="_blank"
						href="https://nullpt.rs/feed.rss"
						className="text-neutral-500 hover:text-blue-500"
						rel="noreferrer"
					>
						{' '}
						- rss
					</a>
				</h2>

				<ul className="space-y-1 list-disc list-inside">
					{posts
						.filter((post: any) => !post.hidden)
						.sort((p, p2) => Date.parse(p2.data.date) - Date.parse(p.data.date))
						.map((post, postIndex) => (
							<BlogLink
								tabIndex={postIndex}
								key={post.data.slug}
								date={post.data.date}
								author={post.data.author}
								href={`/${post.data.slug}`}
							>
								{post.data.name}
							</BlogLink>
						))}
				</ul>
			</main>
			<footer className="my-8">
				<span>
					<span className="text-neutral-500">Content on this site is licensed</span>{' '}
					<Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</Link>
				</span>
			</footer>
		</div>
	);
}
