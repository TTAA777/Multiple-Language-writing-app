//
//  VocabularyData.swift
//  writeVocab
//
//  Created by 坂口拓 on 2026/05/29.
//

import Foundation
struct VocabularyData {
    static let words: [VocabularyWord] = [
        // IELTS - Band 5.0
        VocabularyWord(word: "important", meaningJa: "重要な", exam: "IELTS", level: "Band 5.0", category: "General", example: "Education is important for everyone.", exampleJa: "教育はすべての人にとって重要です。"),
        VocabularyWord(word: "different", meaningJa: "異なる", exam: "IELTS", level: "Band 5.0", category: "General", example: "People have different opinions.", exampleJa: "人々は異なる意見を持っています。"),
        VocabularyWord(word: "increase", meaningJa: "増加する", exam: "IELTS", level: "Band 5.0", category: "General", example: "The population continues to increase.", exampleJa: "人口は増加し続けています。"),
        VocabularyWord(word: "develop", meaningJa: "発展する", exam: "IELTS", level: "Band 5.0", category: "General", example: "Countries need to develop their economies.", exampleJa: "各国は経済を発展させる必要があります。"),

        // IELTS - Band 6.0
        VocabularyWord(word: "environment", meaningJa: "環境", exam: "IELTS", level: "Band 6.0", category: "Environment", example: "Protecting the environment is a global responsibility.", exampleJa: "環境を守ることは世界的な責任です。"),
        VocabularyWord(word: "significant", meaningJa: "重要な・著しい", exam: "IELTS", level: "Band 6.0", category: "General", example: "There was a significant change in the results.", exampleJa: "結果に著しい変化がありました。"),
        VocabularyWord(word: "phenomenon", meaningJa: "現象", exam: "IELTS", level: "Band 6.0", category: "General", example: "Global warming is a serious phenomenon.", exampleJa: "地球温暖化は深刻な現象です。"),
        VocabularyWord(word: "consequence", meaningJa: "結果・影響", exam: "IELTS", level: "Band 6.0", category: "General", example: "Every action has a consequence.", exampleJa: "すべての行動には結果があります。"),

        // IELTS - Band 7.0
        VocabularyWord(word: "sustainable", meaningJa: "持続可能な", exam: "IELTS", level: "Band 7.0", category: "Environment", example: "Many cities are trying to become more sustainable.", exampleJa: "多くの都市がより持続可能になろうとしています。"),
        VocabularyWord(word: "unprecedented", meaningJa: "前例のない", exam: "IELTS", level: "Band 7.0", category: "General", example: "The crisis was unprecedented in scale.", exampleJa: "この危機は規模において前例のないものでした。"),
        VocabularyWord(word: "deteriorate", meaningJa: "悪化する", exam: "IELTS", level: "Band 7.0", category: "Health", example: "Air quality continues to deteriorate.", exampleJa: "大気の質は悪化し続けています。"),
        VocabularyWord(word: "exacerbate", meaningJa: "悪化させる", exam: "IELTS", level: "Band 7.0", category: "General", example: "Pollution exacerbates health problems.", exampleJa: "汚染は健康問題を悪化させます。"),

        // IELTS - Band 8.0+
        VocabularyWord(word: "ubiquitous", meaningJa: "至る所にある", exam: "IELTS", level: "Band 8.0+", category: "Technology", example: "Smartphones have become ubiquitous.", exampleJa: "スマートフォンは至る所にあるようになりました。"),
        VocabularyWord(word: "ameliorate", meaningJa: "改善する", exam: "IELTS", level: "Band 8.0+", category: "General", example: "The government tried to ameliorate the situation.", exampleJa: "政府は状況を改善しようとしました。"),
        VocabularyWord(word: "juxtapose", meaningJa: "並置する", exam: "IELTS", level: "Band 8.0+", category: "General", example: "The author juxtaposes modern and traditional values.", exampleJa: "著者は現代的な価値観と伝統的な価値観を並置しています。"),

        // TOEIC
        VocabularyWord(word: "schedule", meaningJa: "予定・スケジュール", exam: "TOEIC", level: "400-600", category: "Business", example: "Please check the meeting schedule.", exampleJa: "会議のスケジュールを確認してください。"),
        VocabularyWord(word: "available", meaningJa: "利用可能な", exam: "TOEIC", level: "400-600", category: "Business", example: "The product is now available.", exampleJa: "その商品は今利用可能です。"),
        VocabularyWord(word: "confirm", meaningJa: "確認する", exam: "TOEIC", level: "400-600", category: "Business", example: "Please confirm your reservation.", exampleJa: "ご予約を確認してください。"),
        VocabularyWord(word: "negotiate", meaningJa: "交渉する", exam: "TOEIC", level: "600-750", category: "Business", example: "We need to negotiate the contract terms.", exampleJa: "契約条件を交渉する必要があります。"),
        VocabularyWord(word: "implement", meaningJa: "実行する", exam: "TOEIC", level: "600-750", category: "Business", example: "The company will implement new policies.", exampleJa: "会社は新しい方針を実行します。"),
        VocabularyWord(word: "authorize", meaningJa: "許可する", exam: "TOEIC", level: "600-750", category: "Business", example: "Only managers can authorize expenses.", exampleJa: "経費を許可できるのはマネージャーだけです。"),
        VocabularyWord(word: "revenue", meaningJa: "収益", exam: "TOEIC", level: "750-850", category: "Business", example: "The company increased its revenue last year.", exampleJa: "その会社は昨年収益を増やしました。"),
        VocabularyWord(word: "acquisition", meaningJa: "買収", exam: "TOEIC", level: "750-850", category: "Business", example: "The acquisition was completed last month.", exampleJa: "買収は先月完了しました。"),
        VocabularyWord(word: "prospective", meaningJa: "将来の・見込みのある", exam: "TOEIC", level: "750-850", category: "Business", example: "We met with prospective clients.", exampleJa: "見込み客と面会しました。"),
        VocabularyWord(word: "compliance", meaningJa: "法令遵守", exam: "TOEIC", level: "850+", category: "Business", example: "The company ensures regulatory compliance.", exampleJa: "会社は法令遵守を確保しています。"),
        VocabularyWord(word: "leverage", meaningJa: "活用する・てこの力", exam: "TOEIC", level: "850+", category: "Business", example: "We can leverage our brand recognition.", exampleJa: "私たちのブランド認知度を活用できます。"),

        // Academic
        VocabularyWord(word: "hypothesis", meaningJa: "仮説", exam: "Academic", level: "Advanced", category: "Education", example: "The researcher tested the hypothesis.", exampleJa: "研究者は仮説を検証しました。"),
        VocabularyWord(word: "methodology", meaningJa: "方法論", exam: "Academic", level: "Advanced", category: "Education", example: "The methodology was clearly explained.", exampleJa: "方法論が明確に説明されていました。"),
        VocabularyWord(word: "paradigm", meaningJa: "パラダイム・枠組み", exam: "Academic", level: "Advanced", category: "Education", example: "A new paradigm has emerged in science.", exampleJa: "科学において新しいパラダイムが現れました。"),
        VocabularyWord(word: "empirical", meaningJa: "実証的な", exam: "Academic", level: "Advanced", category: "Education", example: "The study provides empirical evidence.", exampleJa: "その研究は実証的な証拠を提供しています。"),

        // A-Level History - Cold War / Historiography
        VocabularyWord(word: "containment", meaningJa: "封じ込め", exam: "A-Level History", level: "Basic terms", category: "Cold War", example: "The US adopted a policy of containment.", exampleJa: "アメリカは封じ込め政策を採用しました。"),
        VocabularyWord(word: "deterrence", meaningJa: "抑止", exam: "A-Level History", level: "Basic terms", category: "Cold War", example: "Nuclear deterrence prevented direct conflict.", exampleJa: "核抑止が直接的な衝突を防ぎました。"),
        VocabularyWord(word: "brinkmanship", meaningJa: "瀬戸際政策", exam: "A-Level History", level: "Basic terms", category: "Cold War", example: "Brinkmanship was a dangerous strategy.", exampleJa: "瀬戸際政策は危険な戦略でした。"),
        VocabularyWord(word: "escalation", meaningJa: "拡大・激化", exam: "A-Level History", level: "Basic terms", category: "Cold War", example: "The escalation of the conflict worried many nations.", exampleJa: "紛争の激化が多くの国を心配させました。"),
        VocabularyWord(word: "sovereignty", meaningJa: "主権", exam: "A-Level History", level: "Basic terms", category: "Cold War", example: "Every nation has the right to sovereignty.", exampleJa: "すべての国は主権を持つ権利があります。"),
        VocabularyWord(word: "sphere of influence", meaningJa: "勢力圏", exam: "A-Level History", level: "Essay vocabulary", category: "Cold War", example: "Eastern Europe was within the Soviet sphere of influence.", exampleJa: "東ヨーロッパはソビエトの勢力圏内にありました。"),
        VocabularyWord(word: "ideological conflict", meaningJa: "イデオロギー対立", exam: "A-Level History", level: "Essay vocabulary", category: "Cold War", example: "The Cold War was fundamentally an ideological conflict.", exampleJa: "冷戦は根本的にイデオロギー対立でした。"),
        VocabularyWord(word: "mutual suspicion", meaningJa: "相互不信", exam: "A-Level History", level: "Essay vocabulary", category: "Cold War", example: "Mutual suspicion between the superpowers deepened.", exampleJa: "超大国間の相互不信が深まりました。"),
        VocabularyWord(word: "orthodox interpretation", meaningJa: "正統派解釈", exam: "A-Level History", level: "Evaluation phrases", category: "Historiography", example: "The orthodox interpretation blames the Soviet Union.", exampleJa: "正統派解釈はソビエト連邦を非難します。"),
        VocabularyWord(word: "revisionist interpretation", meaningJa: "修正主義的解釈", exam: "A-Level History", level: "Evaluation phrases", category: "Historiography", example: "The revisionist interpretation challenges traditional views.", exampleJa: "修正主義的解釈は伝統的な見方に異議を唱えます。"),
        VocabularyWord(word: "post-revisionist interpretation", meaningJa: "ポスト修正主義的解釈", exam: "A-Level History", level: "Advanced academic vocabulary", category: "Historiography", example: "Post-revisionist interpretation considers both sides.", exampleJa: "ポスト修正主義的解釈は両方の側面を考慮します。"),
        VocabularyWord(word: "causation", meaningJa: "因果関係", exam: "A-Level History", level: "Evaluation phrases", category: "Historiography", example: "Understanding causation is essential in history.", exampleJa: "因果関係を理解することは歴史において不可欠です。"),
        VocabularyWord(word: "inevitability", meaningJa: "不可避性", exam: "A-Level History", level: "Evaluation phrases", category: "Historiography", example: "The inevitability of the conflict is debated.", exampleJa: "紛争の不可避性は議論されています。"),
        VocabularyWord(word: "continuity", meaningJa: "継続性", exam: "A-Level History", level: "Evaluation phrases", category: "Historiography", example: "There was continuity in foreign policy.", exampleJa: "外交政策には継続性がありました。"),
        VocabularyWord(word: "intervention", meaningJa: "介入", exam: "A-Level History", level: "Basic terms", category: "Cold War", example: "Military intervention was controversial.", exampleJa: "軍事介入は物議を醸しました。"),

        // A-Level History - Meiji Restoration
        VocabularyWord(word: "modernisation", meaningJa: "近代化", exam: "A-Level History", level: "Basic terms", category: "Meiji Restoration", example: "Japan pursued rapid modernisation after 1868.", exampleJa: "日本は1868年以降、急速な近代化を追求しました。"),
        VocabularyWord(word: "industrialisation", meaningJa: "工業化", exam: "A-Level History", level: "Basic terms", category: "Meiji Restoration", example: "Industrialisation transformed Japan's economy.", exampleJa: "工業化は日本の経済を変革しました。"),
        VocabularyWord(word: "centralisation", meaningJa: "中央集権化", exam: "A-Level History", level: "Basic terms", category: "Meiji Restoration", example: "Centralisation of power was a key Meiji goal.", exampleJa: "権力の中央集権化は明治の重要な目標でした。"),
        VocabularyWord(word: "oligarchy", meaningJa: "寡頭政治", exam: "A-Level History", level: "Basic terms", category: "Meiji Restoration", example: "A small oligarchy dominated Meiji Japan.", exampleJa: "少数の寡頭政治家が明治日本を支配しました。"),
        VocabularyWord(word: "conscription", meaningJa: "徴兵制", exam: "A-Level History", level: "Basic terms", category: "Meiji Restoration", example: "Conscription created a modern national army.", exampleJa: "徴兵制により近代的な国民軍が創設されました。"),
        VocabularyWord(word: "nationalism", meaningJa: "国家主義・民族主義", exam: "A-Level History", level: "Basic terms", category: "Meiji Restoration", example: "Nationalism grew rapidly during the Meiji era.", exampleJa: "明治時代に国家主義が急速に高まりました。"),
        VocabularyWord(word: "feudalism", meaningJa: "封建制度", exam: "A-Level History", level: "Basic terms", category: "Meiji Restoration", example: "The Meiji Restoration abolished feudalism.", exampleJa: "明治維新は封建制度を廃止しました。"),
        VocabularyWord(word: "constitution", meaningJa: "憲法", exam: "A-Level History", level: "Basic terms", category: "Meiji Restoration", example: "The Meiji Constitution was promulgated in 1889.", exampleJa: "明治憲法は1889年に発布されました。"),
        VocabularyWord(word: "imperialism", meaningJa: "帝国主義", exam: "A-Level History", level: "Essay vocabulary", category: "Meiji Restoration", example: "Japan adopted imperialism to expand its territory.", exampleJa: "日本は領土を拡大するために帝国主義を採用しました。"),
        VocabularyWord(word: "westernisation", meaningJa: "西洋化", exam: "A-Level History", level: "Essay vocabulary", category: "Meiji Restoration", example: "Westernisation brought both benefits and tensions.", exampleJa: "西洋化は利益と緊張の両方をもたらしました。"),
        VocabularyWord(word: "samurai class", meaningJa: "武士階級", exam: "A-Level History", level: "Essay vocabulary", category: "Meiji Restoration", example: "The samurai class lost its privileges under Meiji reforms.", exampleJa: "武士階級は明治の改革によって特権を失いました。"),
        VocabularyWord(word: "political reform", meaningJa: "政治改革", exam: "A-Level History", level: "Essay vocabulary", category: "Meiji Restoration", example: "Political reform was central to the Meiji programme.", exampleJa: "政治改革は明治のプログラムの中心でした。"),
        VocabularyWord(word: "rapid transformation", meaningJa: "急速な変革", exam: "A-Level History", level: "Evaluation phrases", category: "Meiji Restoration", example: "Japan underwent a rapid transformation in the 19th century.", exampleJa: "日本は19世紀に急速な変革を遂げました。"),
        VocabularyWord(word: "resistance to change", meaningJa: "変革への抵抗", exam: "A-Level History", level: "Evaluation phrases", category: "Meiji Restoration", example: "There was significant resistance to change from conservatives.", exampleJa: "保守派からの変革への抵抗が大きくありました。"),

        // A-Level History - WW2
        VocabularyWord(word: "appeasement", meaningJa: "宥和政策", exam: "A-Level History", level: "Basic terms", category: "WW2", example: "Appeasement failed to prevent the outbreak of war.", exampleJa: "宥和政策は戦争の勃発を防げませんでした。"),
        VocabularyWord(word: "aggression", meaningJa: "侵略", exam: "A-Level History", level: "Basic terms", category: "WW2", example: "German aggression led to the invasion of Poland.", exampleJa: "ドイツの侵略はポーランド侵攻につながりました。"),
        VocabularyWord(word: "occupation", meaningJa: "占領", exam: "A-Level History", level: "Basic terms", category: "WW2", example: "The occupation of France lasted four years.", exampleJa: "フランスの占領は4年間続きました。"),
        VocabularyWord(word: "propaganda", meaningJa: "プロパガンダ", exam: "A-Level History", level: "Basic terms", category: "WW2", example: "Propaganda was used to control public opinion.", exampleJa: "プロパガンダは世論を操作するために使用されました。"),
        VocabularyWord(word: "totalitarianism", meaningJa: "全体主義", exam: "A-Level History", level: "Basic terms", category: "WW2", example: "Totalitarianism suppressed individual freedoms.", exampleJa: "全体主義は個人の自由を抑圧しました。"),
        VocabularyWord(word: "alliance", meaningJa: "同盟", exam: "A-Level History", level: "Basic terms", category: "WW2", example: "The Allied nations formed a powerful alliance.", exampleJa: "連合国は強力な同盟を形成しました。"),
        VocabularyWord(word: "blitzkrieg", meaningJa: "電撃戦", exam: "A-Level History", level: "Basic terms", category: "WW2", example: "Blitzkrieg tactics overwhelmed enemy defences.", exampleJa: "電撃戦の戦術は敵の防衛を圧倒しました。"),
        VocabularyWord(word: "genocide", meaningJa: "大量虐殺・ジェノサイド", exam: "A-Level History", level: "Basic terms", category: "WW2", example: "The Holocaust was an act of genocide.", exampleJa: "ホロコーストはジェノサイドの行為でした。"),
        VocabularyWord(word: "collaboration", meaningJa: "協力・協調", exam: "A-Level History", level: "Essay vocabulary", category: "WW2", example: "Collaboration with the occupying forces was controversial.", exampleJa: "占領軍との協力は物議を醸しました。"),
        VocabularyWord(word: "resistance movement", meaningJa: "抵抗運動", exam: "A-Level History", level: "Essay vocabulary", category: "WW2", example: "The resistance movement operated in secret.", exampleJa: "抵抗運動は秘密裏に活動しました。"),
        VocabularyWord(word: "turning point", meaningJa: "転換点", exam: "A-Level History", level: "Essay vocabulary", category: "WW2", example: "The Battle of Stalingrad was a turning point in the war.", exampleJa: "スターリングラード攻防戦は戦争の転換点でした。"),
        VocabularyWord(word: "unconditional surrender", meaningJa: "無条件降伏", exam: "A-Level History", level: "Essay vocabulary", category: "WW2", example: "The Allies demanded unconditional surrender.", exampleJa: "連合国は無条件降伏を要求しました。"),
        VocabularyWord(word: "war crimes", meaningJa: "戦争犯罪", exam: "A-Level History", level: "Advanced academic vocabulary", category: "WW2", example: "War crimes were prosecuted at the Nuremberg Trials.", exampleJa: "戦争犯罪はニュルンベルク裁判で訴追されました。"),
        VocabularyWord(word: "strategic bombing", meaningJa: "戦略爆撃", exam: "A-Level History", level: "Advanced academic vocabulary", category: "WW2", example: "Strategic bombing targeted industrial centres.", exampleJa: "戦略爆撃は産業の中心地を標的にしました。"),

        // A-Level Geography
        VocabularyWord(word: "erosion", meaningJa: "侵食", exam: "A-Level Geography", level: "Basic terms", category: "Coastal environments", example: "Coastal erosion threatens many communities.", exampleJa: "海岸侵食が多くのコミュニティを脅かしています。"),
        VocabularyWord(word: "deposition", meaningJa: "堆積", exam: "A-Level Geography", level: "Basic terms", category: "Coastal environments", example: "Deposition creates new landforms.", exampleJa: "堆積が新しい地形を作り出します。"),
        VocabularyWord(word: "longshore drift", meaningJa: "沿岸漂砂", exam: "A-Level Geography", level: "Basic terms", category: "Coastal environments", example: "Longshore drift moves sediment along the coast.", exampleJa: "沿岸漂砂が海岸に沿って堆積物を移動させます。"),
        VocabularyWord(word: "dynamic equilibrium", meaningJa: "動的平衡", exam: "A-Level Geography", level: "Essay vocabulary", category: "Coastal environments", example: "Coastal systems exist in dynamic equilibrium.", exampleJa: "海岸システムは動的平衡の中に存在しています。"),
        VocabularyWord(word: "vulnerability", meaningJa: "脆弱性", exam: "A-Level Geography", level: "Basic terms", category: "Hazardous environments", example: "Vulnerability varies between communities.", exampleJa: "脆弱性はコミュニティによって異なります。"),
        VocabularyWord(word: "resilience", meaningJa: "回復力", exam: "A-Level Geography", level: "Basic terms", category: "Hazardous environments", example: "Building resilience is key to disaster management.", exampleJa: "回復力を築くことが災害管理の鍵です。"),
        VocabularyWord(word: "mitigation", meaningJa: "被害軽減", exam: "A-Level Geography", level: "Essay vocabulary", category: "Hazardous environments", example: "Mitigation strategies can reduce the impact of disasters.", exampleJa: "被害軽減戦略は災害の影響を減らすことができます。"),
        VocabularyWord(word: "globalisation", meaningJa: "グローバル化", exam: "A-Level Geography", level: "Basic terms", category: "Global interdependence", example: "Globalisation has connected economies worldwide.", exampleJa: "グローバル化が世界中の経済をつなげました。"),
        VocabularyWord(word: "interdependence", meaningJa: "相互依存", exam: "A-Level Geography", level: "Essay vocabulary", category: "Global interdependence", example: "Economic interdependence has increased.", exampleJa: "経済的相互依存が増加しました。"),
        VocabularyWord(word: "multiplier effect", meaningJa: "乗数効果", exam: "A-Level Geography", level: "Essay vocabulary", category: "Economic transition", example: "Tourism creates a multiplier effect in local economies.", exampleJa: "観光は地域経済に乗数効果を生み出します。"),
        VocabularyWord(word: "sustainable tourism", meaningJa: "持続可能な観光", exam: "A-Level Geography", level: "Case study vocabulary", category: "Tourism", example: "Sustainable tourism protects natural resources.", exampleJa: "持続可能な観光は自然資源を守ります。"),
        VocabularyWord(word: "foreign direct investment", meaningJa: "海外直接投資", exam: "A-Level Geography", level: "Advanced academic vocabulary", category: "Economic transition", example: "Foreign direct investment drives economic growth.", exampleJa: "海外直接投資が経済成長を推進します。"),
        VocabularyWord(word: "transnational corporation", meaningJa: "多国籍企業", exam: "A-Level Geography", level: "Essay vocabulary", category: "Global interdependence", example: "Transnational corporations operate across borders.", exampleJa: "多国籍企業は国境を越えて事業を展開しています。"),
        VocabularyWord(word: "trade liberalisation", meaningJa: "貿易自由化", exam: "A-Level Geography", level: "Advanced academic vocabulary", category: "Economic transition", example: "Trade liberalisation has benefits and drawbacks.", exampleJa: "貿易自由化には利点と欠点があります。"),
        VocabularyWord(word: "debt relief", meaningJa: "債務救済", exam: "A-Level Geography", level: "Case study vocabulary", category: "Economic transition", example: "Debt relief helps developing countries.", exampleJa: "債務救済は発展途上国を助けます。"),
        VocabularyWord(word: "economic diversification", meaningJa: "経済の多角化", exam: "A-Level Geography", level: "Advanced academic vocabulary", category: "Economic transition", example: "Economic diversification reduces dependency on one sector.", exampleJa: "経済の多角化は一つの部門への依存を減らします。"),
        VocabularyWord(word: "weathering", meaningJa: "風化", exam: "A-Level Geography", level: "Basic terms", category: "Coastal environments", example: "Weathering breaks down rocks over time.", exampleJa: "風化は時間をかけて岩を崩壊させます。"),
        VocabularyWord(word: "storm surge", meaningJa: "高潮", exam: "A-Level Geography", level: "Basic terms", category: "Hazardous environments", example: "A storm surge can flood coastal areas.", exampleJa: "高潮は沿岸地域を浸水させることがあります。"),
        VocabularyWord(word: "prediction", meaningJa: "予測", exam: "A-Level Geography", level: "Evaluation phrases", category: "Hazardous environments", example: "Accurate prediction saves lives.", exampleJa: "正確な予測は命を救います。"),
        VocabularyWord(word: "preparedness", meaningJa: "備え", exam: "A-Level Geography", level: "Evaluation phrases", category: "Hazardous environments", example: "Preparedness is essential for natural disasters.", exampleJa: "自然災害に対する備えは不可欠です。")
    ]


    static let examTypes: [String] = [
        "IELTS",
        "TOEIC",
        "TOEFL",
        "Eiken",
        "Academic",
        "Business",
        "Daily",
        "A-Level History",
        "A-Level Geography"
    ]

    static let levelsByExam: [String: [String]] = [
        "IELTS": ["Band 5.0", "Band 6.0", "Band 7.0", "Band 8.0+"],
        "TOEIC": ["400-600", "600-750", "750-850", "850+"],
        "TOEFL": ["60-80", "80-100", "100-120"],
        "Eiken": ["Grade 2", "Pre-1", "Grade 1"],
        "Academic": ["Advanced"],
        "Business": ["Intermediate", "Advanced"],
        "Daily": ["Beginner", "Intermediate"],
        "A-Level History": ["Basic terms", "Essay vocabulary", "Evaluation phrases", "Case study vocabulary", "Advanced academic vocabulary"],
        "A-Level Geography": ["Basic terms", "Essay vocabulary", "Evaluation phrases", "Case study vocabulary", "Advanced academic vocabulary"]
    ]

    static let categoriesByExam: [String: [String]] = [
        "IELTS": ["Environment", "Technology", "Economy", "Education", "Health", "Politics", "General"],
        "TOEIC": ["Business", "Travel", "Technology"],
        "Academic": ["Education", "General"],
        "A-Level History": ["Cold War", "Meiji Restoration", "WW2", "Historiography"],
        "A-Level Geography": ["Coastal environments", "Hazardous environments", "Global interdependence", "Economic transition", "Tourism"]
    ]

    static func getWordsForExam(exam: String, level: String? = nil, category: String? = nil) -> [VocabularyWord] {
        words.filter { word in
            let examMatch = word.exam == exam
            let levelMatch = level == nil || level == "" || word.level == level
            let categoryMatch = category == nil || category == "" || word.category == category
            return examMatch && levelMatch && categoryMatch
        }
    }
}
