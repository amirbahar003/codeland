using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Shop.Application.Helpers
{
    public static class SlugHelper
    {
        public static string Slugify(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return string.Empty;

            var slug = value
                .Trim()
                .ToLowerInvariant();

            slug = Regex.Replace(slug, @"[^a-z0-9]+", "-");

            slug = slug.Trim('-');

            return slug;
        }
    }
}
