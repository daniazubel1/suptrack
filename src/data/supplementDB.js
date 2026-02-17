export const supplementDB = [
    {
        id: 'vit-d3',
        name: 'Vitamin D3',
        aliases: ['vitamin d', 'vit d', 'd3'],
        description: 'Often called the "sunshine vitamin", Vitamin D3 is actually a hormone precursor that plays a critical role in calcium absorption and bone mineralization. Beyond bones, it regulates immune function, mood, and testosterone levels. Deficiency is widespread, especially in those with limited sun exposure.',
        benefits: ['Bone Health', 'Immune Support', 'Mood Regulation', 'Testosterone Support'],
        dosage: '2,000 - 5,000 IU',
        bestTime: 'Morning',
        foodReq: 'with-food',
        frequency: 'Daily',
        warning: 'Fat-soluble; take with a meal containing fat for absorption.',
        category: 'General Health'
    },
    {
        id: 'omega-3',
        name: 'Omega 3',
        aliases: ['fish oil', 'epa', 'dha', 'krill oil'],
        description: 'Omega-3 fatty acids, specifically EPA and DHA, are essential fats that the body cannot produce on its own. They are fundamental components of cell membranes and have profound anti-inflammatory effects. They support cardiovascular health, cognitive function, and joint mobility.',
        benefits: ['Heart Health', 'Brain Function', 'Joint Support', 'Inflammation Reduction'],
        dosage: '1,000 - 2,000 mg (EPA/DHA)',
        bestTime: 'Any',
        foodReq: 'with-food',
        frequency: 'Daily',
        warning: 'Take with food to avoid "fish burps".',
        category: 'General Health'
    },
    {
        id: 'nmn',
        name: 'NMN',
        aliases: ['nicotinamide mononucleotide'],
        description: 'Nicotinamide Mononucleotide (NMN) is a direct precursor to NAD+, a coenzyme essential for cellular energy production and DNA repair. NAD+ levels decline with age, and NMN supplementation aims to restore these levels, potentially slowing aging processes and improving metabolic markers.',
        benefits: ['Anti-Aging', 'Energy Levels', 'Cellular Repair', 'Metabolic Health'],
        dosage: '250 - 500 mg',
        bestTime: 'Morning',
        foodReq: 'empty-stomach',
        frequency: 'Daily',
        warning: 'Best taken in the morning on an empty stomach for optimal absorption.',
        category: 'Longevity'
    },
    {
        id: 'coq10',
        name: 'CoQ10',
        aliases: ['q10', 'ubiquinone', 'ubiquinol'],
        description: 'Coenzyme Q10 is a powerful antioxidant found in every cell of the body, concentrated in the mitochondria. It is crucial for generating energy (ATP) and protecting cells from oxidative damage. Levels decrease with age and statin use, making supplementation vital for heart health and energy.',
        benefits: ['Heart Health', 'Energy Production', 'Antioxidant', 'Migraine Relief'],
        dosage: '100 - 200 mg',
        bestTime: 'Morning',
        foodReq: 'with-food',
        frequency: 'Daily',
        warning: 'Fat-soluble; absorption is significantly better with food.',
        category: 'Longevity'
    },
    {
        id: 'magnesium',
        name: 'Magnesium',
        aliases: ['magnesium glycinate', 'magnesium citrate', 'magnesium threonate'],
        description: 'Magnesium is an essential mineral involved in over 300 enzymatic reactions, including energy production, muscle function, and nervous system regulation. It is notoriously difficult to get enough from diet alone. Glycinate forms are particularly effective for promoting relaxation and sleep.',
        benefits: ['Sleep Quality', 'Muscle Relaxation', 'Nervous System', 'Bone Health'],
        dosage: '200 - 400 mg',
        bestTime: 'Night',
        foodReq: 'any',
        frequency: 'Daily',
        warning: 'Some forms (citrate) can have a laxative effect. Glycinate is best for sleep.',
        category: 'General Health'
    },
    {
        id: 'potassium',
        name: 'Potassium',
        aliases: ['k'],
        description: 'Potassium is a vital mineral and electrolyte that helps maintain fluid balance, nerve signals, and muscle contractions. It works in opposition to sodium to regulate blood pressure. adequate intake is crucial for cardiovascular health and preventing muscle cramps.',
        benefits: ['Blood Pressure', 'Muscle Contraction', 'Nerve Signals', 'Water Balance'],
        dosage: '3,500 - 4,700 mg (Total Intake)',
        bestTime: 'Any',
        foodReq: 'with-food',
        frequency: 'Daily',
        warning: 'Take with food and water to avoid stomach upset.',
        category: 'General Health'
    },
    {
        id: 'zinc',
        name: 'Zinc',
        aliases: ['zinc picolinate', 'zinc gluconate'],
        description: 'Zinc is a trace mineral essential for the immune system, DNA synthesis, and cell division. It plays a key role in wound healing and testosterone production. Since the body doesn\'t store zinc, consistent daily intake is necessary.',
        benefits: ['Immune System', 'Testosterone', 'Skin Health', 'Wound Healing'],
        dosage: '15 - 30 mg',
        bestTime: 'Any',
        foodReq: 'with-food',
        frequency: 'Daily',
        warning: 'Do NOT take on an empty stomach; causes nausea.',
        category: 'General Health'
    },
    {
        id: 'vit-c',
        name: 'Vitamin C',
        aliases: ['ascorbic acid'],
        description: 'Vitamin C is a potent water-soluble antioxidant that protects cells from free radical damage. It is strictly required for the biosynthesis of collagen, L-carnitine, and certain neurotransmitters. It also enhances non-heme iron absorption.',
        benefits: ['Immune Support', 'Collagen Production', 'Antioxidant', 'Iron Absorption'],
        dosage: '500 - 1,000 mg',
        bestTime: 'Morning',
        foodReq: 'any',
        frequency: 'Daily',
        warning: 'High doses can cause digestive issues.',
        category: 'Immunity'
    },
    {
        id: 'lions-mane',
        name: "Lion's Mane",
        aliases: ['lions main', 'mushroom'],
        description: 'Lion\'s Mane is a medicinal mushroom with a long history of use in traditional medicine. Modern research highlights its potential to stimulate the production of Nerve Growth Factor (NGF), which may improve brain function, memory, and nerve regeneration.',
        benefits: ['Focus & Memory', 'Nerve Growth', 'Mood Support', 'Cognitive Health'],
        dosage: '500 - 1,000 mg',
        bestTime: 'Morning',
        foodReq: 'any',
        frequency: 'Daily',
        warning: 'Consistent daily use is required for benefits.',
        category: 'Nootropic'
    },
    {
        id: 'ashwagandha',
        name: 'Ashwagandha',
        aliases: ['ksm-66', 'sensoril'],
        description: 'Ashwagandha is one of the most important herbs in Ayurveda, classified as an adaptogen. It helps the body cope with physical and mental stress by lowering cortisol levels. It is also used to improve sleep quality and support reproductive health.',
        benefits: ['Stress Reduction', 'Sleep Quality', 'Testosterone', 'Cortisol Control'],
        dosage: '300 - 600 mg',
        bestTime: 'Night',
        foodReq: 'any',
        frequency: 'Daily',
        warning: 'Can be sedating; often best taken in the evening.',
        category: 'Stress & Sleep'
    },
    {
        id: 'quercetin',
        name: 'Quercetin',
        aliases: [],
        description: 'Quercetin is a flavonoid pigment found in many fruits and vegetables. It acts as a zinc ionophore (helping zinc enter cells) and has significant anti-inflammatory and antihistamine properties, making it useful for allergy relief and immune support.',
        benefits: ['Immune Support', 'Anti-Inflammatory', 'Allergy Relief', 'Exercise Performance'],
        dosage: '500 mg',
        bestTime: 'Morning',
        foodReq: 'with-food',
        frequency: 'Daily',
        warning: 'Best absorbed when taken with bromelain or Vitamin C.',
        category: 'Immunity'
    },
    // Additional Recommendations
    {
        id: 'creatine',
        name: 'Creatine Monohydrate',
        aliases: ['creatine'],
        description: 'Creatine is the most extensively studied supplement for sports performance. It increases the body\'s stores of phosphocreatine, which is used to produce new ATP during high-intensity exercise. It improves strength, power output, and muscle mass.',
        benefits: ['Muscle Strength', 'Power Output', 'Brain Function', 'Recovery'],
        dosage: '5 g',
        bestTime: 'Post-Workout',
        foodReq: 'any',
        frequency: 'Daily',
        warning: 'Ensure adequate water intake.',
        category: 'Performance'
    },
    {
        id: 'whey',
        name: 'Whey Protein',
        aliases: ['protein powder'],
        description: 'Whey protein is a complete protein source derived from milk, containing all nine essential amino acids. It is particularly high in leucine, which stimulates muscle protein synthesis. It is rapidly digested, making it ideal for post-workout recovery.',
        benefits: ['Muscle Recovery', 'Protein Synthesis', 'Satiety'],
        dosage: '20 - 25 g',
        bestTime: 'Post-Workout',
        foodReq: 'any',
        frequency: 'Workout Days',
        warning: 'Contains dairy (unless isolate/hydrolysate).',
        category: 'Performance'
    },
    {
        id: 'resveratrol',
        name: 'Resveratrol',
        aliases: [],
        description: 'Resveratrol is a plant compound acting like an antioxidant. It is found in red wine, grapes, and berries. It is researched for its potential to mimic the longevity benefits of calorie restriction by activating specific genes called sirtuins.',
        benefits: ['Longevity', 'Heart Health', 'Anti-Inflammatory'],
        dosage: '500 - 1,000 mg',
        bestTime: 'Morning',
        foodReq: 'with-food',
        frequency: 'Daily',
        warning: 'Combine with fat (yogurt/oil) for absorption.',
        category: 'Longevity'
    }
];

export function enrichSupplement(userSup) {
    // Normalize user input for matching
    const inputName = userSup.name.toLowerCase().trim();

    const match = supplementDB.find(dbSup => {
        // Exact match
        if (dbSup.name.toLowerCase() === inputName) return true;
        // Alias match
        if (dbSup.aliases.some(alias => inputName.includes(alias))) return true;
        return false;
    });

    if (match) {
        return {
            ...userSup,
            description: match.description,
            benefits: match.benefits,
            foodReq: match.foodReq,
            warning: match.warning,
            // Only suggest timing if user hasn't set specific one already (or if it's 'any')
            // but we shouldn't overwrite user preference forcefully, just identifying.
            recommendedTime: match.bestTime
        };
    }

    return userSup;
}
