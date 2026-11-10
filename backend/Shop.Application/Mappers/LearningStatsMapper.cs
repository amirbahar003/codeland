
using System;
using System.Linq;
using Shop.Application.DTOs.LearningStates;
using Shop.Domain.Entities;

namespace Shop.Application.Mappers
{
    public static class LearningStatsMapper
    {
        public static LearningStatsDto ToDto(LearningStats stats)
        {
            var now = DateTime.UtcNow;

            // شروع هفته: دوشنبه ساعت ۰۰:۰۰ به وقت UTC
            int daysSinceMonday =
                ((int)now.DayOfWeek + 6) % 7;

            var weekStart = now.Date.AddDays(-daysSinceMonday);
            var nextWeekStart = weekStart.AddDays(7);

            // فعالیت‌های ثبت‌شده در هفته جاری
            var completedMinutes = stats.Activities
                .Where(activity =>
                    activity.CompletedAtUtc >= weekStart &&
                    activity.CompletedAtUtc < nextWeekStart)
                .Sum(activity => activity.DurationMinutes);

            // محاسبه درصد پیشرفت هدف هفتگی
            double progressPercentage = stats.WeeklyGoalMinutes > 0
                ? (double)completedMinutes / stats.WeeklyGoalMinutes * 100
                : 0;

            // درصد بیشتر از ۱۰۰ نمایش داده نمی‌شود
            progressPercentage = Math.Min(100, progressPercentage);
            // تاریخ‌های فعالیت یادگیری را به روزهای یکتا تبدیل می‌کنیم
            var activeDates = stats.Activities
                .Select(activity => activity.CompletedAtUtc.Date)
                .Distinct()
                .OrderBy(date => date)
                .ToList();

            int bestStreak = 0;
            int currentRun = 0;
            DateTime? previousDate = null;

            foreach (var date in activeDates)
            {
                if (previousDate.HasValue &&
                    date == previousDate.Value.AddDays(1))
                {
                    currentRun++;
                }
                else
                {
                    currentRun = 1;
                }

                bestStreak = Math.Max(bestStreak, currentRun);
                previousDate = date;
            }

            int currentStreak = 0;

            if (activeDates.Count > 0)
            {
                var today = DateTime.UtcNow.Date;
                var yesterday = today.AddDays(-1);

                var lastActiveDate = activeDates[^1];

                if (lastActiveDate == today || lastActiveDate == yesterday)
                {
                    currentStreak = 1;

                    for (int i = activeDates.Count - 1; i > 0; i--)
                    {
                        if (activeDates[i] == activeDates[i - 1].AddDays(1))
                        {
                            currentStreak++;
                        }
                        else
                        {
                            break;
                        }
                    }
                }
            }

            return new LearningStatsDto
            {
                WeeklyGoalMinutes = stats.WeeklyGoalMinutes,
                CompletedMinutesThisWeek = completedMinutes,
                WeeklyProgressPercentage = Math.Round(progressPercentage, 2),

                // این دو مقدار را در مرحله بعد پیاده‌سازی می‌کنیم
                CurrentStreak = currentStreak,
                BestStreak = bestStreak,

                Activities = stats.Activities.Select(activity =>
                    new LearningActivityDto
                    {
                        LessonId = activity.LessonId,
                        DurationMinutes = activity.DurationMinutes,
                        CompletedAtUtc = activity.CompletedAtUtc
                    }).ToList()
            };
        }
    }
}
