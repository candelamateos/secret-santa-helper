import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChristmasCard } from "@/components/ui/christmas-card";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const JoinGroup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [groupCode, setGroupCode] = useState("");
  const [yourName, setYourName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinGroup = async () => {
    if (!groupCode.trim() || !yourName.trim()) {
      toast({
        title: t('fillAllFields'),
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
          title: t('groupNotFound'),
          description: t('checkCode'),
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
        title: t('successfullyJoined'),
        description: `${t('welcomeTo')} ${group.name}`
      });

      navigate(`/group/${group.id}?participant_code=${participantCode}`);
    } catch (error: any) {
      toast({
        title: t('errorJoiningGroup'),
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
            <Users className="w-16 h-16 text-secondary" />
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-3">{t('joinAGroup')}</h1>
          <p className="text-center text-lg text-muted-foreground mb-8">
            {t('joinGroupDesc')}
          </p>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="groupCode" className="text-lg">{t('groupCode')}</Label>
              <Input
                id="groupCode"
                placeholder={t('groupCodePlaceholder')}
                className="h-14 text-lg uppercase"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <p className="text-sm text-muted-foreground">
                {t('groupCodeHelper')}
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="yourName" className="text-lg">{t('yourName')}</Label>
              <Input
                id="yourName"
                placeholder={t('yourNamePlaceholder2')}
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
              {loading ? t('joining') : t('joinGroupButton')}
            </Button>
          </div>
        </ChristmasCard>
      </div>
    </div>
  );
};

export default JoinGroup;
