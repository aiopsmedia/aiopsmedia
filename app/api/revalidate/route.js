import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(request) {
  try {
    if (!REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Revalidation is disabled. Set REVALIDATE_SECRET in the environment to enable it.' },
        { status: 404 }
      );
    }

    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${REVALIDATE_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { path, tag } = body;

    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ revalidated: true, tag, timestamp: Date.now() });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path, timestamp: Date.now() });
    }

    return NextResponse.json(
      { error: 'Provide a path or tag to revalidate' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}
