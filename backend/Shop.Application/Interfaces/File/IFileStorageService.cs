using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Shop.Application.Interfaces.File
{
    public interface IFileStorageService
    {
        Task<(Stream Stream, string ContentType, string FileName)> GetFileAsync(string fileId);
        Task<string> UploadFileAsync(IFormFile file);
        Task DeleteAsync(string fileId);
    }
}
