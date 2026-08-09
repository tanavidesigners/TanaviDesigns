import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../../lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'studio_config')
      .single();

    const config = data?.value || {
      admin_work_mobile: '919482245679',
      admin_email: 'tanavidesigns@gmail.com',
      whatsapp_number: '919482245679',
      cod_enabled: true,
      pay_later_enabled: true,
      storefront_domain: 'tanavidesigns.com'
    };

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      config: {
        admin_work_mobile: '919482245679',
        admin_email: 'tanavidesigns@gmail.com',
        whatsapp_number: '919482245679',
        cod_enabled: true,
        pay_later_enabled: true,
        storefront_domain: 'tanavidesigns.com'
      }
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { admin_work_mobile, admin_email, whatsapp_number, cod_enabled, pay_later_enabled } = body;

    const supabase = createAdminClient();
    const configValue = {
      admin_work_mobile: admin_work_mobile || '919482245679',
      admin_email: admin_email || 'tanavidesigns@gmail.com',
      whatsapp_number: whatsapp_number || admin_work_mobile || '919482245679',
      cod_enabled: cod_enabled ?? true,
      pay_later_enabled: pay_later_enabled ?? true,
      storefront_domain: 'tanavidesigns.com',
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key: 'studio_config',
        value: configValue
      });

    if (error) {
      console.error('Save settings error:', error);
      return NextResponse.json({ error: error.message || 'Failed to save settings' }, { status: 500 });
    }

    return NextResponse.json({ success: true, config: configValue });
  } catch (error: any) {
    console.error('Settings API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save studio configuration' }, { status: 500 });
  }
}
