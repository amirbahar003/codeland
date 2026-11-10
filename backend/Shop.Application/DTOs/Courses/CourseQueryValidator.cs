using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Application.DTOs.Courses
{
    public class CourseQueryValidator
    {
        public static IEnumerable<ValidationResult> Validate(
      CourseQueryDto query)
        {
            if (query.MinPrice.HasValue &&
                query.MaxPrice.HasValue &&
                query.MinPrice > query.MaxPrice)
            {
                yield return new ValidationResult(
                    "MinPrice cannot be greater than MaxPrice.",
                    new[]
                    {
                    nameof(CourseQueryDto.MinPrice),
                    nameof(CourseQueryDto.MaxPrice)
                    }
                );
            }

            if (!string.IsNullOrWhiteSpace(query.SortBy) &&
             !query.SortBy.Equals(
                 "title",
                 StringComparison.OrdinalIgnoreCase) &&
             !query.SortBy.Equals(
                 "price",
                 StringComparison.OrdinalIgnoreCase) &&
             !query.SortBy.Equals(
                 "duration",
                 StringComparison.OrdinalIgnoreCase) &&
             !query.SortBy.Equals(
                 "createdAt",
                 StringComparison.OrdinalIgnoreCase) &&
             !query.SortBy.Equals(
                 "newest",
                 StringComparison.OrdinalIgnoreCase) &&
             !query.SortBy.Equals(
                 "updated",
                 StringComparison.OrdinalIgnoreCase) &&
             !query.SortBy.Equals(
                 "popular",
                 StringComparison.OrdinalIgnoreCase))
            {
                yield return new ValidationResult(
                    "SortBy must be title, price, duration, createdAt, newest, updated or popular.",
                    new[]
                    {
            nameof(CourseQueryDto.SortBy)
                    }
                );
            }

            if (!string.IsNullOrWhiteSpace(query.SortOrder) &&
                !query.SortOrder.Equals(
                    "asc",
                    StringComparison.OrdinalIgnoreCase) &&
                !query.SortOrder.Equals(
                    "desc",
                    StringComparison.OrdinalIgnoreCase))
            {
                yield return new ValidationResult(
                    "SortOrder must be asc or desc.",
                    new[]
                    {
                    nameof(CourseQueryDto.SortOrder)
                    }
                );
            }
        }
    }
}
