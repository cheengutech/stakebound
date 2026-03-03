export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function POST(req: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin()
  
  try {
    const { phone } = await req.json()

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
    }

    const formatted = '+1' + phone.replace(/\D/g, '')

    if (formatted.length !== 12) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    await client.messages.create({
      body: `Welcome to StakeBound. What are you committing to? Reply with your goal and we'll set up your first stake. (Example: "Run 3x this week")`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: formatted,
    })

    await supabaseAdmin.from('sms_log').insert({
      to_phone: formatted,
      message: 'Welcome SMS sent',
      direction: 'outbound',
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('SMS error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}