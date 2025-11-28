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

const MyAssignment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [participantCode, setParticipantCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleViewAssignment = async () => {
    if (!participantCode.trim()) {
      toast({
        title: t('enterCode'),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Find participant by code
      const { data: participant, error } = await supabase
        .from('participants')
        .select('*, groups(*)')
        .eq('participant_code', participantCode.toUpperCase())
        .single();

      if (error || !participant) {
        toast({
          title: t('codeNotFound'),
          description: t('checkCode'),
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      navigate(`/group/${participant.group_id}?participant_code=${participantCode.toUpperCase()}`);
    } catch (error: any) {
      toast({
        title: t('error'),
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
          
          <h1 className="text-4xl font-bold text-center mb-3">{t('myAssignment')}</h1>
          <p className="text-center text-lg text-muted-foreground mb-8">
            {t('myAssignmentDesc')}
          </p>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="participantCode" className="text-lg">{t('participantCode')}</Label>
              <Input
                id="participantCode"
                placeholder={t('participantCodePlaceholder')}
                className="h-14 text-lg uppercase"
                value={participantCode}
                onChange={(e) => setParticipantCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <p className="text-sm text-muted-foreground">
                {t('participantCodeHelper')}
              </p>
            </div>

            <Button 
              onClick={handleViewAssignment}
              disabled={loading}
              className="w-full h-14 text-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              {loading ? t('loading') : t('viewMyAssignmentButton')}
            </Button>
          </div>
        </ChristmasCard>
      </div>
    </div>
  );
};

export default MyAssignment;
