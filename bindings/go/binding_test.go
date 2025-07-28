package tree_sitter_taskr_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_taskr "github.com/arne-vl/tree-sitter-taskr/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_taskr.Language())
	if language == nil {
		t.Errorf("Error loading taskr grammar")
	}
}
