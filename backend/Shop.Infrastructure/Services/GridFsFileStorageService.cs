using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using Shop.Application.Interfaces.File;
using Shop.Infrastructure.Data;

namespace Shop.Infrastructure.Services
{
    public class GridFsFileStorageService : IFileStorageService
    {

        private readonly GridFSBucket _bucket;

        public GridFsFileStorageService(MongoDbContext context)
        {
            _bucket = new GridFSBucket(context.DataBase);
        }
        public async Task DeleteAsync(string fileId)
        {
            if (!ObjectId.TryParse(fileId, out var objectId))
                return;

            await _bucket.DeleteAsync(objectId);
        }

        public async Task<(Stream Stream, string ContentType, string FileName)> GetFileAsync(string fileId)
        {
            if (!ObjectId.TryParse(fileId, out var objectId))
                throw new Exception("Invalid file id.");

            var fileInfo = await _bucket.Find(
                Builders<GridFSFileInfo>.Filter.Eq(x => x.Id, objectId)
            ).FirstOrDefaultAsync();

            Console.WriteLine($"REQUESTED FILE ID: {fileId}");
            Console.WriteLine($"FILE EXISTS: {fileInfo != null}");

            if (fileInfo == null)
                throw new FileNotFoundException("File not found.");

            var stream = await _bucket.OpenDownloadStreamAsync(
                objectId,
                new GridFSDownloadOptions
                {
                    Seekable = true
                }
            );

            var contentType = fileInfo.Metadata?.GetValue(
                "contentType",
                "application/octet-stream"
            ).AsString ?? "application/octet-stream";

            var fileName = fileInfo.Metadata?.GetValue(
                "fileName",
                fileInfo.Filename
            ).AsString ?? fileInfo.Filename;

            return (stream, contentType, fileName);
        }
        public async Task<string> UploadFileAsync(IFormFile file)
        {
            await using var stream = file.OpenReadStream();

            var options = new GridFSUploadOptions
            {
                Metadata = new BsonDocument
            {
                { "contentType", file.ContentType },
                { "fileName", file.FileName }
            }
            };

            var fileId = await _bucket.UploadFromStreamAsync(
                file.FileName,
                stream,
                options
            );

            return fileId.ToString();
        }
    }
}
