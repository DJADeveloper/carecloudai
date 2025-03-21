import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get cookies asynchronously
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch todos for the user
    const { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(todos)

  } catch (error) {
    console.error('Error in GET /api/todos:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    
    // Insert new todo
    const { data, error } = await supabase
      .from('todos')
      .insert([
        { 
          ...body,
          user_id: session.user.id,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in POST /api/todos:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    
    // Update todo
    const { data, error } = await supabase
      .from('todos')
      .update(body)
      .eq('id', body.id)
      .eq('user_id', session.user.id) // Security: ensure user owns the todo
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in PUT /api/todos:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get todo ID from URL
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    // Delete todo
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id) // Security: ensure user owns the todo

    if (error) throw error
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error in DELETE /api/todos:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 