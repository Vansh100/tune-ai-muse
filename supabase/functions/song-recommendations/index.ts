import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mood, genres, recentListening } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Song recommendation request:", { mood, genres, recentListening });

    // Build context for AI
    let userContext = "User preferences:\n";
    if (mood) userContext += `- Current mood: ${mood}\n`;
    if (genres && genres.length > 0) userContext += `- Favorite genres: ${genres.join(", ")}\n`;
    if (recentListening && recentListening.length > 0) {
      userContext += `- Recently listened to: ${recentListening.join(", ")}\n`;
    }

    const systemPrompt = `You are an expert music recommender for Tune Central, a music streaming platform. 
Your job is to recommend exactly 5 songs based on the user's preferences. 

For each song, provide:
1. Song title
2. Artist name
3. Genre
4. A brief reason why you're recommending it (1-2 sentences)

Be creative and diverse in your recommendations. Consider the user's mood and preferences but also introduce them to new artists and styles they might enjoy.

Format your response as a JSON array with this structure:
[
  {
    "title": "Song Title",
    "artist": "Artist Name",
    "genre": "Genre",
    "reason": "Why this song fits their taste"
  }
]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContext }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log("AI response:", aiResponse);

    // Parse the AI response
    let recommendations;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Return a fallback response
      recommendations = [
        {
          title: "Can't parse recommendations",
          artist: "System",
          genre: "Error",
          reason: "Please try again"
        }
      ];
    }

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in song-recommendations function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
