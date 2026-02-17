"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  ListOrdered,
  Users,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { formatDuration } from "@/lib/utils/formatDuration";
import { Contest } from "@/app/contests/page";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { formatDate } from "@/lib/utils/formatDate";
import { Button } from "@/components/ui/button";

function ContestCard({ contest }: { contest: Contest }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: registrationStatus } = useQuery({
    queryKey: ["contest", contest.id, "registration"],
    queryFn: async () => {
      const res = await axios.get(
        `/api/contests/${contest.id}/checkRegistration?email=${session?.user?.email}`,
      );
      return res.data;
    },
    enabled: !!session?.user?.email,
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `/api/contests/${contest.id}/register?email=${session?.user?.email}`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contest", contest.id, "registration"],
      });
      queryClient.invalidateQueries({ queryKey: ["contests"] });
    },
  });

  return (
    <div
      key={contest.id}
      className="group bg-card hover:bg-secondary/20 border border-border/60 rounded-xl p-6 transition-all duration-200 cursor-pointer hover:border-border hover:shadow-sm"
    >
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight mb-2">
              {contest.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed max-w-3xl">
              {contest.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary/70" />
              <span className="font-medium text-xs uppercase tracking-wide opacity-80">
                {formatDate(contest.startTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary/70" />
              <span className="font-medium text-xs uppercase tracking-wide opacity-80">
                {formatDuration(Number(contest.durationInMinutes))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-primary/70" />
              <span className="font-medium text-xs uppercase tracking-wide opacity-80">
                {contest._count.contestProblems} Problems
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary/70" />
              <span className="font-medium text-xs uppercase tracking-wide opacity-80">
                {contest._count.contestParticipants} Participants
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-end min-w-[140px]">
          {registrationStatus?.isRegistered ? (
            <div
              onClick={() => router.push(`/contests/${contest.id}`)}
              className="px-5 py-2.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg font-medium text-sm w-full text-center transition-colors"
            >
              Enter Contest
            </div>
          ) : (
            session?.user && (
              <Button
                onClick={() => registerMutation.mutate()}
                disabled={
                  registrationStatus?.isRegistered || registerMutation.isPending
                }
                className="px-6 py-2 rounded-md font-medium flex items-center gap-2"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : registrationStatus?.isRegistered ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Registered
                  </>
                ) : (
                  <>Register</>
                )}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ContestCard;
