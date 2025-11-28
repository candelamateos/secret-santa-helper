import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChristmasCard } from "@/components/ui/christmas-card";
import { ArrowLeft, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const CreateGroup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !creatorName.trim()) {
      toast({
        title: t('fillAllFields'),
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
        title: t('groupCreatedSuccess'),
        description: `${t('shareCode')}: ${groupCode}`
      });

      navigate(`/group/${group.id}?participant_code=${participantCode}`);
    } catch (error: any) {
      toast({
        title: t('errorCreatingGroup'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <LanguageSwitcher />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-8 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('back')}
        </Button>

        <ChristmasCard>
          <div className="flex justify-center mb-6">
            <Gift className="w-16 h-16 text-primary" />
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-3">{t('createNewGroup')}</h1>
          <p className="text-center text-lg text-muted-foreground mb-8">
            {t('createNewGroupDesc')}
          </p>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="groupName" className="text-lg">{t('groupName')}</Label>
              <Input
                id="groupName"
                placeholder={t('groupNamePlaceholder')}
                className="h-14 text-lg"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="creatorName" className="text-lg">{t('yourName')}</Label>
              <Input
                id="creatorName"
                placeholder={t('yourNamePlaceholder')}
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
              {loading ? t('creating') : t('createGroupButton')}
            </Button>
          </div>
        </ChristmasCard>
      </div>
    </div>
  );
};

export default CreateGroup;
