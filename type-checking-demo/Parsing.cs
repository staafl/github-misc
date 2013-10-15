using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

partial class TypeChecker
{
    static bool IsAssignment(string statement)
    {
        return statement.Contains("=");
    }

    static bool IsMethodCall(string statement)
    {
        return Regex.IsMatch(statement, @"(?i)[a-z]+\.[a-z]+\(");
    }

    static bool IsDeclaration(string statement)
    {
        return !IsAssignment(statement) &&
            !IsMethodCall(statement);
    }

    static string GetNameOfAssignedVariable(string assignment)
    {
        var match = Regex.Match(assignment, @"^(?<variable>[^ ]+) \s =", RegexOptions.IgnorePatternWhitespace);
        if (match.Success)
            return match.Groups["variable"].Value;
        throw Error("Parse error: " + assignment);

    }

    static string GetTypeOfAssignmentExpression(string assignment)
    {
        var match = Regex.Match(assignment, @"^[^ ]+ \s* = \s* (?<expression>.*);", RegexOptions.IgnorePatternWhitespace);
        if (match.Success)
            return GetTypeOfExpression(match.Groups["expression"].Value);
        throw Error("Parse error: " + assignment);


    }

    static string GetNameOfDeclaredVaiable(string declaration)
    {
        var match = Regex.Match(declaration, @"(?i)^[^ ]+ \s+ (?<variable>[a-z]+)", RegexOptions.IgnorePatternWhitespace);
        if (match.Success)
            return match.Groups["variable"].Value;
        throw Error("Parse error: " + declaration);

    }

    static string GetTypeOfDeclaration(string declaration)
    {
        var match = Regex.Match(declaration, @"^(?<type>[^ ]+)\s*", RegexOptions.IgnorePatternWhitespace);
        if (match.Success)
            return match.Groups["type"].Value;
        throw Error("Parse error: " + declaration);

    }



    static void ParseMethodCall(string method_call, out string variable_name, out string method_name, out string[] arguments)
    {
        var match = Regex.Match(method_call, @"(?<variable>[^.]+) \. (?<method>[^()]+) \( (?<arguments>[^()]*)", RegexOptions.IgnorePatternWhitespace);

        if (!match.Success)
            Error("Parse error: " + method_call);

        variable_name = match.Groups["variable"].Value;
        method_name = match.Groups["method"].Value;
        arguments = match.Groups["arguments"].Value.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(a => a.Trim()).ToArray();
    }


    static string GetGenericArgument(string concrete_type)
    {
        var match = Regex.Match(concrete_type, "<([^>]+)>");

        if (!match.Success)
            throw Error("Parse error: " + concrete_type);

        // Stack<int> -> int    
        var generic_argument = match.Groups[1].Value;
        return generic_argument;
    }

}