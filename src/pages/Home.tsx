import { SongCard } from "@/components/SongCard";
import { Sparkles } from "lucide-react";
import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";

const recommendations = [
  { title: "Lose Yourself", artist: "Eminem", image: album1, duration: "5:26" },
  { title: "Godzilla", artist: "Eminem ft. Juice WRLD", image: album1, duration: "3:31" },
  { title: "Without Me", artist: "Eminem", image: album1, duration: "4:50" },
  { title: "Chill Waves", artist: "Various Artists", image: album2, duration: "45:00" },
  { title: "Midnight Dreams", artist: "Lo-Fi Collective", image: album2, duration: "3:42" },
  { title: "Energy Boost", artist: "EDM Hits", image: album3, duration: "3:15" },
];

const moods = [
  { name: "Chill Vibes", color: "bg-blue-500/20 border-blue-500/50" },
  { name: "Energetic", color: "bg-red-500/20 border-red-500/50" },
  { name: "Focus", color: "bg-green-500/20 border-green-500/50" },
  { name: "Party", color: "bg-pink-500/20 border-pink-500/50" },
];

export default function Home() {
  return (
    <div className="space-y-8 pb-32 animate-slide-up">
      {/* AI Greeting */}
      <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/20 dark:border-primary/30">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-full">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-montserrat font-bold mb-2">
              Welcome back, Vansh! 🎧
            </h2>
            <p className="text-muted-foreground font-inter">
              Your mood feels like <span className="text-primary font-semibold">Chill Vibes</span> today.
              Here's what we picked for you based on your listening history.
            </p>
          </div>
        </div>
      </div>

      {/* Mood Filters */}
      <div>
        <h3 className="text-xl font-poppins font-semibold mb-4">How are you feeling?</h3>
        <div className="flex gap-3 flex-wrap">
          {moods.map((mood) => (
            <button
              key={mood.name}
              className={`px-6 py-3 rounded-full border transition-all duration-300 hover:scale-105 font-poppins font-medium ${mood.color} hover:bg-opacity-70`}
            >
              {mood.name}
            </button>
          ))}
        </div>
      </div>

      {/* Your Daily Mix */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-montserrat font-bold">Your Daily Mix</h2>
          <button className="text-primary hover:underline font-poppins font-medium">
            See All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {recommendations.slice(0, 6).map((song, idx) => (
            <SongCard key={idx} {...song} />
          ))}
        </div>
      </section>

      {/* Because You Liked Eminem */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-montserrat font-bold">
            Because You Liked <span className="text-primary">Eminem</span>
          </h2>
          <button className="text-primary hover:underline font-poppins font-medium">
            See All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {recommendations.slice(0, 6).map((song, idx) => (
            <SongCard key={idx} {...song} />
          ))}
        </div>
      </section>

      {/* Evening Relaxation */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-montserrat font-bold">Evening Relaxation</h2>
          <button className="text-primary hover:underline font-poppins font-medium">
            See All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {recommendations.map((song, idx) => (
            <SongCard key={idx} {...song} />
          ))}
        </div>
      </section>
    </div>
  );
}
