using System.Text.RegularExpressions;
using MongoDB.Driver;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Courses.Repositories;
using Shop.Domain.Entities;
using Shop.Infrastructure.Data;
using Shop.Infrastructure.Helpers;

namespace Shop.Infrastructure.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly IMongoCollection<Course> _courses;
        private readonly IMongoCollection<Category> _categories;
        private readonly IMongoCollection<InstructorProfile> _instructorProfiles;

        public CourseRepository(MongoDbContext context)
        {
            _courses = context.GetCollection<Course>("courses");
            _categories = context.GetCollection<Category>("categories");
            _instructorProfiles = context.GetCollection<InstructorProfile>("instructorProfiles");


            var indexKeys = Builders<Course>.IndexKeys.Ascending(c => c.Slug);

            var indexOptions = new CreateIndexOptions
            {
                Unique = true
            };

            var indexModel = new CreateIndexModel<Course>(
                indexKeys,
                indexOptions
            );

            _courses.Indexes.CreateOne(indexModel);
        }

        public async Task<bool> CategoryExistsAsync(string categoryId)
        {
            if (!MongoDB.Bson.ObjectId.TryParse(categoryId, out _))
                return false;

            return await _categories
                .Find(c => c.Id == categoryId)
                .AnyAsync();
        }

        public async Task<bool> CoursesExistAsync(List<string> courseIds)
        {
            if (courseIds == null || courseIds.Count == 0)
                return true;

            foreach (var id in courseIds)
            {
                if (!MongoDB.Bson.ObjectId.TryParse(id, out _))
                    return false;
            }

            var count = await _courses
                .CountDocumentsAsync(c => courseIds.Contains(c.Id));

            return count == courseIds.Distinct().Count();

        }

        public async Task<Course> CreateAsync(Course course)
        {
            try
            {
                await _courses.InsertOneAsync(course);
                var category = await _categories.Find(c => c.Id == course.CategoryId).FirstOrDefaultAsync();
                if (category != null)
                    course.Category = category;
                return course;
            }
            catch (MongoWriteException ex)
            when (ex.WriteError?.Code == 11000)
            {
                throw new ConflictException("A course with this slug already exists.");
            }
        }

        public async Task<bool> DeleteAsync(string Id)
        {
            ObjectIdValidator.Validate(Id);

            var result = await _courses.DeleteOneAsync(
                c => c.Id == Id
            );

            return result.DeletedCount > 0;
        }

        public async Task<(List<Course> Items, long TotalItems)> GetAllAsync(int page, int pageSize, string? search, string? categoryId, decimal? minPrice, decimal? maxPrice, string? sortBy, string? sortOrder)
        {
            var filters = new List<FilterDefinition<Course>>();

            if (!string.IsNullOrWhiteSpace(search))
            {
                filters.Add(
                    Builders<Course>.Filter.Regex(
                        c => c.Title,
                        new MongoDB.Bson.BsonRegularExpression(
                            Regex.Escape(search),
                            "i"
                        )
                    )
                );
            }

            if (!string.IsNullOrWhiteSpace(categoryId))
            {
                filters.Add(
                    Builders<Course>.Filter.Eq(
                        c => c.CategoryId,
                        categoryId
                    )
                );
            }

            if (minPrice.HasValue)
            {
                filters.Add(
                    Builders<Course>.Filter.Gte(
                        c => c.Price,
                        minPrice.Value
                    )
                );
            }

            if (maxPrice.HasValue)
            {
                filters.Add(
                    Builders<Course>.Filter.Lte(
                        c => c.Price,
                        maxPrice.Value
                    )
                );
            }

            var filter = filters.Count > 0
                ? Builders<Course>.Filter.And(filters)
                : Builders<Course>.Filter.Empty;

            SortDefinition<Course>? sort = null;

            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                if (sortBy.Equals("title", StringComparison.OrdinalIgnoreCase))
                {
                    sort = sortOrder?.Equals(
                        "desc",
                        StringComparison.OrdinalIgnoreCase
                    ) == true
                        ? Builders<Course>.Sort.Descending(c => c.Title)
                        : Builders<Course>.Sort.Ascending(c => c.Title);
                }
                else if (sortBy.Equals("price", StringComparison.OrdinalIgnoreCase))
                {
                    sort = sortOrder?.Equals(
                        "desc",
                        StringComparison.OrdinalIgnoreCase
                    ) == true
                        ? Builders<Course>.Sort.Descending(c => c.Price)
                        : Builders<Course>.Sort.Ascending(c => c.Price);
                }
                else if (sortBy.Equals("duration", StringComparison.OrdinalIgnoreCase))
                {
                    sort = sortOrder?.Equals(
                        "desc",
                        StringComparison.OrdinalIgnoreCase
                    ) == true
                        ? Builders<Course>.Sort.Descending(c => c.DurationMinutes)
                        : Builders<Course>.Sort.Ascending(c => c.DurationMinutes);
                }
                else if (sortBy.Equals("createdAt", StringComparison.OrdinalIgnoreCase))
                {
                    sort = sortOrder?.Equals(
                        "desc",
                        StringComparison.OrdinalIgnoreCase
                    ) == true
                        ? Builders<Course>.Sort.Descending(c => c.CreatedAt)
                        : Builders<Course>.Sort.Ascending(c => c.CreatedAt);
                }


                else if (sortBy.Equals("newest", StringComparison.OrdinalIgnoreCase))
                {
                    sort = Builders<Course>.Sort.Descending(
                        c => c.CreatedAt
                    );
                }
                else if (sortBy.Equals("updated", StringComparison.OrdinalIgnoreCase))
                {
                    sort = Builders<Course>.Sort.Descending(
                        c => c.UpdatedAt
                    );
                }
                else if (sortBy.Equals("popular", StringComparison.OrdinalIgnoreCase))
                {
                    sort = Builders<Course>.Sort.Descending(
                        c => c.EnrollmentCount
                    );
                }
            }

            var totalItems = await _courses
                .CountDocumentsAsync(filter);

            var query = _courses.Find(filter);

            if (sort != null)
            {
                query = query.Sort(sort);
            }

            var courses = await query
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            var categoryIds = courses
                .Select(c => c.CategoryId)
                .Where(id => !string.IsNullOrWhiteSpace(id))
                .Distinct()
                .ToList();

            var categories = await _categories
                .Find(c => categoryIds.Contains(c.Id))
                .ToListAsync();

            var categoryDictionary = categories
                .ToDictionary(c => c.Id);

            foreach (var course in courses)
            {
                if (course.CategoryId != null &&
                    categoryDictionary.TryGetValue(
                        course.CategoryId,
                        out var category))
                {
                    course.Category = category;
                }
            }

            return (courses, totalItems);
        }

        public async Task<Course?> GetByIdAsync(string Id)
        {
            ObjectIdValidator.Validate(Id);

            var course = await _courses
                .Find(c => c.Id == Id)
                .FirstOrDefaultAsync();

            if (course == null)
                return null;

            var category = await _categories
                .Find(c => c.Id == course.CategoryId)
                .FirstOrDefaultAsync();

            if (category != null)
                course.Category = category;

            return course;
        }

        public async Task<List<Course>> GetByIdsAsync(List<string> courseIds)
        {
            if (courseIds == null || courseIds.Count == 0)
                return new List<Course>();

            return await _courses.Find(c => courseIds.Contains(c.Id)).ToListAsync();
        }

        public async Task<Course?> GetBySlugAsync(string slug)
        {
            var courses = await _courses.Find(c => c.Slug == slug).FirstOrDefaultAsync();
            if (courses == null)
                return null;

            if (!string.IsNullOrWhiteSpace(courses.CategoryId))
            {
                courses.Category = await _categories.Find(c => c.Id == courses.CategoryId).FirstOrDefaultAsync();
            }
            if (!string.IsNullOrWhiteSpace(courses.InstructorId))
            {
                courses.Instructor = await _instructorProfiles.Find(i => i.UserId == courses.InstructorId).FirstOrDefaultAsync();
            }
            return courses;
        }

        public async Task<List<Course>> GetPrerequisiteCoursesAsync(List<string> courseIds)
        {
            if (courseIds == null || courseIds.Count == 0)
                return new List<Course>();

            var courses = await _courses
                .Find(c => courseIds.Contains(c.Id))
                .ToListAsync();

            return courses;
        }

        public async Task<Course?> UpdateAsync(string Id, Course course)
        {
            ObjectIdValidator.Validate(Id);

            var existingCourse = await _courses
                .Find(c => c.Id == Id)
                .FirstOrDefaultAsync();

            if (existingCourse == null)
                return null;

            course.Id = Id;

            course.CreatedAt = existingCourse.CreatedAt;

            course.EnrollmentCount = existingCourse.EnrollmentCount;

            course.UpdatedAt = DateTime.UtcNow;



            var result = await _courses.ReplaceOneAsync(
                c => c.Id == Id,
                course
            );

            if (result.MatchedCount == 0)
                return null;

            var category = await _categories
                .Find(c => c.Id == course.CategoryId)
                .FirstOrDefaultAsync();

            if (category != null)
                course.Category = category;

            return course;
        }
    }
}
