import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../../lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ announcements: announcements || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, message, link_url, active } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Announcement message text is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // If making active, deactivate other announcements first
    if (active) {
      await supabase
        .from('announcements')
        .update({ active: false })
        .neq('id', id || '00000000-0000-0000-0000-000000000000');
    }

    if (id) {
      // Update existing announcement
      const { data, error } = await supabase
        .from('announcements')
        .update({
          message: message.trim(),
          link_url: link_url ? link_url.trim() : null,
          active: !!active
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, announcement: data });
    } else {
      // Create new announcement
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          message: message.trim(),
          link_url: link_url ? link_url.trim() : null,
          active: active !== undefined ? !!active : true
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, announcement: data });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error saving announcement' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('announcements').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error deleting announcement' }, { status: 500 });
  }
}
