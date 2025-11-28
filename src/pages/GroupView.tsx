import { Button } from "@/components/ui/button";
import { ChristmasCard } from "@/components/ui/christmas-card";
import { ArrowLeft, Users, Gift, Sparkles, Copy, Check } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const GroupView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();
  const participantCode = searchParams.get('participant_code');
  
  const [group, setGroup] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<any>(null);
  const [assignedPerson, setAssignedPerson] = useState<any>(null);
  const [wishlist, setWishlist] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadGroupData();
    
    // Subscribe to changes
    const channel = supabase
      .channel('group-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'participants',
        filter: `group_id=eq.${groupId}`
      }, () => {
        loadGroupData();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'groups',
        filter: `id=eq.${groupId}`
      }, () => {
        loadGroupData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, participantCode]);

  const loadGroupData = async () => {
    try {
      // Load group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;
      setGroup(groupData);

      // Load participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('group_id', groupId);

      if (participantsError) throw participantsError;
      setParticipants(participantsData || []);

      // Load current participant
      if (participantCode) {
        const { data: currentData, error: currentError } = await supabase
          .from('participants')
          .select('*')
          .eq('participant_code', participantCode)
          .single();

        if (currentError) throw currentError;
        setCurrentParticipant(currentData);
        setWishlist(currentData?.wishlist || "");

        // If drawn, load assigned person
        if (groupData?.is_drawn && currentData?.assigned_to_id) {
          const { data: assignedData, error: assignedError } = await supabase
            .from('participants')
            .select('*')
            .eq('id', currentData.assigned_to_id)
            .single();

          if (assignedError) throw assignedError;
          setAssignedPerson(assignedData);
        }
      }
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

  const handleDrawNames = async () => {
    if (participants.length < 2) {
      toast({
        title: t('waitingForMore'),
        description: t('needAtLeast'),
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('draw_names', { group_id_param: groupId });
      if (error) throw error;

      toast({
        title: t('namesDrawnSuccess'),
        description: t('namesDrawn')
      });

      loadGroupData();
    } catch (error: any) {
      toast({
        title: t('errorDrawingNames'),
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSaveWishlist = async () => {
    try {
      const { error } = await supabase
        .from('participants')
        .update({ wishlist })
        .eq('id', currentParticipant.id);

      if (error) throw error;

      toast({
        title: t('wishlistUpdated'),
        description: ""
      });
    } catch (error: any) {
      toast({
        title: t('errorUpdatingWishlist'),
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const copyGroupCode = () => {
    navigator.clipboard.writeText(group?.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: t('shareGroupCode'),
      description: ""
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <p className="text-2xl text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <LanguageSwitcher />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-8 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('back')}
        </Button>

        {/* Group Header */}
        <ChristmasCard className="mb-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{group?.name}</h1>
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-xl text-muted-foreground">{t('groupCodeLabel')}:</p>
              <code className="text-2xl font-mono font-bold bg-muted px-4 py-2 rounded">
                {group?.code}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyGroupCode}
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
            <p className="text-muted-foreground">{t('shareGroupCode')}</p>
          </div>
        </ChristmasCard>

        {/* Participants List */}
        <ChristmasCard className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            {t('participants')} ({participants.length})
          </h2>
          <div className="space-y-2">
            {participants.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Gift className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium">{p.name}</span>
                {p.id === currentParticipant?.id && (
                  <span className="ml-auto text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {t('yourName')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </ChristmasCard>

        {/* Draw Names or Assignment */}
        {!group?.is_drawn ? (
          <ChristmasCard>
            <div className="text-center space-y-4">
              <Sparkles className="w-16 h-16 text-accent mx-auto" />
              <h2 className="text-3xl font-bold">{t('readyToStart')}</h2>
              <p className="text-lg text-muted-foreground">
                {t('shareGroupCode')}
              </p>
              <Button
                onClick={handleDrawNames}
                size="lg"
                className="h-14 text-xl bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground"
                disabled={participants.length < 2}
              >
                <Sparkles className="w-6 h-6 mr-2" />
                {t('drawNames')}
              </Button>
              {participants.length < 2 && (
                <p className="text-sm text-destructive">{t('needAtLeast')}</p>
              )}
            </div>
          </ChristmasCard>
        ) : assignedPerson ? (
          <div className="space-y-6">
            <ChristmasCard>
              <div className="text-center space-y-4">
                <Gift className="w-16 h-16 text-primary mx-auto" />
                <h2 className="text-3xl font-bold">{t('yourAssignment')}</h2>
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
                  <p className="text-xl text-muted-foreground mb-2">{t('youAreGivingTo')}:</p>
                  <p className="text-4xl font-bold text-primary">{assignedPerson.name}</p>
                </div>
                {assignedPerson.wishlist && (
                  <div className="text-left bg-muted/30 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      {t('theirWishlist')}
                    </h3>
                    <p className="text-lg whitespace-pre-wrap">{assignedPerson.wishlist}</p>
                  </div>
                )}
              </div>
            </ChristmasCard>

            <ChristmasCard>
              <h2 className="text-2xl font-semibold mb-4">{t('yourWishlist')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('shareGroupCode')}
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="wishlist" className="text-lg">{t('yourWishlist')}</Label>
                  <Textarea
                    id="wishlist"
                    placeholder={t('wishlistPlaceholder')}
                    className="min-h-[150px] text-lg mt-2"
                    value={wishlist}
                    onChange={(e) => setWishlist(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSaveWishlist}
                  className="w-full h-12 text-lg"
                >
                  {t('wishlistUpdated')}
                </Button>
              </div>
            </ChristmasCard>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GroupView;
