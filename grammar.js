/**
 * @file Treesitter parser for taskrfiles
 * @author Arne Van Looveren
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

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
    kw_env: $ => "env",
    env: $ => seq(
      $.kw_env,
      $.identifier,
      $._colon,
      $.file_definition
    ),

    // -- DEFAULT ENVIRONMENT
    kw_default_env: $ => "default env",
    default_env: $ => seq(
      $.kw_default_env,
      $.identifier,
      $._colon,
      $.file_definition
    ),

    // -- FILE KEY-VALUE
    file_key: $ => "file",
    filename: $ => /[\.a-z]+/,
    file_definition: $ => seq(
      $._indent,
      $.file_key,
      $._space,
      $._equals,
      $._space,
      $.filename
    ),

    // TASKS
    kw_task: $ => "task",
    task: $ => seq(
      $.kw_task,
      $.identifier,
      $._colon,
      repeat1(
        choice(
          $.run_definition,
          $.desc_definition,
          $.needs_definition,
          $.alias_definition
        )
      )
    ),

    // -- REQUIRED RUN KEY-VALUE
    command: $ => /[^\n]+/,
    run_key: $ => "run",
    run_definition: $ => seq(
      $._indent,
      $.run_key,
      $._space,
      $._equals,
      $._space,
      $.command
    ),

    // -- OPTIONAL DESC KEY-VALUE
    desc_key: $ => "desc",
    text: $ => /.+/,
    desc_definition: $ => seq(
      $._indent,
      $.desc_key,
      $._space,
      $._equals,
      $._space,
      $.text
    ),

    // -- OPTIONAL ALIAS KEY-VALUE
    alias_key: $ => "alias",
    alias_definition: $ => seq(
      $._indent,
      $.alias_key,
      $._space,
      $._equals,
      $._space,
      $.list
    ),

    // -- OPTIONAL NEEDS KEY-VALUE
    needs_key: $ => "needs",
    needs_definition: $ => seq(
      $._indent,
      $.needs_key,
      $._space,
      $._equals,
      $._space,
      $.list
    ),

    // GENERAL
    identifier: $ => /[a-z]+/,
    _colon: $ => ":",
    _equals: $ => "=",
    _indent: $ => "  ",
    _space: $ => " ",

    list: $ => seq(
      $.identifier,
      repeat(
        seq(
          ",",
          $.identifier
        )
      )
    ),

    comment: $ =>seq("//", /.*/),
  }
});
