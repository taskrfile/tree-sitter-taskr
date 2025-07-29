/**
 * @file Treesitter parser for taskrfiles
 * @author Arne Van Looveren
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "taskr",

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.env_definition,
      $.task_definition
    ),

    task_definition: $ => seq(
      $.kw_task,
      $.identifier,
      ":",
      repeat1(
        choice(
          $.required_task_attribute,
          $.optional_task_attribute
        )
      )
    ),

    required_task_attribute: $ => seq(
      "  ",
      $.required_task_key,
      "=",
      " ",
      $.anything
    ),

    optional_task_attribute: $ => seq(
      "  ",
      $.optional_task_key,
      "=",
      " ",
      $.anything
    ),

    list: $ => seq(
      $.identifier,
      repeat(
        seq(
          ",",
          $.identifier
        )
      )
    ),

    env_definition: $ => choice(
      $.env,
      $.default_env
    ),

    env: $ => seq(
      $.kw_env,
      $.identifier,
      ":",
      $.file_definition
    ),

    default_env: $ => seq(
      $.kw_default_env,
      $.identifier,
      ":",
      $.file_definition
    ),

    file_definition: $ => seq(
      "  ",
      $.required_env_key,
      "=",
      " ",
      $.filename
    ),

    identifier: $ => /[a-z]+/,

    filename: $ => /[\.a-z]+/,

    anything: $ => /.+/,

    kw_task: $ => /task/,
    kw_env: $ => /env/,
    kw_default_env: $ => /default env/,

    required_task_key: $ => /run/,

    optional_task_key: $ => choice(
      "desc",
      "needs",
      "alias"
    ),

    required_env_key: $ => /file/
  }
});
