//
//  VocabularyWord.swift
//  writeVocab
//
//  Created by 坂口拓 on 2026/05/29.
//

import Foundation

struct VocabularyWord: Identifiable, Codable, Equatable {
    let id: UUID
    let word: String
    let meaningJa: String
    let exam: String
    let level: String
    let category: String
    let example: String
    let exampleJa: String

    init(
        id: UUID = UUID(),
        word: String,
        meaningJa: String,
        exam: String,
        level: String,
        category: String,
        example: String,
        exampleJa: String
    ) {
        self.id = id
        self.word = word
        self.meaningJa = meaningJa
        self.exam = exam
        self.level = level
        self.category = category
        self.example = example
        self.exampleJa = exampleJa
    }
}
