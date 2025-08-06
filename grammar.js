/**
 * @file Treesitter parser for taskrfiles
 * @author Arne Van Looveren
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
function generatePermutations($) {
  const required = $.run_definition;
  const optionalNames = ['desc_definition', 'needs_definition', 'alias_definition'];

  // Generate power set (all combinations) of optionals
  function combinations(arr) {
    const result = [[]];
    for (const value of arr) {
      const copy = [...result];
      for (const prefix of copy) {
        result.push([...prefix, value]);
      }
    }
    return result;
  }

  // Generate all permutations of an array
  function permute(arr) {
    if (arr.length <= 1) return [arr];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const rest = permute([...arr.slice(0, i), ...arr.slice(i + 1)]);
      for (const r of rest) {
        result.push([arr[i], ...r]);
      }
    }
    return result;
  }

  const allSequences = [];

  // All combinations of optional fields (including empty)
  const combos = combinations(optionalNames);

  for (const combo of combos) {
    const permutedOptionals = permute(combo);
    for (const p of permutedOptionals) {
      // Insert `required` at every position in the permutation
      for (let i = 0; i <= p.length; i++) {
        const names = [...p.slice(0, i), 'run_definition', ...p.slice(i)];
        const fields = names.map(name => $[name]);
        allSequences.push(seq(...fields));
      }
    }
  }

  return choice(...allSequences);
}

module.exports = grammar({
  name: "taskr",

  extras: $ => [$.comment, /\s/],

  rules: {
    source_file: $ => repeat($._definition),

    // HEADERS
    _definition: $ => choice(
      $._env_definition,
      $.task
    ),

    // ENVIRONMENT
    _env_definition: $ => choice(
      $.env,
      $.default_env
    ),

    // -- NORMAL ENVIRONMENT
    kw_env: $ => token("env"),
    env: $ => seq(
      $.kw_env,
      $.identifier,
      $._colon,
      $.file_definition
    ),

    // -- DEFAULT ENVIRONMENT
    kw_default: $ => token("default"),
    default_env: $ => seq(
      $.kw_default,
      $.kw_env,
      $.identifier,
      $._colon,
      $.file_definition
    ),

    // -- FILE KEY-VALUE
    file_key: $ => token("file"),
    filename: $ => /[\.a-zA-Z0-9\-_]+/,
    file_definition: $ => seq(
      $._indent,
      $.file_key,
      $._equals,
      $.filename
    ),

    // TASKS
    kw_task: $ => token("task"),
    task: $ => seq(
      $.kw_task,
      $.identifier,
      $._colon,
      choice(
        generatePermutations($)
      )
    ),

    // -- REQUIRED RUN KEY-VALUE
    command: $ => repeat1(
      /[A-Za-z0-9_./:~+=@%*\-?!$'"`&|<>(){}\[\]\\; \t]/
    ),
    run_key: $ => token("run"),
    run_definition: $ => seq(
      $._indent,
      $.run_key,
      $._equals,
      $.command
    ),

    // -- OPTIONAL DESC KEY-VALUE
    desc_key: $ => token("desc"),
    text: $ => repeat1(
      /[A-Za-z0-9_./:~+=@%*\-?!$'"`&|<>(){}\[\]\\; \t]/
    ),
    desc_definition: $ => seq(
      $._indent,
      $.desc_key,
      $._equals,
      $.text
    ),

    // -- OPTIONAL ALIAS KEY-VALUE
    alias_key: $ => token("alias"),
    alias_definition: $ => seq(
      $._indent,
      $.alias_key,
      $._equals,
      $.list
    ),

    // -- OPTIONAL NEEDS KEY-VALUE
    needs_key: $ => token("needs"),
    needs_definition: $ => seq(
      $._indent,
      $.needs_key,
      $._equals,
      $.list
    ),

    // GENERAL
    identifier: $ => token(/[a-z_][a-z0-9_-]*/),
    _colon: $ => token(":"),
    _equals: $ => token("="),
    _indent: $ => token("  "),

    list: $ => seq(
      $.identifier,
      repeat(
        seq(
          token(","),
          $.identifier
        )
      )
    ),

    comment: $ => token(seq(token("//"), /.*/)),
  }
});
