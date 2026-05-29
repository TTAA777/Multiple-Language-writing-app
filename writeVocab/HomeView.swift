//
//  HomeView.swift
//  writeVocab
//
//  Created by 坂口拓 on 2026/05/29.
//

import SwiftUI

struct HomeView: View {
    var body: some View {
        NavigationStack {
            VStack(spacing: 28) {
                Spacer()

                VStack(spacing: 12) {
                    Image(systemName: "pencil.and.outline")
                        .font(.system(size: 56))
                        .foregroundColor(.green)

                    Text("WriteVocab Beta")
                        .font(.largeTitle.bold())

                    Text("手で書いて覚える英単語アプリ。IELTS・TOEIC・A-Level語彙を練習できます。")
                        .font(.body)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }

                NavigationLink {
                    PracticeView(words: VocabularyData.words)
                } label: {
                    Text("練習を始める")
                        .font(.headline)
                        .frame(maxWidth: 320)
                        .padding()
                }
                .buttonStyle(.borderedProminent)

                VStack(spacing: 12) {
                    Text("カテゴリ")
                        .font(.headline)

                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        categoryCard("IELTS")
                        categoryCard("TOEIC")
                        categoryCard("A-Level History")
                        categoryCard("A-Level Geography")
                    }
                    .padding(.horizontal)
                }

                NavigationLink {
                    MistakeReviewView()
                } label: {
                    Text("ミスだけ復習")
                    .font(.headline)
                    .frame(maxWidth: 320)
                    .padding()
                }
                .buttonStyle(.bordered)

                Spacer()
            }
            .navigationTitle("")
        }
    }

    private func categoryCard(_ title: String) -> some View {
        NavigationLink {
            PracticeView(words: VocabularyData.words.filter { $0.exam == title })
        } label: {
            VStack(spacing: 8) {
                Image(systemName: iconName(for: title))
                    .font(.title2)

                Text(title)
                    .font(.headline)
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 18))
        }
        .buttonStyle(.plain)
    }

    private func iconName(for title: String) -> String {
        switch title {
        case "IELTS":
            return "book"
        case "TOEIC":
            return "briefcase"
        case "A-Level History":
            return "building.columns"
        case "A-Level Geography":
            return "globe.asia.australia"
        default:
            return "book"
        }
    }
}
