import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Music, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Recommendation {
  title: string;
  artist: string;
  genre: string;
  reason: string;
}

export const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('song-recommendations', {
        body: {
          mood: "Energetic and upbeat",
          genres: ["Pop", "Electronic", "Indie"],
          recentListening: ["Blinding Lights", "Levitating", "Stay"]
        }
      });

      if (error) {
        console.error("Error:", error);
        if (error.message.includes("Rate limit")) {
          toast.error("Too many requests. Please wait a moment and try again.");
        } else if (error.message.includes("credits")) {
          toast.error("AI credits exhausted. Please add credits to continue.");
        } else {
          toast.error("Failed to get recommendations. Please try again.");
        }
        return;
      }

      if (data?.recommendations) {
        setRecommendations(data.recommendations);
        toast.success("Got your personalized recommendations!");
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-montserrat font-bold">AI Song Recommendations</h2>
            <p className="text-muted-foreground font-inter">
              Personalized picks powered by AI
            </p>
          </div>
        </div>
        <Button
          onClick={getRecommendations}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 shadow-lg font-poppins"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Getting recommendations...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Get Recommendations
            </>
          )}
        </Button>
      </div>

      {recommendations.length > 0 && (
        <div className="grid gap-4">
          {recommendations.map((rec, index) => (
            <Card
              key={index}
              className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Music className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-poppins group-hover:text-primary transition-colors">
                        {rec.title}
                      </CardTitle>
                      <CardDescription className="font-inter">
                        {rec.artist}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-inter">
                    {rec.genre}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-inter leading-relaxed">
                  {rec.reason}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && recommendations.length === 0 && (
        <Card className="border-dashed border-2 border-border">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-inter">
              Click the button above to get AI-powered song recommendations
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
