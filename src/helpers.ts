/**
 * @file Defines general-purpose functions that can be used anywhere.
 */

/**
 * During runtime, this just throws an error. For development, this will make
 * sure that every single argument passed in is of type never.
 *
 * @example Say you have a variable x, whose type is a union of the discrete
 * string values "A" | "B" | "C". You can use this function with x to make sure
 * you're taking care of all three cases properly.
 *
 * switch (x) {
 *  case "A": {
 *    return;
 *  }
 *  case "B": {
 *    return;
 *  }
 *  default: {
 *    checkTypeExhaustion(x);
 *  }
 * }
 *
 * In the above example, VS Code will yell at you because you didn't have
 * anything for case "C". So the type of x can still be the string literal "C",
 * which has no overlap with type never. You'd have to add a case for "C" to get
 * VS Code to stop yelling at you.
 */
export function assertTypeExhaustion(..._: never[]): never {
  throw new Error('Not all types have been exhausted properly');
}

