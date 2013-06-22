using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

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










