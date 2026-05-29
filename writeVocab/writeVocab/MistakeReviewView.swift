//
//  MistakeReviewView.swift
//  writeVocab
//
//  Created by 坂口拓 on 2026/05/29.
//

import SwiftUI
struct MistakeReviewView: View {
    @State private var mistakes: [MistakeRecord] = []

    var body: some View {
        List {
            if mistakes.isEmpty {
                Text("まだミスはありません。")
                    .foregroundColor(.secondary)
            } else {
                ForEach(mistakes) { mistake in
                    VStack(alignment: .leading, spacing: 6) {
                        Text(mistake.word)
                            .font(.headline)

                        Text(mistake.meaningJa)
                            .foregroundColor(.secondary)

                        Text("Your answer: \(mistake.userAnswer)")
                            .font(.caption)
                            .foregroundColor(.red)

                        Text("\(mistake.exam) · \(mistake.level) · \(mistake.category)")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                    .padding(.vertical, 6)
                }
            }
        }
        .navigationTitle("Mistake Review")
        .onAppear {
            mistakes = loadMistakes()
        }
    }

    private func loadMistakes() -> [MistakeRecord] {
        guard let data = UserDefaults.standard.data(forKey: "mistakes_v2") else {
            return []
        }

        return (try? JSONDecoder().decode([MistakeRecord].self, from: data)) ?? []
    }
}
