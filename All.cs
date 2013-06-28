// 2013-06-25 12:38:11

using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using System.Text;
using System.Threading;
using System;


// .\cs-competition-scaffold.cs

// :: csc %* /nologo /debug+ /warnaserror+
// :: mdbg
// :: slimtune
// :: brain
// :: ahk

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





























































// !!! DON'T FORGET TO SET THE PROBLEM NUMBER !!!
// .\cscat.cs

// todo: 
// #define directives


class Program
{
    [STAThread]
    static void Main(string[] args) 
    {
        /* shell version:
        @echo off
        del 1.txt
        del All.cs
        cat *.cs | grep "using [^(]*;" > 1.txt
        cat *.cs | grep -v "using [^(]*;" >> 1.txt
        ren 1.txt All.cs
        may mess up encodings
        * */
        
        File.Delete("All.cs");
        
        var usingDirectives = new SortedSet<string>();
        
        var usingRx = new Regex("^using [^(]*;");
        
        foreach (var file in Directory.GetFiles(".", "*.cs"))
        {
            foreach (var line in File.ReadLines(file))
            {
                var line2 = line.Trim();
                
                if (usingRx.IsMatch(line2))
                {
                    usingDirectives.Add(line2);
                }
            }
        }
        
        using (var writer = new StreamWriter("All.cs"))
        {
            writer.WriteLine("// " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            writer.WriteLine();
            
            foreach (var usingDirective in usingDirectives)
                writer.WriteLine(usingDirective);
                
            writer.WriteLine();
            
            foreach (var file in Directory.GetFiles(".", "*.cs"))
            {
                if (file.EndsWith("All.cs"))
                    continue;
                    
                writer.WriteLine();
                writer.WriteLine("// " + file);
                writer.WriteLine();
                
                foreach (var line in File.ReadLines(file))
                {
                    if (usingRx.IsMatch(line.Trim()))
                        continue;
                    writer.WriteLine(line);
                }
                
                writer.Write("// !!! DON'T FORGET TO SET THE PROBLEM NUMBER !!!");
            }
        }
        
        System.Windows.Forms.Clipboard.SetText(File.ReadAllText("All.cs"));
    }
}










// !!! DON'T FORGET TO SET THE PROBLEM NUMBER !!!
// .\ShootingEngine.cs


namespace AcademyPopcorn
{
    /* problem 13 */
    public class ShootingEngine : Engine
    {

        ShootingRacket racket;

        public override void AddObject(GameObject obj) {
            var as_racket = obj as ShootingRacket;
            if (as_racket != null) {
                racket = as_racket;
            }
            base.AddObject(obj);
        }
        
        public ShootingEngine(IRenderer renderer, IUserInterface userInterface)
            : base(renderer, userInterface) {
        }

        public ShootingEngine(IRenderer renderer, IUserInterface userInterface, int sleep_time)
            : base(renderer, userInterface, sleep_time) {
        }

        public void ShootPlayerRacket() {
            var local = racket;
            if (local != null && local.CanShoot) {
                local.Shoot();
            }
        }


    }
}
// !!! DON'T FORGET TO SET THE PROBLEM NUMBER !!!