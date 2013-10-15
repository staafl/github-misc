using System;
using System.Collections.Generic;
using System.Linq;
using Table = System.Collections.Generic.Dictionary<string, string>;
using MultiTable = System.Collections.Generic.Dictionary<string, string[]>;

partial class TypeChecker
{
    static Table class_parents = new Table
    {
        {"void",            null},
        {"object",          null},
        {"int",             "object"},
        {"string",          "object"},
        {"Stack<T>",        "object"},
        {"SuperStack<T>",   "Stack<T>"},
        {"Type",            "object"},
        {"bool",            "object"},
    };

    static MultiTable class_methods = new MultiTable
    {
        {"object",  new[]{ "GetHashCode", "GetType", "Equals" } },
        {"string",  new[]{ "Replace", "Substring", "Contains" } },
        {"int",     new[]{ "CompareTo" } },
        {"Stack<T>",new[]{ "Push", "Pop", "get_Count" } },
    };

    static MultiTable method_signatures = new MultiTable
    {
        {"int.CompareTo",       new[]{ "int", "int" } },
        {"object.GetHashCode",  new[]{ "int" } },
        {"object.GetType",      new[]{ "Type" } },
        {"object.Equals",       new[]{ "bool", "object" } },
        {"Stack<T>.Push",       new[]{ "void", "T" } },
        {"Stack<T>.Pop",        new[]{ "T" } },
        {"Stack<T>.get_Count",  new[]{ "int" } },
    };

    static Table variable_types = new Table
    {
        // for example, {"x", "int"}
    };

}