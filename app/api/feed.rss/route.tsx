import { addPosts, feed } from '../../server/feed';

export async function GET() {
	await addPosts();

	return new Response(feed.rss2(), {
		status: 200,
		headers: {
			'Content-Type': 'text/xml'
		}
	});
}