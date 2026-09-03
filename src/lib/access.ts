import { supabase } from './supabase'
import { hasAllowedAccess } from './accessRules'

export const accessService = {
  async isCurrentUserAllowed() {
    const { data, error } = await supabase.rpc('is_current_user_allowed')
    if (error) throw error
    return hasAllowedAccess(data)
  },
}
