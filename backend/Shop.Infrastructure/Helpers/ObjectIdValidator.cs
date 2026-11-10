using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using Shop.Application.Exceptions;

namespace Shop.Infrastructure.Helpers
{
    public static class ObjectIdValidator
    {
        public static void Validate(string Id)
        {
            if (!ObjectId.TryParse(Id, out _))
                throw new InvalidObjectIdException("Invalid ObjectId.");
        }

    }
}
