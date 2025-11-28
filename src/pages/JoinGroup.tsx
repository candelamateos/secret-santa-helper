import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChristmasCard } from "@/components/ui/christmas-card";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const JoinGroup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groupCode, setGroupCode] = useState("");
  const [yourName, setYourName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinGroup = async () => {
    if (!groupCode.trim() || !yourName.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Find group by code
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('code', groupCode.toUpperCase())
        .single();

      if (groupError || !group) {
        toast({
          title: "Group not found",
          description: "Please check the code and try again",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Generate participant code
      const { data: participantCodeData, error: participantCodeError } = await supabase.rpc('generate_code');
      if (participantCodeError) throw participantCodeError;
      
      const participantCode = participantCodeData;

      // Add participant
      const { error: participantError } = await supabase
        .from('participants')
        .insert([{
          group_id: group.id,
          name: yourName,
          participant_code: participantCode
        }]);

      if (participantError) throw participantError;

      toast({
        title: "Successfully joined!",
        description: `Welcome to ${group.name}`
      });

      navigate(`/group/${group.id}?participant_code=${participantCode}`);
    } catch (error: any) {
      toast({
        title: "Error joining group",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-8 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <ChristmasCard>
          <div className="flex justify-center mb-6">
            <Users className="w-16 h-16 text-secondary" />
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-3">Join a Group</h1>
          <p className="text-center text-lg text-muted-foreground mb-8">
            Enter the group code to join
          </p>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="groupCode" className="text-lg">Group Code</Label>
              <Input
                id="groupCode"
                placeholder="e.g., ABC123"
                className="h-14 text-lg uppercase"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <p className="text-sm text-muted-foreground">
                Ask the organizer for the 6-character code
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="yourName" className="text-lg">Your Name</Label>
              <Input
                id="yourName"
                placeholder="e.g., Sarah"
                className="h-14 text-lg"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleJoinGroup}
              disabled={loading}
              className="w-full h-14 text-xl bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary"
            >
              {loading ? "Joining..." : "Join Group"}
            </Button>
          </div>
        </ChristmasCard>
      </div>
    </div>
  );
};

export default JoinGroup;
