import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChristmasCard } from "@/components/ui/christmas-card";
import { ArrowLeft, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CreateGroup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groupName, setGroupName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !creatorName.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Generate unique group code
      const { data: codeData, error: codeError } = await supabase.rpc('generate_code');
      if (codeError) throw codeError;
      
      const groupCode = codeData;

      // Create group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert([{ name: groupName, code: groupCode }])
        .select()
        .single();

      if (groupError) throw groupError;

      // Generate participant code for creator
      const { data: participantCodeData, error: participantCodeError } = await supabase.rpc('generate_code');
      if (participantCodeError) throw participantCodeError;
      
      const participantCode = participantCodeData;

      // Add creator as first participant
      const { error: participantError } = await supabase
        .from('participants')
        .insert([{
          group_id: group.id,
          name: creatorName,
          participant_code: participantCode
        }]);

      if (participantError) throw participantError;

      toast({
        title: "Group created successfully!",
        description: `Share code: ${groupCode}`
      });

      navigate(`/group/${group.id}?participant_code=${participantCode}`);
    } catch (error: any) {
      toast({
        title: "Error creating group",
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
            <Gift className="w-16 h-16 text-primary" />
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-3">Create New Group</h1>
          <p className="text-center text-lg text-muted-foreground mb-8">
            Start a Secret Santa for your family
          </p>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="groupName" className="text-lg">Group Name</Label>
              <Input
                id="groupName"
                placeholder="e.g., Smith Family Christmas 2024"
                className="h-14 text-lg"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="creatorName" className="text-lg">Your Name</Label>
              <Input
                id="creatorName"
                placeholder="e.g., John"
                className="h-14 text-lg"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleCreateGroup}
              disabled={loading}
              className="w-full h-14 text-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </ChristmasCard>
      </div>
    </div>
  );
};

export default CreateGroup;
