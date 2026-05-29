//
//  PracticeView.swift
//  writeVocab
//
//  Created by 坂口拓 on 2026/05/29.
//
import SwiftUI
import PencilKit

struct PracticeView: View {

    let words: [VocabularyWord]

    @State private var currentIndex: Int = 0
    @State private var typedAnswer: String = ""
    @State private var typingMode: Bool = true

    @State private var correctCount: Int = 0
    @State private var answeredCount: Int = 0

    @State private var feedback: AnswerResult? = nil
    @State private var showHint: Bool = false

    @State private var canvasView = PKCanvasView()

    private func canvasImage() -> UIImage? {
        let bounds = canvasView.bounds

        guard bounds.width > 0, bounds.height > 0 else {
           return nil
        }

        return canvasView.drawing.image(from: bounds, scale: UIScreen.main.scale)
    }

    var currentWord: VocabularyWord {
        words[currentIndex]
    }

    var accuracy: Int {
        if answeredCount == 0 { return 0 }
        return Int(Double(correctCount) / Double(answeredCount) * 100)
    }

    var body: some View {
        Group {
            if words.isEmpty {
                VStack(spacing: 16) {
                    Text("このカテゴリにはまだ単語がありません。")
                        .font(.headline)

                    Text("別のカテゴリを選んでください。")
                        .foregroundColor(.secondary)
                }
                .padding()
            } else {
                VStack(spacing: 0) {
                    header

                    GeometryReader { geometry in
                        let totalSpacing: CGFloat = 20
                        let availableWidth = geometry.size.width - totalSpacing

                        HStack(spacing: 20) {
                            meaningPanel
                                .frame(width: geometry.size.width * 0.32)

                            rightPanel
                                .frame(width: geometry.size.width * 0.68)
                        }
                        .padding()
                    }
                }
            }
        }
        .navigationBarBackButtonHidden(false)
    }

    private var header: some View {
        VStack(spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(currentWord.exam)
                        .font(.headline)

                    Text("\(currentWord.level) · \(currentWord.category)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                Button {
                    typingMode.toggle()
                } label: {
                    HStack {
                        Image(systemName: "keyboard")
                        Text("Typing Beta Mode \(typingMode ? "ON" : "OFF")")
                    }
                    .font(.caption)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(typingMode ? Color.orange.opacity(0.15) : Color.gray.opacity(0.12))
                    .foregroundColor(typingMode ? .orange : .secondary)
                    .clipShape(Capsule())
                }
            }

            ProgressView(value: Double(currentIndex + 1), total: Double(words.count))
                .tint(.green)

            HStack {
                Text("\(currentIndex + 1) / \(words.count)")
                Spacer()
                Text("Accuracy \(accuracy)%")
            }
            .font(.caption)
            .foregroundColor(.secondary)
        }
        .padding()
        .background(.thinMaterial)
    }

    private var meaningPanel: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("意味")
                .font(.caption)
                .foregroundColor(.secondary)

            Text(currentWord.meaningJa)
                .font(.system(size: 44, weight: .bold))
                .minimumScaleFactor(0.5)

            Spacer()

            Text(currentWord.exam)
                .font(.caption)
                .foregroundColor(.secondary)

            Text(currentWord.category)
                .font(.caption)
                .foregroundColor(.secondary)

            if showHint {
                Divider()

                Text("例文")
                    .font(.caption)
                    .foregroundColor(.secondary)

                Text(currentWord.example)
                    .font(.subheadline)

                Text(currentWord.exampleJa)
                    .font(.caption)
                    .foregroundColor(.secondary)
            } else {
                Button {
                    showHint = true
                } label: {
                    Label("ヒントを見る", systemImage: "eye")
                        .font(.caption)
                }
            }
        }
        .padding(24)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 24))
    }

    private var rightPanel: some View {
        VStack(spacing: 14) {
            if let feedback = feedback {
                feedbackView(feedback)
            } else {
                VStack(spacing: 12) {
                    ZStack(alignment: .topLeading) {
                        PencilCanvasView(canvasView: $canvasView)
                            .clipShape(RoundedRectangle(cornerRadius: 24))
                            .overlay(
                                RoundedRectangle(cornerRadius: 24)
                                    .stroke(Color.gray.opacity(0.25), lineWidth: 1)
                            )

                        Text("Apple Pencil または指で英単語を書いてください")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .padding(12)
                    }

                    canvasButtons

                    if typingMode {
                        typingBetaBox
                    } else {
                        Text("手書き認識はまだ未実装です。ベータ版ではTyping Beta ModeをONにして採点してください。")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                    }
                }
            }
        }
    }

            private func handleResult(_ result: AnswerResult) {
                answeredCount += 1

                if result.isCorrect {
                    correctCount += 1
                } else {
                    saveMistake(word: currentWord, userAnswer: result.userAnswer)
                }

                feedback = result
            }

    private var canvasButtons: some View {
        HStack {
            Button {
                clearCanvas()
            } label: {
                Label("Clear", systemImage: "trash")
            }
            .buttonStyle(.bordered)

            Button {
                skipWord()
            } label: {
                Label("Skip", systemImage: "arrow.right")
            }
            .buttonStyle(.bordered)

            Spacer()

            Button {
                checkAnswer()
            } label: {
                Label("Check", systemImage: "checkmark.circle.fill")
            }
            .buttonStyle(.borderedProminent)
        }
    }

    private var typingBetaBox: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label("Beta testing only: type your answer here.", systemImage: "keyboard")
                .font(.caption)
                .foregroundColor(.orange)

            HStack {
                TextField("英単語を入力", text: $typedAnswer)
                    .textFieldStyle(.roundedBorder)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled(true)
                    .onSubmit {
                        checkAnswer()
                    }

                Button("確認") {
                    checkAnswer()
                }
                .buttonStyle(.borderedProminent)
                .disabled(typedAnswer.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
        }
        .padding()
        .background(Color.orange.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private func feedbackView(_ result: AnswerResult) -> some View {
        VStack(spacing: 20) {
            Image(systemName: result.isCorrect ? "checkmark.circle.fill" : "xmark.circle.fill")
                .font(.system(size: 64))
                .foregroundColor(result.isCorrect ? .green : .red)

            Text(result.isCorrect ? "Correct!" : "Incorrect")
                .font(.largeTitle.bold())

            VStack(spacing: 8) {
                Text("あなたの回答: \(result.userAnswer)")
                    .font(.headline)

                Text("正解: \(result.correctAnswer)")
                    .font(.headline)
                    .foregroundColor(.green)

                Text(result.message)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }

            if !result.isCorrect {
                Button {
                    goNext()
                } label: {
                    Label("次の問題へ", systemImage: "arrow.right")
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 24))
        .onAppear {
            if result.isCorrect {
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
                    goNext()
                }
            }
        }
    }

    private func checkAnswer() {
        if typingMode {
            let result = AnswerChecker.check(
                userAnswer: typedAnswer,
                correctAnswer: currentWord.word
            )

            handleResult(result)
        } else {
            recognizeHandwritingAndCheck()
        }
    }

    private func recognizeHandwritingAndCheck() {
        guard let image = canvasImage(),
            let imageData = image.pngData() else {
          feedback = AnswerResult(
                isCorrect: false,
                userAnswer: "",
                correctAnswer: currentWord.word,
                message: "手書き画像を読み取れませんでした。"
            )
            return
        }

    // 次のステップでVercel APIに送る
        feedback = AnswerResult(
            isCorrect: false,
            userAnswer: "",
            correctAnswer: currentWord.word,
            message: "手書き認識APIは次のステップで接続します。"
        )
    }

    private func goNext() {
        feedback = nil
        typedAnswer = ""
        showHint = false
        clearCanvas()

        if currentIndex < words.count - 1 {
            currentIndex += 1
        } else {
            currentIndex = 0
        }
    }

    private func skipWord() {
        goNext()
    }

    private func clearCanvas() {
        canvasView.drawing = PKDrawing()
    }

    private func saveMistake(word: VocabularyWord, userAnswer: String) {
        var mistakes = loadMistakes()

        let newMistake = MistakeRecord(
            id: UUID(),
            word: word.word,
            meaningJa: word.meaningJa,
            userAnswer: userAnswer,
            exam: word.exam,
            level: word.level,
            category: word.category,
            createdAt: Date(),
            status: "active"
        )

        mistakes.append(newMistake)
        saveMistakes(mistakes)
    }

    private func loadMistakes() -> [MistakeRecord] {
        guard let data = UserDefaults.standard.data(forKey: "mistakes_v2") else {
            return []
        }

        return (try? JSONDecoder().decode([MistakeRecord].self, from: data)) ?? []
    }

    private func saveMistakes(_ mistakes: [MistakeRecord]) {
        if let data = try? JSONEncoder().encode(mistakes) {
            UserDefaults.standard.set(data, forKey: "mistakes_v2")
        }
    }
}
