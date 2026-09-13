import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Receive the authenticated user's access token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase Client for the Caller
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const callerSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // 2. Determine caller's user ID
    const { data: { user: caller }, error: callerError } = await callerSupabase.auth.getUser();
    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Admin Supabase Client (Service Role)
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

    // 4. Verify caller is a Super Admin
    const { data: callerProfile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single();

    if (profileError || !callerProfile) {
      return new Response(JSON.stringify({ error: 'Failed to verify caller role' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 5. Reject non-super-admin
    if (callerProfile.role !== 'super_admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Only super_admin can create users' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 6. Validate request body
    const { full_name, email, invitation_ids } = await req.json();

    if (!full_name || !email || !invitation_ids || !Array.isArray(invitation_ids) || invitation_ids.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify invitation IDs exist
    const { data: validInvs, error: invsError } = await adminSupabase
      .from('invitations')
      .select('id')
      .in('id', invitation_ids);

    if (invsError || !validInvs || validInvs.length !== invitation_ids.length) {
      return new Response(JSON.stringify({ error: 'One or more invitation IDs are invalid' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 7 & 9. Create the Auth user using Supabase Admin API with a secure invite flow
    // This sends an invite email instead of requiring a plaintext password.
    const { data: newAuthUser, error: authError } = await adminSupabase.auth.admin.inviteUserByEmail(email);

    if (authError) {
      // 6. Duplicate email safe check
      if (authError.message.toLowerCase().includes('already registered') || authError.status === 422 || authError.status === 400) {
        return new Response(JSON.stringify({ error: 'An account with this email already exists.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'Failed to create auth user' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const newUserId = newAuthUser.user.id;

    // 8. Create the public.profiles record
    const { error: profileCreateError } = await adminSupabase
      .from('profiles')
      .insert({
        id: newUserId,
        full_name: full_name,
        role: 'friend', // Safely set role to friend
      });

    if (profileCreateError) {
      // Rollback: delete auth user if profile fails
      await adminSupabase.auth.admin.deleteUser(newUserId);
      return new Response(JSON.stringify({ error: 'Failed to create user profile. Operation rolled back.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 10. Assign the friend to the selected invitation(s)
    const membershipPayloads = validInvs.map(inv => ({
      user_id: newUserId,
      invitation_id: inv.id
    }));

    const { error: memsError } = await adminSupabase
      .from('invitation_members')
      .insert(membershipPayloads);

    if (memsError) {
      // Rollback: delete auth user and profile if membership fails
      // Supabase CASCADE usually handles profiles when auth user is deleted, but we delete auth user explicitly
      await adminSupabase.auth.admin.deleteUser(newUserId);
      return new Response(JSON.stringify({ error: 'Failed to assign invitations. Operation rolled back.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 11. Return safe response
    return new Response(
      JSON.stringify({
        message: 'Friend user created successfully.',
        user: {
          id: newUserId,
          email: newAuthUser.user.email,
          full_name: full_name,
          role: 'friend'
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
