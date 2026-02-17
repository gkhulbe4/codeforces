import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Trophy, Medal, Clock, Loader2 } from "lucide-react";

interface Standing {
  rank: number;
  userId: string;
  userName: string;
  problemsSolved: number;
  totalTimeMs: number;
}

function formatTime(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function StandingsTab({ id }: { id: string }) {
  const { data: standings, isLoading } = useQuery<Standing[]>({
    queryKey: ["contest-standings", id],
    queryFn: async () => {
      const res = await axios.get(`/api/contests/${id}/getStandings`);
      return res.data;
    },
    refetchInterval: 5000, // Poll every 5 seconds
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!standings || standings.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border/50 rounded-xl bg-card/20 animate-fade-in">
        <Trophy className="w-16 h-16 mb-4 opacity-20" />
        <h3 className="font-display text-xl font-medium text-foreground mb-2">
          Standings
        </h3>
        <p className="max-w-sm text-center text-sm">
          The leaderboard will be available once participants start submitting
          solutions.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Solved
                </th>
                {/* <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Time
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {standings.map((standing) => (
                <tr
                  key={standing.userId}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {standing.rank === 1 && (
                        <Medal className="w-5 h-5 text-yellow-500" />
                      )}
                      {standing.rank === 2 && (
                        <Medal className="w-5 h-5 text-gray-400" />
                      )}
                      {standing.rank === 3 && (
                        <Medal className="w-5 h-5 text-amber-600" />
                      )}
                      <span className="font-display text-lg font-semibold text-foreground">
                        {standing.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">
                      {standing.userName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-semibold border border-green-500/20">
                      {/* <Trophy className="w-4 h-4" /> */}
                      {standing.problemsSolved}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4" />
                      {formatTime(standing.totalTimeMs)}
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
