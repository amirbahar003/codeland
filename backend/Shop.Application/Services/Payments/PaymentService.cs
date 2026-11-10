using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shop.Application.DTOs.Payments;
using Shop.Application.DTOs.Wallets;
using Shop.Application.Exceptions;
using Shop.Application.Interfaces.Courses.Repositories;
using Shop.Application.Interfaces.Enrollments.Services;
using Shop.Application.Interfaces.Payments.GateWay;
using Shop.Application.Interfaces.Payments.Repository;
using Shop.Application.Interfaces.Payments.Service;
using Shop.Application.Mappers;
using Shop.Domain.Entities;
using Shop.Domain.Enums;
namespace Shop.Application.Services.Payments
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _repository;
        private readonly ICourseRepository _courseRepository;
        private readonly IEnrollmentService _enrollmentService;
        private readonly IPaymentGateWay _paymentGateway;
        public PaymentService(IPaymentRepository repository, ICourseRepository courseRepository, IEnrollmentService enrollmentService, IPaymentGateWay paymentGateway)
        {
            _repository = repository;
            _courseRepository = courseRepository;
            _enrollmentService = enrollmentService;
            _paymentGateway = paymentGateway;
        }
        public async Task<PaymentDto> CreateAsync(string userId, CreatePaymentDto paymentDto)
        {
            var course = await _courseRepository.GetByIdAsync(paymentDto.CourseId);
            if (course == null)
                throw new NotFoundException("Course does not exist.");
            var hasAccess = await _enrollmentService.HasAccessAsync(userId, paymentDto.CourseId);
            if (hasAccess)
                throw new ConflictException("User is already enrolled in this course.");
            var payment = new Payment
            {
                UserId = userId,
                CourseId = course.Id,
                Amount = course.Price,
                Status = PaymentStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };
            var createdPayment = await _repository.CreateAsync(payment);
            var gatewayResult = await _paymentGateway.CreatePaymentAsync(createdPayment.Amount, createdPayment.Id, $"Purchase {course.Title}");
            createdPayment.Authority = gatewayResult.Authority;
            var updatedPayment = await _repository.UpdateAsync(createdPayment.Id, createdPayment);
            if (updatedPayment == null) throw new NotFoundException("Payment does not exist.");
            return PaymentMapper.ToDto(updatedPayment, gatewayResult.PaymentUrl);
        }



        public async Task<List<MyPaymentDto>> GetMyPaymentsAsync(string userId)
        {
            var payments = await _repository.GetByUserIdAsync(userId);

            var courseIds = payments
                .Select(p => p.CourseId)
                .Distinct()
                .ToList();

            var courses = await _courseRepository.GetByIdsAsync(courseIds);

            var courseDictionary = courses.ToDictionary(c => c.Id);

            var result = payments.Select(payment =>
            {
                courseDictionary.TryGetValue(payment.CourseId, out var course);

                return new MyPaymentDto
                {
                    Id = payment.Id,
                    CourseId = payment.CourseId,
                    CourseTitle = course?.Title ?? "دوره حذف شده",
                    Amount = payment.Amount,
                    Status = payment.Status.ToString(),
                    CreatedAt = payment.CreatedAt,
                    PaidAt = payment.PaidAt
                };
            }).ToList();

            return result;
        }



        public async Task<PaymentDto> VerifyAsync(VerifyPaymentDto paymentDto)
        {
            var payment = await _repository.GetByAuthorityAsync(paymentDto.Authority);
            if (payment == null)
                throw new NotFoundException("Payment does not exist.");
            if (payment.Status == PaymentStatus.Paid)
                return PaymentMapper.ToDto(payment);
            if (string.IsNullOrWhiteSpace(payment.Authority))
                throw new InvalidOperationException("Payment authority is missing.");
            var referenceId = await _paymentGateway.VerifyPaymentAsync(payment.Authority, payment.Amount);
            if (referenceId == null)
            {
                payment.Status = PaymentStatus.Failed;
                var failedPayment = await _repository.UpdateAsync(payment.Id, payment);
                if (failedPayment == null) throw new NotFoundException("Payment does not exist.");
                return PaymentMapper.ToDto(failedPayment);
            }
            payment.Status = PaymentStatus.Paid;
            payment.ReferenceId = referenceId; payment.PaidAt = DateTime.UtcNow;
            var paidPayment = await _repository.UpdateAsync(payment.Id, payment);
            if (paidPayment == null) throw new NotFoundException("Payment does not exist.");
            var hasAccess = await _enrollmentService.HasAccessAsync(payment.UserId, payment.CourseId);
            if (!hasAccess)
            {
                await _enrollmentService.EnrollAsync(payment.UserId, payment.CourseId);
            }
            return PaymentMapper.ToDto(paidPayment);
        }
    }
}
