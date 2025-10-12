import { NextResponse } from "next/server";

// Safe mathematical expression evaluator
function safeEvaluate(expression) {
  // Remove whitespace
  expression = expression.replace(/\s/g, '');
  
  // Allow only numbers, basic operators, parentheses, and decimal points
  if (!/^[0-9+\-*/.()]+$/.test(expression)) {
    throw new Error("Invalid characters in expression. Only numbers and basic operators (+, -, *, /, ()) are allowed.");
  }
  
  // Check for balanced parentheses
  let parenthesesCount = 0;
  for (let char of expression) {
    if (char === '(') parenthesesCount++;
    if (char === ')') parenthesesCount--;
    if (parenthesesCount < 0) throw new Error("Unbalanced parentheses");
  }
  if (parenthesesCount !== 0) throw new Error("Unbalanced parentheses");
  
  // Prevent division by zero (basic check)
  if (expression.includes('/0')) {
    throw new Error("Division by zero is not allowed");
  }
  
  try {
    // Use Function constructor for safe evaluation (better than eval)
    const result = new Function('return ' + expression)();
    
    if (!isFinite(result)) {
      throw new Error("Result is not a finite number");
    }
    
    return result;
  } catch (error) {
    throw new Error("Invalid mathematical expression");
  }
}

// Basic operations
const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
  },
  power: (a, b) => Math.pow(a, b),
  modulo: (a, b) => a % b,
  sqrt: (a) => {
    if (a < 0) throw new Error("Cannot calculate square root of negative number");
    return Math.sqrt(a);
  },
  abs: (a) => Math.abs(a),
  sin: (a) => Math.sin(a),
  cos: (a) => Math.cos(a),
  tan: (a) => Math.tan(a),
  log: (a) => {
    if (a <= 0) throw new Error("Logarithm of non-positive number");
    return Math.log(a);
  },
  log10: (a) => {
    if (a <= 0) throw new Error("Logarithm of non-positive number");
    return Math.log10(a);
  },
  ceil: (a) => Math.ceil(a),
  floor: (a) => Math.floor(a),
  round: (a) => Math.round(a)
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { expression, operation, a, b } = body;

    let result;
    let calculation_type;
    let input;

    if (expression) {
      // Handle mathematical expression
      calculation_type = "expression";
      input = expression;
      result = safeEvaluate(expression);
    } else if (operation && a !== undefined) {
      // Handle specific operation
      calculation_type = "operation";
      input = { operation, a, b };

      if (!operations[operation]) {
        return NextResponse.json(
          { error: `Unsupported operation: ${operation}. Available operations: ${Object.keys(operations).join(', ')}` },
          { status: 400 }
        );
      }

      // Convert to numbers
      const numA = parseFloat(a);
      const numB = b !== undefined ? parseFloat(b) : undefined;

      if (isNaN(numA) || (b !== undefined && isNaN(numB))) {
        return NextResponse.json(
          { error: "Invalid number inputs" },
          { status: 400 }
        );
      }

      // Perform operation
      if (b !== undefined) {
        result = operations[operation](numA, numB);
      } else {
        result = operations[operation](numA);
      }
    } else {
      return NextResponse.json(
        { error: "Either 'expression' or 'operation' with 'a' (and optionally 'b') must be provided" },
        { status: 400 }
      );
    }

    // Format result
    const formattedResult = {
      result: Number(result.toFixed(10)), // Remove floating point errors
      formatted: result.toLocaleString(),
      scientific: result.toExponential(5),
      calculation_type,
      input,
      timestamp: new Date().toISOString()
    };

    // Add additional information for the result
    if (typeof result === 'number' && isFinite(result)) {
      formattedResult.properties = {
        is_integer: Number.isInteger(result),
        is_positive: result > 0,
        is_negative: result < 0,
        is_zero: result === 0,
        absolute_value: Math.abs(result),
        sign: Math.sign(result)
      };
    }

    return NextResponse.json(formattedResult);

  } catch (error) {
    console.error("Calculate API Error:", error);
    return NextResponse.json(
      { error: error.message || "Calculation failed" },
      { status: 400 }
    );
  }
}