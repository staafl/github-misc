// :: csc %* /nologo /debug+ /warnaserror+
// :: mdbg
// :: slimtune
// :: brain
// :: ahk
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using System.Text;
using System.Threading;

class Program
{
#if TEST
    const string file = @"tests\test.00{0}.in.txt"
    const string test = @"
";
#endif
    static void Main(string[] args) {
        var reader = Console.In;

#if TEST
#warning TEST BUILD

        reader = new StringReader(test);
        reader.ReadLine();
        // reader = new StreamReader(string.Format(file, 4));
        
#endif


        var read_int = () => int.Parse(reader.ReadLine());
        
        var cnt = read_int();
        
        for(var ii = 0; ii < cnt; ++ii) {
            var str = reader.ReadLine();
        }
        
        
        
        
        
        
        
        
        
        
        
    }
}





























































