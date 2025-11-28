import { Button } from "@/components/ui/button";
import { ChristmasCard } from "@/components/ui/christmas-card";
import { Gift, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center mb-6">
            <Gift className="w-20 h-20 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Secret Santa
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Organize your family gift exchange with ease. Simple, fun, and perfect for everyone!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <ChristmasCard className="space-y-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground">Create a Group</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Start a new Secret Santa group and invite your family with a simple code
            </p>
          </ChristmasCard>

          <ChristmasCard className="space-y-4">
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
              <Sparkles className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground">Get Matched</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everyone joins, names are drawn, and you'll see who to buy for!
            </p>
          </ChristmasCard>
        </div>

        {/* Action Buttons */}
        <ChristmasCard>
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-center text-foreground mb-6">
              Ready to Start?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                size="lg" 
                className="h-16 text-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                onClick={() => navigate("/create-group")}
              >
                <Gift className="w-6 h-6 mr-3" />
                Create Group
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-16 text-xl border-2 hover:bg-secondary/10"
                onClick={() => navigate("/join-group")}
              >
                <Users className="w-6 h-6 mr-3" />
                Join Group
              </Button>
            </div>
          </div>
        </ChristmasCard>

        {/* Info Section */}
        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground">
            Already joined? Enter your participant code to see your assignment
          </p>
          <Button 
            variant="link" 
            size="lg"
            className="text-lg mt-2"
            onClick={() => navigate("/my-assignment")}
          >
            View My Assignment →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
