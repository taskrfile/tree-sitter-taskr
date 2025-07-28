import XCTest
import SwiftTreeSitter
import TreeSitterTaskr

final class TreeSitterTaskrTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_taskr())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading taskr grammar")
    }
}
