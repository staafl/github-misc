using System;
using System.Collections.Generic;
using System.Linq;

partial class TypeChecker
{
    static TypeException Error(string format, params object[] args)
    {
        throw new TypeException(">> " + String.Format(format, args));
    }

    static void Say(string format, params object[] args)
    {
        Console.WriteLine(">> " + format, args);
    }

    public class TypeException : Exception
    {
        public TypeException(string message)
            : base(message)
        {
        }
    }



}