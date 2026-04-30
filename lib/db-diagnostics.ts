/**
 * Database Helper Utilities
 * Helps diagnose database issues with Supabase
 */

import { supabase } from './supabase'
import { APP_CONFIG } from './config'

/**
 * Test if the user can insert kindness acts
 * Run this to diagnose RLS or permission issues
 */
export async function testKindnessActInsert(userId: string) {
  try {
    console.log('Testing kindness act insert...')
    console.log('User ID:', userId)
    console.log('Table:', APP_CONFIG.collections.kindnessActs)

    // Test insert
    const { data, error } = await supabase
      .from(APP_CONFIG.collections.kindnessActs)
      .insert([
        {
          user_id: userId,
          description: 'Test kindness act',
          category: 'Test',
          completed: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('Insert failed:', error)
      return {
        success: false,
        error: error.message,
        code: error.code,
        hint: error.hint,
      }
    }

    console.log('Insert successful:', data)

    // Test delete (cleanup)
    if (data && data[0]) {
      const { error: deleteError } = await supabase
        .from(APP_CONFIG.collections.kindnessActs)
        .delete()
        .eq('id', data[0].id)

      if (deleteError) {
        console.error('Cleanup failed:', deleteError)
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('Test error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get current user session
 */
export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Session error:', error)
      return null
    }
    return data.session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * Test all database connections and permissions
 */
export async function runFullDatabaseDiagnostics(userId: string) {
  console.log('=== Running Database Diagnostics ===')

  // Check session
  const session = await getCurrentSession()
  if (!session) {
    console.warn('⚠️ No active session. User might not be authenticated.')
    return
  }
  console.log('✓ User authenticated:', session.user.email)

  // Test insert
  const insertTest = await testKindnessActInsert(userId)
  if (insertTest.success) {
    console.log('✓ Kindness act insert successful')
  } else {
    console.error('✗ Kindness act insert failed:', insertTest.error)
  }

  console.log('=== Diagnostics Complete ===')
}
