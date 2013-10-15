using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

partial class TypeChecker
{
    static string GetTypeOfExpression(string expression)
    {
        var newExpressionMatch = Regex.Match(expression, @"^\s* new \s+ ( [^(]+ ) \s*", RegexOptions.IgnorePatternWhitespace);
        if (newExpressionMatch.Success)
            return newExpressionMatch.Groups[1].Value;
        if (variable_types.ContainsKey(expression))
            return variable_types[expression];
        return "int";
    }

    static string GetTypeOfVariable(string variable_name)
    {
        if (variable_types.ContainsKey(variable_name))
            return variable_types[variable_name];
        throw Error("Unrecognized variable: " + variable_name);
    }

    static bool CheckValidAssignment(string variableType, string expressionType)
    {
        while (true)
        {
            if (variableType == expressionType)
                return true;
            var parentType = class_parents[expressionType];
            if (parentType == null)
                return false;
            expressionType = parentType;
        }
    }

    static void PrepareConcreteType(string concrete_type)
    {
        if (!concrete_type.Contains("<"))
            // nothing to do
            return;

        if (class_methods.ContainsKey(concrete_type))
        {
            Say("Concrete type '{0}' reused.", concrete_type);
            return;
        }

        var generic_argument = GetGenericArgument(concrete_type);

        PrepareConcreteType(concrete_type, generic_argument);
    }

    static string PrepareConcreteType(string concrete_type, string generic_argument)
    {
        if (!concrete_type.Contains("<"))
            // nothing to do
            return concrete_type;

        // Stack<int> -> Stack<T>
        var generic_type = concrete_type.Replace("<" + generic_argument + ">", "<T>");

        if (!class_parents.ContainsKey(generic_argument))
            throw Error("Unrecognized generic argument '{0}'.", generic_argument);

        if (!class_parents.ContainsKey(generic_type))
            throw Error("Unrecognized generic type '{0}'.", generic_type);

        // Stack<T> -> Push, Pop, get_Count...
        class_methods[concrete_type] = class_methods[generic_type];

        foreach (var method_name in class_methods[generic_type])
        {
            // 'Stack<T>.Push'
            var generic_method = generic_type + "." + method_name;

            // 'void, T'
            var generic_signature = method_signatures[generic_method];

            // 'void, int'
            var concrete_signature = generic_signature.Select(type => type.Replace("T", generic_argument)).ToArray();

            // 'Stack<int>.Push'
            var concrete_method = concrete_type + "." + method_name;

            method_signatures[concrete_method] = concrete_signature;
        }

        Say("Concrete type '{0}' created based on generic type '{1}'.", concrete_type, generic_type);

        var generic_parent = class_parents[generic_type];
        if (generic_parent != null)
        {
            var concrete_parent = PrepareConcreteType(generic_parent, generic_argument);
            class_parents[concrete_type] = concrete_parent;
        }
        return concrete_type;
    }
}