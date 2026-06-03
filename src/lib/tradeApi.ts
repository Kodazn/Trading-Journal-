import { supabase } from './supabaseClient'
import type { Trade } from '../types/trade'

export async function fetchTrades(): Promise<Trade[]> {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching trades:', error)
    throw error
  }

  return (data || []) as Trade[]
}

export async function insertTrade(trade: Omit<Trade, 'id' | 'created_at'>): Promise<Trade> {
  const { data, error } = await supabase
    .from('trades')
    .insert([trade])
    .select()
    .single()

  if (error) {
    console.error('Error inserting trade:', error)
    throw error
  }

  return data as Trade
}

export async function updateTrade(id: string, updates: Partial<Trade>): Promise<Trade> {
  const { data, error } = await supabase
    .from('trades')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating trade:', error)
    throw error
  }

  return data as Trade
}

export async function deleteTrade(id: string): Promise<void> {
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting trade:', error)
    throw error
  }
}

export async function uploadTradeScreenshots(
  tradeId: string,
  files: File[]
): Promise<string[]> {
  const uploadedUrls: string[] = []

  for (const file of files) {
    const fileName = `${tradeId}/${Date.now()}-${file.name}`
    const { error: uploadError, data } = await supabase.storage
      .from('trade-screenshots')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Error uploading screenshot:', uploadError)
      throw uploadError
    }

    const { data: urlData } = supabase.storage
      .from('trade-screenshots')
      .getPublicUrl(fileName)

    if (urlData?.publicUrl) {
      uploadedUrls.push(urlData.publicUrl)
    }
  }

  return uploadedUrls
}
