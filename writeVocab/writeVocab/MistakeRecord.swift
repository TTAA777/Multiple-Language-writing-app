//
//  MistakeRecord.swift
//  writeVocab
//
//  Created by 坂口拓 on 2026/05/29.
//

import Foundation
struct MistakeRecord: Identifiable, Codable {
        let id: UUID
        let word: String
        let meaningJa: String
        let userAnswer: String
        let exam: String
        let level: String
        let category: String
        let createdAt: Date
        var status: String
    }
