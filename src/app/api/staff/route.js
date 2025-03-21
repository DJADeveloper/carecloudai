import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase
    .from('staff')
    .select(`
      id,
      username,
      name,
      surname,
      email
    `)
    .order('surname')

  if (error) {
    console.error('Staff query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const formattedData = data.map(staff => ({
    id: staff.id,
    full_name: `${staff.name} ${staff.surname}`.trim(),
    email: staff.email
  }))

  return NextResponse.json(formattedData)
} 