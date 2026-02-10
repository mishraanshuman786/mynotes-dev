import { getAllBlogs } from '@/lib/getAllBlogs';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourblog.com';
  const blogs = getAllBlogs();

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>My Blog - Learning &amp; Coding Notes</title>
    <link>${baseUrl}</link>
    <description>A personal blog documenting my learning journey, coding knowledge, technical notes, and experiments.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${blogs
      .map(
        (blog) => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${baseUrl}/blogs/${blog.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blogs/${blog.slug}</guid>
      <description><![CDATA[${blog.description}]]></description>
      <pubDate>${new Date(blog.date).toUTCString()}</pubDate>
      <category>${blog.category}</category>
      ${blog.tags.map((tag) => `<category>${tag}</category>`).join('\n      ')}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
