import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'npm:@google/generative-ai'

// Deno Edge Function to handle Webhook payloads from Supabase
serve(async (req) => {
  try {
    const payload = await req.json()
    console.log("Webhook payload received:", payload)

    // Ensure it's an INSERT event and we have the record
    if (payload.type !== 'INSERT' || !payload.record) {
      return new Response(JSON.stringify({ message: "Not an insert event, skipping." }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      })
    }

    const record = payload.record
    const { id, title, url, tags, summary } = record

    // Check if we need to auto-tag (only if tags are empty and summary is null)
    // If the user already provided tags, we might still want to generate a summary,
    // but the prompt asked: "agar user ne manually tags nahi diye the" -> update tags,
    // "aur ek naya summary column mein save karo" -> always generate summary.
    
    // Initialize Gemini
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      console.warn("GEMINI_API_KEY is missing. Skipping auto-tagging.")
      return new Response(JSON.stringify({ error: "Missing Gemini API Key" }), { status: 200 })
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

    // Build the prompt
    const prompt = `
      You are an expert content analyzer for a developer community called Agentic Devs Collective.
      Analyze the following resource:
      Title: "${title}"
      URL: "${url}"
      
      Tasks:
      1. Provide a short 1-2 line summary of what this resource is likely about based on its title and URL.
      2. Suggest 3 to 5 relevant technical tags (like react, typescript, machine-learning, etc). Provide them as a comma-separated list.
      
      Output exactly in this JSON format and nothing else:
      {
        "summary": "...",
        "tags": ["tag1", "tag2"]
      }
    `

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    // Parse the JSON response
    // Sometimes Gemini wraps it in ```json ... ```, so clean it up
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim()
    
    let generatedData
    try {
      generatedData = JSON.parse(cleanJson)
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", responseText)
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), { status: 200 })
    }

    // Determine what to update
    const updates: any = {
      summary: generatedData.summary,
      ai_tagged: true
    }

    // Only update tags if the user didn't provide any, or provided an empty array
    if (!tags || tags.length === 0) {
      updates.tags = generatedData.tags
    }

    // Update the database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.warn("Missing Supabase credentials in Edge Function environment.")
      return new Response(JSON.stringify({ error: "Missing DB credentials" }), { status: 200 })
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    const { error: updateError } = await supabaseAdmin
      .from('resources')
      .update(updates)
      .eq('id', id)

    if (updateError) {
      console.error("Failed to update resource:", updateError)
      return new Response(JSON.stringify({ error: "Failed to update DB" }), { status: 200 })
    }

    console.log("Successfully auto-tagged resource", id, updates)
    return new Response(JSON.stringify({ success: true, updates }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })

  } catch (err: any) {
    console.error("Edge function error:", err)
    // Fail silently (return 200) so we don't break the webhook/DB retries unnecessarily
    // if it's just an API failure.
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  }
})
