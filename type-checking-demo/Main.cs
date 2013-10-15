using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

partial class TypeChecker
{
    static void Main()
    {
        while (true)
        {
            // limitations:
            // * only declarations, assignments and method calls
            // * only 1 generic argument allowed, called T
            // * parsing is *extremely* rudimentary

            string statement = Console.ReadLine();

            if (statement == null)
                return;

            try
            {
                if (IsDeclaration(statement))
                    ProcessDeclaration(statement);

                else if (IsAssignment(statement))
                    CheckAssignment(statement);

                else if (IsMethodCall(statement))
                    CheckMethodCall(statement);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            Console.WriteLine();

        }
    }

    // Declarations: 'int x;', 'Stack<int> stack;', etc
    static void ProcessDeclaration(string declaration)
    {
        // 'int x;' -> 'x'
        var variable_name = GetNameOfDeclaredVaiable(declaration);

        // 'int x;' -> 'int'
        var declaration_type = GetTypeOfDeclaration(declaration);

        if (declaration_type.Contains("<T>"))
            throw Error("Variables need concrete type, got generic type '{0}'.", declaration_type);

        PrepareConcreteType(declaration_type);

        if (!class_parents.ContainsKey(declaration_type))
            throw Error("Unrecognized type '{0}'.", declaration_type);

        variable_types[variable_name] = declaration_type;

        Say("Variable '{0}' is of type '{1}'.", variable_name, declaration_type);
    }

    // Assignments: 'x = 10;', 'stack = new Stack<int>()'
    static void CheckAssignment(string assignment)
    {
        // 'x = 1 + 2;' -> 'x'
        var variable_name = GetNameOfAssignedVariable(assignment);

        // 'x' -> 'int'
        var variable_type = variable_types[variable_name];

        // 'x = 1 + 2'; -> 'int' - the type of 1 + 2
        var expression_type = GetTypeOfAssignmentExpression(assignment);

        PrepareConcreteType(expression_type);

        if (!CheckValidAssignment(variable_type, expression_type))
            throw Error("Invalid assignment - variable is '{0}', expression is '{1}'.", variable_type, expression_type);

        Say("Variable '{0}' of type '{1}' assigned value of type '{2}'.", variable_name, variable_type, expression_type);
    }

    // Method calls: 'stack.Pop();', 'stack.Push(100);', ...
    static void CheckMethodCall(string method_call)
    {
        string variable_name;
        string method_name;
        string[] arguments;

        ParseMethodCall(method_call, out variable_name, out method_name, out arguments);

        var variable_type = GetTypeOfVariable(variable_name);

        CheckMethodCall(variable_name, method_name, arguments, variable_type, variable_type);
    }


    static void CheckMethodCall(string variable_name, string method_name, string[] arguments, string variable_type, string method_owner_type)
    {
        // is method found on type we're looking at?
        if (!class_methods[method_owner_type].Contains(method_name))
        {
            var parent = class_parents[method_owner_type];
            if (parent == null)
                throw Error("Unknown method '{0}' on type '{1}'.", method_name, variable_type);
            CheckMethodCall(variable_name, method_name, arguments, variable_type, parent);
            return;
        }

        // 'Stack<int>.Push'
        var full_method_name = method_owner_type + "." + method_name;

        // 'void, int'
        var method_signature = method_signatures[full_method_name];

        if (arguments.Length != method_signature.Length - 1)
            throw Error("Wrong number of arguments, got {0}, need {1}", arguments.Length, method_signature.Length - 1);

        for (int ii = 0; ii < arguments.Length; ++ii)
        {
            var parameter_type = GetTypeOfExpression(method_signature[ii + 1]);
            var argument_type = GetTypeOfExpression(arguments[ii]);

            if (!CheckValidAssignment(parameter_type, argument_type))
                throw Error("Wrong argument type {0}: got '{1}', need '{2}'", ii + 1, argument_type, parameter_type);
        }

        Say("Method '{0}' correctly invoked on variable '{1}' with argument types '{2}'.", full_method_name, variable_name, string.Join(", ", arguments.Select(GetTypeOfExpression)));
    }
}