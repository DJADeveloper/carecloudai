import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { title, description, status, assignedid, residentid } = await request.json()
  
  const { data, error } = await supabase
    .from('tasks')
    .update({ 
      title, 
      description, 
      status, 
      assignedid, 
      residentid 
    })
    .eq('id', params.id)
    .select(`
      *,
      staff!tasks_assignedid_fkey (
        id,
        name,
        surname,
        email
      ),
      residents!tasks_residentid_fkey (
        id,
        fullname
      )
    `)

  if (error) {
    console.error('Task update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform the response data
  const formattedData = {
    ...data[0],
    assigned_to: {
      id: data[0].staff?.id,
      full_name: data[0].staff ? `${data[0].staff.name} ${data[0].staff.surname}`.trim() : null
    },
    resident_name: data[0].residents?.fullname || null
  }

  return NextResponse.json(formattedData)
}

export async function DELETE(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', params.id)

  if (error) {
    console.error('Task deletion error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
} 