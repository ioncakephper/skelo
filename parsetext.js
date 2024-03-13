// A function that takes a paragraph as a string and returns an array of phrases
function parseParagraph(paragraph) {
    // Split the paragraph into sentences using a regular expression
    var sentences = paragraph.match(/[^.!?]+[.!?]+/g);
    // Initialize an empty array to store the phrases
    var phrases = [];
    // Loop through each sentence
    for (var i = 0; i < sentences.length; i++) {
        // Split the sentence into words using a regular expression
        var words = sentences[i].match(/[-\w()']+/g);
        // Initialize an empty array to store the current phrase
        var phrase = [];
        // Loop through each word
        for (var j = 0; j < words.length; j++) {
            // Add the word to the current phrase
            phrase.push(words[j]);
            // Check if the word is followed by a punctuation mark or the end of the sentence
            if (/[,.:;!?]/.test(sentences[i][j + words[j].length + 1]) || j == words.length - 1) {
                // Join the words in the current phrase with spaces
                var phraseString = phrase.join(" ");
                // Add the current phrase to the phrases array
                phrases.push(phraseString);
                // Reset the current phrase to an empty array
                phrase = [];
            }
        }
    }
    // Return the phrases array
    return phrases;
}

// A function that takes a phrase as a string and returns its grammatical structure as an array
function getGrammaticalStructure(phrase) {
    // Initialize an empty array to store the grammatical structure
    var structure = [];
    // Split the phrase into words using a regular expression
    var words = phrase.match(/[-\w()']+/g);
    // Loop through each word
    for (var i = 0; i < words.length; i++) {
        // Initialize a variable to store the part of speech of the word
        var partOfSpeech = "";
        // Check if the word is a noun using a regular expression
        if (/\b(a|an|the|this|that|my|your|his|her|its|our|their|one|two|three|four|five|six|seven|eight|nine|ten|what|which|who|whom|whose|where|when|why|how|someone|something)\b/i.test(words[i])) {
            partOfSpeech = "Noun";
        }
        // Check if the word is a verb using a regular expression
        else if (/\b(be|have|do|can|will|shall|may|might|must|should|would|could|dare|need|used|to)\b/i.test(words[i])) {
            partOfSpeech = "Verb";
        }
        // Check if the word is an adjective using a regular expression
        else if (/\b(good|bad|big|small|large|little|long|short|high|low|deep|shallow|wide|narrow|thick|thin|heavy|light|strong|weak|hard|soft|hot|cold|warm|cool|new|old|young|old|early|late|soon|late|near|far|close|distant|easy|difficult|simple|complex|clear|vague|loud|quiet|noisy|silent|fast|slow|quick|slow|rapid|gradual|early|late|soon|late|brief|long|short|sudden|gradual|old|new|modern|ancient|future|past|present|old-fashioned|contemporary|fresh|stale|rotten|ripe|raw|cooked|burnt|frozen|live|dead|healthy|ill|sick|well|strong|weak|brave|cowardly|bold|timid|shy|confident|proud|modest|humble|arrogant|conceited|vain|generous|mean|stingy|kind|cruel|gentle|rough|polite|rude|friendly|unfriendly|hostile|pleasant|unpleasant|nice|nasty|beautiful|ugly|pretty|handsome|attractive|plain|gorgeous|stunning|lovely|cute|charming|elegant|graceful|clumsy|awkward|skillful|skilled|talented|gifted|able|unable|capable|incapable|clever|smart|intelligent|bright|brilliant|dull|stupid|foolish|silly|wise|unwise|sensible|sensitive|insensitive|careful|careless|cautious|rash|reckless|responsible|irresponsible|mature|immature|serious|frivolous|funny|humorous|amusing|dull|boring|tedious|fascinating|interesting|exciting|thrilling|calm|quiet|peaceful|noisy|loud|rowdy|wild|tranquil|serene|restful|restless|nervous|anxious|tense|relaxed|comfortable|uncomfortable|cozy|snug|roomy|spacious|cramped|crowded|empty|full|clean|dirty|tidy|messy|neat|orderly|chaotic|confused|clear|obvious|plain|simple|easy|difficult|hard|challenging|demanding|tough|rough|smooth|soft|hard|firm|solid|liquid|gas|fluid|dry|wet|damp|moist|humid|arid|dry|sunny|cloudy|rainy|windy|stormy|snowy|foggy|smoggy|hazy|clear|bright|dark|dim|gloomy|cheerful|happy|glad|pleased|satisfied|dissatisfied|unhappy|sad|sorrowful|miserable|depressed|gloomy|blue|down|low|up|high|elated|ecstatic|delighted|thrilled|joyful|joyous|jubilant|proud|ashamed|guilty|innocent|blameless|faultless|perfect|imperfect|flawed|defective|broken|damaged|injured|hurt|wounded|healthy|fit|well|strong|weak|feeble|frail|delicate|sturdy|robust|sound|unsound|reliable|unreliable|dependable|independent|free|bound|tied|loose|tight|narrow|wide|broad|slim|thin|skinny|fat|plump|obese|overweight|underweight|normal|average|standard|usual|ordinary|common|regular|typical|atypical|unusual|odd|strange|weird|peculiar|curious|bizarre|queer|funny|amusing|comic|comical|humorous|witty|ironic|sarcastic|satirical|mocking|ridiculing|scornful|sneering|contemptuous|disdainful|respectful|admiring|approving|appreciative|grateful|thankful|indebted|obliged|owing|due|payable|receivable|paid)\b/i.test(words[i])) {
            partOfSpeech = "Adjective";
        }
        // Add the word and its part of speech to the structure array
        structure.push([words[i], partOfSpeech]);
    }
    // Return the structure array
    return structure;
}

let p = `That is a loud sound. This is my first paragraph. I'm learning how to parse text.`;

let paragraphs = parseParagraph(p);
console.log(JSON.stringify(paragraphs, null, 4));

paragraphs.forEach(p => {
    let structure = getGrammaticalStructure(p);
    console.log(JSON.stringify(structure, null, 4));
})
