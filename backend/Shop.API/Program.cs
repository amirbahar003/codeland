using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.IdentityModel.Tokens;

using Serilog;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Authentication;
using Shop.Application.Interfaces.Carts.Repository;
using Shop.Application.Interfaces.Carts.Service;
using Shop.Application.Interfaces.Categories.Repositories;
using Shop.Application.Interfaces.Categories.Services;
using Shop.Application.Interfaces.Chapters.Repositories;
using Shop.Application.Interfaces.Chapters.Services;
using Shop.Application.Interfaces.Comments.Repository;
using Shop.Application.Interfaces.Comments.Service;
using Shop.Application.Interfaces.Courses.Repositories;
using Shop.Application.Interfaces.Courses.Services;
using Shop.Application.Interfaces.Curriculum;
using Shop.Application.Interfaces.Discounts.Repository;
using Shop.Application.Interfaces.Discounts.Service;
using Shop.Application.Interfaces.Enrollments.Repositories;
using Shop.Application.Interfaces.Enrollments.Services;
using Shop.Application.Interfaces.File;
using Shop.Application.Interfaces.Instructors;
using Shop.Application.Interfaces.Instructors.Services;
using Shop.Application.Interfaces.LearningStates.Repository;
using Shop.Application.Interfaces.LearningStates.Service;
using Shop.Application.Interfaces.LessonProgreses.Services;
using Shop.Application.Interfaces.Lessons.Repositories;
using Shop.Application.Interfaces.Lessons.Services;
using Shop.Application.Interfaces.Payments.GateWay;
using Shop.Application.Interfaces.Payments.Repository;
using Shop.Application.Interfaces.Payments.Service;
using Shop.Application.Interfaces.Referral.Services;
using Shop.Application.Interfaces.Transactions;
using Shop.Application.Interfaces.Users.Repositories;
using Shop.Application.Interfaces.Users.Services;
using Shop.Application.Interfaces.Wallets.Repository;
using Shop.Application.Interfaces.Wallets.Service;
using Shop.Application.Services.Authentication;
using Shop.Application.Services.Carts;
using Shop.Application.Services.Categories;
using Shop.Application.Services.Chapters;
using Shop.Application.Services.Comments;
using Shop.Application.Services.Courses;
using Shop.Application.Services.Curriculum;
using Shop.Application.Services.Discounts;
using Shop.Application.Services.Enrollments;
using Shop.Application.Services.Instructor;
using Shop.Application.Services.LearningStates;
using Shop.Application.Services.LessonProgresses;
using Shop.Application.Services.Lessons;
using Shop.Application.Services.Payments;
using Shop.Application.Services.Referrals;
using Shop.Application.Services.Users;
using Shop.Application.Services.Wallets;
using Shop.Infrastructure.Data;
using Shop.Infrastructure.Payments;
using Shop.Infrastructure.Repositories;
using Shop.Infrastructure.Services;
using Shop.Infrastructure.Services.Transactions;

var builder = WebApplication.CreateBuilder(args);

// ==================================================
// Serilog
// ==================================================

builder.Host.UseSerilog((context, services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.File(
            "Logs/app-.log",
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 7
        );
});

// ==================================================
// Basic Services
// ==================================================

builder.Services.AddOpenApi();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(
        "Bearer",
        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = Microsoft.OpenApi.Models.ParameterLocation.Header,
            Description = "Enter JWT token"
        });

    options.AddSecurityRequirement(
        new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
        {
            {
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Reference =
                        new Microsoft.OpenApi.Models.OpenApiReference
                        {
                            Type =
                                Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                },
                Array.Empty<string>()
            }
        });
});
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("NextJsPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.Services.Configure<FormOptions>(options => { options.MultipartBodyLengthLimit = 500 * 1024 * 1024; });

// ==================================================
// Problem Details
// ==================================================


builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = context =>
    {
        var exception = context.HttpContext.Features
            .Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?
            .Error;

        if (exception is UnauthorizedAccessException)
        {
            context.ProblemDetails.Title = "Unauthorized";
            context.ProblemDetails.Detail = exception.Message;
        }
        else if (exception is ForbiddenException)
        {
            context.ProblemDetails.Title = "Forbidden";
            context.ProblemDetails.Detail = exception.Message;
        }
        else if (exception is NotFoundException)
        {
            context.ProblemDetails.Title = "Not Found";
            context.ProblemDetails.Detail = exception.Message;
        }
        else if (exception is ConflictException)
        {
            context.ProblemDetails.Title = "Conflict";
            context.ProblemDetails.Detail = exception.Message;
        }
        else if (exception is InvalidObjectIdException)
        {
            context.ProblemDetails.Title = "Bad Request";
            context.ProblemDetails.Detail = exception.Message;
        }
        else if (exception is ArgumentException)
        {
            context.ProblemDetails.Title = "Bad Request";
            context.ProblemDetails.Detail = exception.Message;
        }
    };
});



// ==================================================
// MongoDB
// ==================================================

builder.Services.AddSingleton<MongoDbContext>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();

    var settings = configuration
        .GetSection("MongoDbSettings")
        .Get<MongoDbSettings>()!;

    return new MongoDbContext(settings);
});

// ==================================================
// JWT Settings
// ==================================================

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings")
);

var jwtSettings = builder.Configuration
    .GetSection("JwtSettings")
    .Get<JwtSettings>()!;

// ==================================================
// JWT Authentication
// ==================================================



builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtSettings.Issuer,

                ValidateAudience = true,
                ValidAudience = jwtSettings.Audience,

                ValidateLifetime = true,

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        jwtSettings.SecretKey
                    )
                ),

                ClockSkew = TimeSpan.Zero
            };

        options.Events = new JwtBearerEvents
        {
            // ?????? JWT ?? Cookie
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["accessToken"];

                return Task.CompletedTask;
            },

            // ????? ????? ??? ?? ?????????? JWT
            OnTokenValidated = async context =>
            {
                var userId = context.Principal?
                    .FindFirstValue(
                        ClaimTypes.NameIdentifier
                    );

                if (userId == null)
                {
                    context.Fail("User ID is missing.");
                    return;
                }

                var userRepository = context.HttpContext
                    .RequestServices
                    .GetRequiredService<IUserRepository>();

                var user = await userRepository
                    .GetByIdAsync(userId);

                if (user == null)
                {
                    context.Fail("User does not exist.");
                    return;
                }

                if (!user.IsActive)
                {
                    context.Fail("User account is inactive.");
                }
            }
        };
    });

builder.Services.AddAuthorization();


// ==================================================
// Repositories
// ==================================================

builder.Services.AddScoped<ICourseRepository, CourseRepository>();

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IChapterRepository, ChapterRepository>();

builder.Services.AddScoped<ILessonRepository, LessonRepository>();

builder.Services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();

builder.Services.AddScoped<ILessonProgressRepository, LessonProgressRepository>();

builder.Services.AddScoped<IInstructorRepository, InstructorRepository>();

builder.Services.AddScoped<IDiscountRepository, DiscountRepository>();

builder.Services.AddScoped<ICommentRepository, CommentRepository>();

builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();

builder.Services.AddScoped<ICartRepository, CartRepository>();

builder.Services.AddScoped<IWalletRepository, WalletRepository>();

builder.Services.AddScoped<IWalletTransactionRepository, WalletTransactionRepository>();

builder.Services.AddScoped<IWalletTopUpRepository, WalletTopUpRepository>();

builder.Services.AddScoped<ICourseRepository, CourseRepository>();

builder.Services.AddScoped<ILearningStatsRepository, LearningStatsRepository>();



// ==================================================
// Services
// ==================================================

builder.Services.AddScoped<ICourseService, CourseService>();

builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddScoped<IFileStorageService, GridFsFileStorageService>();

builder.Services.AddScoped<IPasswordHasher, PasswordHasherService>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

builder.Services.AddScoped<IChapterService, ChapterService>();

builder.Services.AddScoped<ILessonService, LessonService>();

builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IEnrollmentService, EnrollmentService>();

builder.Services.AddScoped<ILessonProgressService, LessonProgressService>();

builder.Services.AddScoped<IInstructorService, InstructorService>();

builder.Services.AddScoped<ICurriculumService, CurriculumService>();

builder.Services.AddScoped<ICartService, CartService>();


builder.Services.Configure<ZarinPalOptions>(
    builder.Configuration.GetSection("ZarinPal")
);



builder.Services.AddScoped<IPaymentService, PaymentService>();

builder.Services.AddScoped<ICommentService, CommentService>();

builder.Services.AddScoped<IPaymentGateWay, FakePaymentGateway>();

builder.Services.AddScoped<IDiscountService, DiscountService>();

builder.Services.AddScoped<IWalletService, WalletService>();

builder.Services.AddScoped<IWalletTopUpService, WalletTopUpService>();

builder.Services.AddScoped<IMongoTransactionService,MongoTransactionService>();

builder.Services.AddScoped<ICourseService, CourseService>();

builder.Services.AddScoped<ILearningStatsService, LearningStatsService>();

builder.Services.AddScoped<IReferralService, ReferralService>();
// ==================================================
// Build Application
// ==================================================



var app = builder.Build();

var mongoDbContext = app.Services.GetRequiredService<MongoDbContext>();

await mongoDbContext.PingAsync();
// ==================================================
// Serilog Request Logging
// ==================================================

app.UseSerilogRequestLogging();

// ==================================================
// MongoDB Indexes
// ==================================================

var dbContext = app.Services
    .GetRequiredService<MongoDbContext>();

await dbContext.EnsureIndexesAsync();


// ==================================================
// Global Exception Handler
// ==================================================


app.UseExceptionHandler(new ExceptionHandlerOptions
{
    StatusCodeSelector = ex =>
        ex is UnauthorizedAccessException
            ? StatusCodes.Status401Unauthorized

        : ex is ForbiddenException
            ? StatusCodes.Status403Forbidden

        : ex is NotFoundException
            ? StatusCodes.Status404NotFound

        : ex is ConflictException
            ? StatusCodes.Status409Conflict

        : ex is InvalidObjectIdException
            ? StatusCodes.Status400BadRequest

        : ex is ArgumentException
            ? StatusCodes.Status400BadRequest

        : StatusCodes.Status500InternalServerError
});



// ==================================================
// OpenAPI
// ==================================================

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// ==================================================
// HTTP Pipeline
// ==================================================

app.UseHttpsRedirection();

app.UseCors("NextJsPolicy");

app.UseAuthentication();

app.UseAuthorization();

// ==================================================
// Swagger
// ==================================================

app.UseSwagger();

app.UseSwaggerUI();

// ==================================================
// Controllers
// ==================================================

app.MapControllers();

app.Run();

