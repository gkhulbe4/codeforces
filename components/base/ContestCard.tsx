"use client";

import { useRouter } from "next/navigation";
import { Calendar, Clock, ListOrdered, Users } from "lucide-react";
import { formatDuration } from "@/lib/utils/formatDuration";
import { Contest } from "@/app/contests/page";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { formatDate } from "@/lib/utils/formatDate";

function ContestCard({ contest }: { contest: Contest }) {
  const session = useSession();
  const router = useRouter();

  const { data: isRegistered } = useQuery({
    queryKey: ["contest", contest.id, "registration"],
    queryFn: async () => {
      const res = await axios.get(
        `/api/contests/${contest.id}/checkRegistration?userId=${session.data?.user?.id}`,
      );
      return res.data.isRegistered;
    },
    enabled: !!session.data?.user?.id,
  });

  return (
    <div
      key={contest.id}
      onClick={() => router.push(`/contests/${contest.id}`)}
      className="group bg-card hover:bg-second  ary/5 border border-border/50 rounded-2xl p-6 transition-all cursor-pointer hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.99]"
    >
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              {contest.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed max-w-3xl">
              {contest.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(contest.startTime)}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(Number(contest.durationInMinutes))}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 text-xs font-medium">
              <ListOrdered className="w-3.5 h-3.5" />
              {contest._count.contestProblems} Problems
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 text-xs font-medium">
              <Users className="w-3.5 h-3.5" />
              {contest._count.contestParticipants} Participants
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-end min-w-[140px]">
          {isRegistered ? (
            <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium text-sm w-full text-center group-hover:bg-primary group-hover:text-white transition-colors">
              Start Contest
            </div>
          ) : (
            <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium text-sm w-full text-center group-hover:bg-primary group-hover:text-white transition-colors">
              Register
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContestCard;
