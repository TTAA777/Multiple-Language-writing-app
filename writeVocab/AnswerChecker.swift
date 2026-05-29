//
//  AnswerChecker.swift
//  writeVocab
//
//  Created by 坂口拓 on 2026/05/29.
//

import Foundation
struct AnswerChecker {
    static func check(userAnswer: String, correctAnswer: String) -> AnswerResult {
        let user = userAnswer.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        let correct = correctAnswer.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()

        if user == correct {
            return AnswerResult(
                isCorrect: true,
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                message: "Correct!"
            )
        } else {
            return AnswerResult(
                isCorrect: false,
                userAnswer: userAnswer,
                correctAnswer: correctAnswer,
                message: makeMistakeMessage(user: user, correct: correct)
            )
        }
    }

    private static func makeMistakeMessage(user: String, correct: String) -> String {
        if user.isEmpty {
            return "回答が入力されていません。"
        }

        if abs(user.count - correct.count) >= 2 {
            return "スペルの長さが大きく違います。正しくは \(correct) です。"
        }

        if user.count < correct.count {
            return "文字が足りない可能性があります。正しくは \(correct) です。"
        }

        if user.count > correct.count {
            return "余分な文字がある可能性があります。正しくは \(correct) です。"
        }

        return "一部の文字が違います。正しくは \(correct) です。"
    }
}
