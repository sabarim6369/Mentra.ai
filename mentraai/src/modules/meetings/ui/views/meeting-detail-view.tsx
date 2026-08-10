"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MeetingForm } from "../components/meeting-form";
import { Video, Edit, Trash2, ArrowLeft, Calendar, Clock, Sparkles, Bot, Play, Square, X, FileText, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { type MeetingsInsert } from "../../schema";

interface MeetingDetailViewProps {
  meetingId: string;
}

interface TranscriptItem {
  speaker_id: string;
  type: string;
  text: string;
  start_ts: number;
  stop_ts: number;
}

const statusColors = {
  upcoming: { bg: 'bg-blue-950/30', text: 'text-blue-400', border: 'border-blue-800/50', icon: Calendar },
  active: { bg: 'bg-green-950/30', text: 'text-green-400', border: 'border-green-800/50', icon: Play },
  completed: { bg: 'bg-gray-800/30', text: 'text-gray-400', border: 'border-gray-700/50', icon: Square },
  cancelled: { bg: 'bg-red-950/30', text: 'text-red-400', border: 'border-red-800/50', icon: X },
  processing: { bg: 'bg-yellow-950/30', text: 'text-yellow-400', border: 'border-yellow-800/50', icon: Clock },
};

const statusLabels = {
  upcoming: 'Upcoming',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
  processing: 'Processing',
};

const TranscriptModal = ({ isOpen, onClose, transcriptUrl }: { isOpen: boolean; onClose: () => void; transcriptUrl: string }) => {
  const [transcriptData, setTranscriptData] = useState<TranscriptItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && transcriptUrl) {
      fetchTranscript();
    }
  }, [isOpen, transcriptUrl]);

  const fetchTranscript = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(transcriptUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const lines = text.trim().split('\n').filter(line => line.trim());
      const parsedData = lines.map(line => {
        try {
          return JSON.parse(line) as TranscriptItem;
        } catch (parseError) {
          console.warn('Failed to parse line:', line);
          return null;
        }
      }).filter(Boolean) as TranscriptItem[];
      
      parsedData.sort((a, b) => a.start_ts - b.start_ts);
      setTranscriptData(parsedData);
    } catch (err) {
      setError('Failed to load transcript');
      console.error('Error fetching transcript:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor(timestamp / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/30 border-slate-800/50 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-violet-600 to-purple-600 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
          <DialogTitle className="flex items-center space-x-3 text-white text-lg">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-semibold">Meeting Transcript</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-2 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-300">Loading transcript...</p>
                <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the conversation</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 bg-red-950/30 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-red-400">{error}</p>
                <p className="text-sm text-red-500 mt-1">Unable to load the transcript data</p>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-900/50 rounded-xl border border-slate-800/50 backdrop-blur-sm shadow-inner">
              <div className="h-full overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-violet-600/50 scrollbar-track-transparent">
                {transcriptData.map((item, index) => {
                  const isUser = index % 2 === 0;

                  return (
                    <div
                      key={`${item.speaker_id}-${index}`}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-3 max-w-[80%] group`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
                          isUser
                            ? 'bg-gradient-to-br from-violet-500 to-purple-600'
                            : 'bg-gradient-to-br from-emerald-500 to-green-600'
                        }`}>
                          {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                        </div>

                        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}>
                          <div className={`relative px-5 py-3 rounded-2xl shadow-sm max-w-lg transition-all duration-200 hover:shadow-md ${
                            isUser
                              ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-br-sm'
                              : 'bg-slate-800/50 text-gray-200 rounded-bl-sm border border-slate-700/50'
                          }`}>
                            <p className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-gray-200'}`}>
                              {item.text}
                            </p>
                            {isUser && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-600 rotate-45 rounded-sm"></div>
                            )}
                            {!isUser && (
                              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-slate-800 border-l border-b border-slate-700/50 rotate-45 rounded-sm"></div>
                            )}
                          </div>

                          <div className={`text-xs text-gray-500 px-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                            isUser ? 'text-right' : 'text-left'
                          }`}>
                            {formatTime(item.start_ts)} - {formatTime(item.stop_ts)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {transcriptData.length === 0 && !loading && !error && (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <FileText className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg">No transcript data available</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 px-2">
          <div className="text-sm text-gray-500">
            {transcriptData.length > 0 && `${transcriptData.length} messages`}
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50 text-gray-300 px-6"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const MeetingDetailView = ({ meetingId }: MeetingDetailViewProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [showFullInstructions, setShowFullInstructions] = useState(false);
  
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  const { data: meeting } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  const updateMeetingMutation = useMutation({
    ...trpc.meetings.update.mutationOptions(),
    onSuccess: () => {
      toast.success("Meeting updated successfully!");
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update meeting");
    },
  });

  const deleteMeetingMutation = useMutation({
    ...trpc.meetings.remove.mutationOptions(),
    onSuccess: () => {
      toast.success("Meeting deleted successfully!");
      router.push("/dashboard/meetings");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete meeting");
      setIsDeleteDialogOpen(false);
    },
  });

  const handleUpdateMeeting = async (data: MeetingsInsert) => {
    updateMeetingMutation.mutate({
      id: meetingId,
      data,
    });
  };

  const handleDeleteMeeting = async () => {
    deleteMeetingMutation.mutate({ id: meetingId });
  };

  const handleStartMeeting = () => {
    router.push(`/call/${meetingId}`);
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return null;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatScheduledTime = (scheduledTime: string | null) => {
    if (!scheduledTime) return null;
    const date = new Date(scheduledTime);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const truncateInstructions = (text: string, lines: number = 5) => {
    const words = text.split(' ');
    const wordsPerLine = 12;
    const maxWords = lines * wordsPerLine;
    
    if (words.length <= maxWords) {
      return { text, isTruncated: false };
    }
    
    return {
      text: words.slice(0, maxWords).join(' ') + '...',
      isTruncated: true
    };
  };

  if (!meeting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-violet-500" />
          <p className="text-gray-400">Loading meeting details...</p>
        </div>
      </div>
    );
  }

  const { text: instructionsText, isTruncated } = showFullInstructions 
    ? { text: meeting.instructions || '', isTruncated: false }
    : truncateInstructions(meeting.instructions || '');

  const statusColor = statusColors[meeting.status as keyof typeof statusColors] || statusColors.upcoming;
  const StatusIcon = statusColor.icon;
  const scheduledTime = formatScheduledTime(meeting.scheduledStartTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-800/50">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/meetings")}
              className="hover:bg-slate-800/50 transition-all duration-200 rounded-xl px-4 py-2 text-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Meetings
            </Button>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                {meeting.name}
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                <Badge
                  variant="secondary"
                  className={`text-xs px-3 py-1 ${statusColor.bg} ${statusColor.text} ${statusColor.border} border-2 flex items-center space-x-2 shadow-sm`}
                >
                  <StatusIcon className="w-3 h-3" />
                  <span className="font-medium">{statusLabels[meeting.status as keyof typeof statusLabels] || 'Unknown'}</span>
                </Badge>
                {meeting.duration && (
                  <Badge variant="outline" className="text-xs px-3 py-1 bg-slate-800/50 border-slate-700/50 shadow-sm text-gray-300">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDuration(meeting.duration)}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs px-3 py-1 bg-slate-800/50 border-slate-700/50 shadow-sm text-gray-300">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(meeting.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200 bg-slate-800/30 shadow-sm px-4 py-2 text-gray-300 border-slate-700/50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="hover:bg-red-950/30 hover:border-red-800/50 hover:text-red-400 transition-all duration-200 bg-slate-800/30 shadow-sm px-4 py-2 text-gray-300 border-slate-700/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 border-b border-slate-800/50">
                <CardTitle className="flex items-center space-x-3 text-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-semibold">Meeting Instructions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-sm max-w-none text-gray-300">
                  <p className="whitespace-pre-wrap leading-relaxed text-base">
                    {instructionsText}
                  </p>
                  {isTruncated && !showFullInstructions && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFullInstructions(true)}
                      className="mt-3 text-violet-400 hover:text-violet-300 hover:bg-violet-950/30 px-0"
                    >
                      Show more...
                    </Button>
                  )}
                  {showFullInstructions && meeting.instructions && meeting.instructions.length > instructionsText.length && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFullInstructions(false)}
                      className="mt-3 text-violet-400 hover:text-violet-300 hover:bg-violet-950/30 px-0"
                    >
                      Show less
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {(meeting.transcriptUrl || meeting.recordingUrl || meeting.summary) && (
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-200">
                    <Video className="w-5 h-5 text-purple-400" />
                    <span>Meeting Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {meeting.recordingUrl && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <Video className="w-4 h-4 mr-2 text-purple-400" />
                        Meeting Recording
                      </h4>
                      <div className="relative rounded-lg overflow-hidden bg-black">
                        <video
                          controls
                          className="w-full h-auto max-h-64 object-contain"
                          preload="metadata"
                        >
                          <source src={meeting.recordingUrl} type="video/mp4" />
                          <source src={meeting.recordingUrl} type="video/webm" />
                          <source src={meeting.recordingUrl} type="video/ogg" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}

                  {meeting.summary && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-green-400" />
                        Meeting Summary
                      </h4>
                      <div className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border border-green-800/50 rounded-lg p-4">
                        <div className="prose prose-sm max-w-none text-gray-300">
                          <p className="whitespace-pre-wrap leading-relaxed text-sm">
                            {meeting.summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {meeting.transcriptUrl && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-blue-400" />
                        Transcript
                      </h4>
                      <Button
                        variant="outline"
                        className="w-full justify-start hover:bg-slate-800/50 hover:border-slate-600 text-gray-300 border-slate-700/50"
                        onClick={() => setIsTranscriptModalOpen(true)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Full Transcript
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className={`${statusColor.bg} border-2 ${statusColor.border}`}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${statusColor.text}`}>
                  <StatusIcon className="w-5 h-5" />
                  <span>Meeting Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`text-center py-4 ${statusColor.text}`}>
                  <div className="text-2xl font-bold mb-1">
                    {statusLabels[meeting.status as keyof typeof statusLabels] || 'Unknown'}
                  </div>
                  {meeting.status === 'completed' && meeting.duration && (
                    <div className="text-sm opacity-75">
                      Duration: {formatDuration(meeting.duration)}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {meeting.status === 'upcoming' && (
                    <>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleStartMeeting}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Meeting
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full hover:bg-red-950/30 hover:border-red-800/50 hover:text-red-400 text-gray-300 border-slate-700/50"
                        disabled
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel Meeting
                      </Button>
                    </>
                  )}

                  {meeting.status === 'active' && (
                    <Button
                      variant="outline"
                      className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600"
                      disabled
                    >
                      <Square className="w-4 h-4 mr-2" />
                      End Meeting
                    </Button>
                  )}

                  {(meeting.status === 'cancelled' || (meeting.status === 'completed' && !meeting.recordingUrl)) && (
                    <div className="text-center text-sm text-gray-500 py-4">
                      Meeting has been {meeting.status}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-violet-950/30 to-purple-950/30 border-violet-800/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-violet-300">
                  <Bot className="w-5 h-5" />
                  <span>Agent Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-violet-400">Agent Name</label>
                  <p className="text-sm text-violet-300 mt-1 font-medium">
                    {meeting.agentName || 'No agent assigned'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-200">
                  <Calendar className="w-5 h-5" />
                  <span>Meeting Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Meeting ID</label>
                  <p className="text-sm text-gray-300 font-mono bg-slate-800/50 px-2 py-1 rounded mt-1">
                    {meeting.id}
                  </p>
                </div>

                {scheduledTime && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Scheduled Time</label>
                    <p className="text-sm text-gray-300 mt-1">
                      {scheduledTime}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-400">Created</label>
                  <p className="text-sm text-gray-300 mt-1">
                    {new Date(meeting.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400">Last Updated</label>
                  <p className="text-sm text-gray-300 mt-1">
                    {new Date(meeting.updatedAt).toLocaleString()}
                  </p>
                </div>

                {meeting.startedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Started At</label>
                    <p className="text-sm text-gray-300 mt-1">
                      {new Date(meeting.startedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {meeting.endedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Ended At</label>
                    <p className="text-sm text-gray-300 mt-1">
                      {new Date(meeting.endedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-gray-200">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-gray-300 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Meeting Details
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30 border-slate-700/50 hover:border-red-800/50"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Meeting
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ResponsiveDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Meeting"
        description="Update your meeting information and schedule."
      >
        <MeetingForm
          defaultValues={{
            name: meeting.name,
            agentId: meeting.agentId,
            scheduledStartTime: meeting.scheduledStartTime ? new Date(meeting.scheduledStartTime) : undefined,
          }}
          onSubmit={handleUpdateMeeting}
          submitText="Update Meeting"
          isLoading={updateMeetingMutation.isPending}
        />
      </ResponsiveDialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meeting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{meeting.name}"? This action cannot be undone.
              All associated data including recordings and transcripts will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMeetingMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMeeting}
              disabled={deleteMeetingMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMeetingMutation.isPending ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Deleting...
                </div>
              ) : (
                "Delete Meeting"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {meeting.transcriptUrl && (
        <TranscriptModal
          isOpen={isTranscriptModalOpen}
          onClose={() => setIsTranscriptModalOpen(false)}
          transcriptUrl={meeting.transcriptUrl}
        />
      )}
    </div>
  );
};