using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Milestone01
{
    public static class StringExt
    {
        public static string Capitalize(this string str)
        {
            if (str == null || str.Length == 0) return str;
            return $"{char.ToUpper(str[0])}{str.Substring(1)}";
        }
    }
}
