import StatsStrip from "./components/StatsStrip/StatsStrip";
import GoalStreak from "./components/GoalStreak/GoalStreak";

export default function MyCodeLandPage() {
    return (
        <div className="space-y-6">
            <StatsStrip />
            <GoalStreak />
        </div>
    );
}
