document.addEventListener('DOMContentLoaded', () => {
    // --- Customizable Content (for Admins) ---
    const CUSTOM_CONTENT = {
        mainTitle: "Key Stage 3 Online Assessment - Mona Teaches",
        infoHeading: "Start Your Assessment",
        infoInstructions: "Please provide the following information to begin the assessment:",
        assessmentIntro: "The assessment has a 15 minute time limit. It will automatically submit once this time expires.",
        securityCheckText: "Please complete the security check above to enable the 'Start Assessment' button.",
        resultsHeading: "Assessment Results",
        emailSending: "Sending your detailed results email...",
        emailSentSuccess: "Email sent successfully! Please check your inbox (and spam folder).",
        emailFailed: "Failed to send email. Please contact support if this persists.",
        networkError: "Failed to send email: Network error. Please check your connection.",
        timeUpMessage: "Time's up! Your assessment has been automatically submitted.",
        expectationsBelow: "Below Expectations",
        expectationsMeets: "Meets Expectations",
        expectationsAbove: "Above Expectations",
        resultsEmailMessage: "Your full detailed results have been sent to your email address." // New custom message
    };

    // Apply customizable content
    document.getElementById('mainTitle').textContent = CUSTOM_CONTENT.mainTitle;
    document.getElementById('mainTitleReplicated').textContent = CUSTOM_CONTENT.mainTitle; // Update h1 as well
    document.getElementById('infoHeading').textContent = CUSTOM_CONTENT.infoHeading;
    document.getElementById('infoInstructions').textContent = CUSTOM_CONTENT.infoInstructions;
    document.getElementById('assessmentIntro').textContent = CUSTOM_CONTENT.assessmentIntro;
    document.getElementById('securityCheckText').textContent = CUSTOM_CONTENT.securityCheckText;
    document.getElementById('resultsHeading').textContent = CUSTOM_CONTENT.resultsHeading;


    // --- Elements ---
    const infoCollectionDiv = document.getElementById('infoCollection');
    const infoForm = document.getElementById('infoForm');
    const startAssessmentBtn = document.getElementById('startAssessmentBtn');
    const assessmentSectionDiv = document.getElementById('assessmentSection');
    const assessmentForm = document.getElementById('assessmentForm');
    const questionsContainer = document.getElementById('questionsContainer');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const submitAssessmentBtn = document.getElementById('submitAssessmentBtn');
    const resultsDiv = document.getElementById('results');
    const detailedResultsDiv = document.getElementById('detailedResults'); // This will be cleared
    const overallScoreElement = document.getElementById('overallScore');
    const overallExpectationsElement = document.getElementById('overallExpectations');
    const timerDisplay = document.getElementById('time');
    const emailStatus = document.getElementById('emailStatus');
    const currentQNumSpan = document.getElementById('currentQNum');
    const totalQNumSpan = document.getElementById('totalQNum');


    // --- User Info Storage ---
    let parentName = '';
    let childName = '';
    let parentEmail = '';

    let assessmentTextResults = ''; // To store plain text results for emailing
    let assessmentHtmlResults = ''; // To store HTML results for emailing
    const CURRENT_KEY_STAGE = "Key Stage 3"; // Define the current Key Stage

    // --- Timer Variables ---
    const totalTime = 15 * 60; // 15 minutes in seconds
    let timeLeft = totalTime;
    let timerInterval;
    let assessmentSubmittedByTime = false; // Flag to check if submitted by timer

    // --- Assessment Data (Extracted from your index.html and corrected with your provided answers) ---
    const questions = [
	  {
		"id": "q1",
		"type": "text",
		"topicHeading": "English - Grammar (Clauses)",
		"question": "Identify the subordinate clause in the following sentence: \"Although it was raining, we still went for a walk.\"",
		"correctAnswer": "Although it was raining",
		"explanation": "A subordinate clause, also known as a dependent clause, cannot stand alone as a complete sentence. 'Although it was raining' depends on the main clause 'we still went for a walk' for its full meaning."
	  },
	  {
		"id": "q2",
		"type": "text",
		"topicHeading": "English - Grammar (Voice)",
		"question": "Change the following sentence from active to passive voice: \"The dog chased the cat.\"",
		"correctAnswer": "The cat was chased by the dog.",
		"explanation": "In passive voice, the object of the active sentence becomes the subject, and the action is performed by a form of 'to be' + past participle. The original subject is often introduced with 'by'."
	  },
	  {
		"id": "q3",
		"type": "radio",
		"topicHeading": "English - Literary Devices (Simile)",
		"question": "Which of these is an example of a simile?",
		"options": {
		  "a": "The car flew down the road.",
		  "b": "Her smile was as bright as the sun.",
		  "c": "Time is a thief."
		},
		"correctAnswer": "b",
		"correctAnswerDisplay": "Her smile was as bright as the sun."
	  },
	  {
		"id": "q4",
		"type": "text",
		"topicHeading": "English - Punctuation",
		"question": "Add the correct punctuation to this sentence: \"The teacher asked who was ready for the test\"",
		"correctAnswer": "The teacher asked, \"Who was ready for the test?\"",
		"explanation": "Direct speech requires quotation marks around the spoken words and a comma before the opening quotation mark. The question mark goes inside the quotation marks because the quoted part is a question."
	  },
	  {
		"id": "q5",
		"type": "radio",
		"topicHeading": "English - Vocabulary (Antonyms)",
		"question": "What is an antonym for 'benevolent'?",
		"options": {
		  "a": "kind",
		  "b": "generous",
		  "c": "malevolent"
		},
		"correctAnswer": "c",
		"correctAnswerDisplay": "malevolent"
	  },
	  {
		"id": "q6",
		"type": "text",
		"topicHeading": "English - Grammar (Subject-Verb Agreement)",
		"question": "Correct the grammatical error in this sentence: \"He don't like broccoli.\"",
		"correctAnswer": "He doesn't like broccoli.",
		"explanation": "For third-person singular subjects (he, she, it), the correct form of 'do not' is 'does not' or 'doesn't'."
	  },
	  {
		"id": "q7",
		"type": "text",
		"topicHeading": "English - Word Structure (Prefixes)",
		"question": "Identify the prefix in the word 'unbelievable'.",
		"correctAnswer": "un",
		"explanation": "A prefix is a morpheme added to the beginning of a word to alter its meaning. 'Un-' means 'not' or 'opposite of'."
	  },
	  {
		"id": "q8",
		"type": "radio",
		"topicHeading": "English - Punctuation (Semicolons)",
		"question": "Which sentence uses a semicolon correctly?",
		"options": {
		  "a": "I like apples; she likes oranges.",
		  "b": "He went to the park; and played.",
		  "c": "She likes to read; sing and dance."
		},
		"correctAnswer": "a",
		"correctAnswerDisplay": "I like apples; she likes oranges."
	  },
	  {
		"id": "q9",
		"type": "radio",
		"topicHeading": "English - Homophones",
		"question": "Which sentence correctly explains the difference between 'there', 'their', and 'they're'?",
		"options": {
		  "a": "'There' indicates a place, 'their' shows possession, 'they're' is a contraction of 'they are'.",
		  "b": "'Their' indicates a place, 'there' shows possession, 'they're' is a contraction of 'they are'.",
		  "c": "'They're' indicates a place, 'there' shows possession, 'their' is a contraction of 'they are'.",
		  "d": "All three words can be used interchangeably."
		},
		"correctAnswer": "a",
		"correctAnswerDisplay": "'There' indicates a place, 'their' shows possession, 'they're' is a contraction of 'they are'."
	  },
	  {
		"id": "q10",
		"type": "text",
		"topicHeading": "English - Parts of Speech (Adjectives)",
		"question": "Identify the adjective in: \"The tall building stood majestically.\"",
		"correctAnswer": "tall",
		"explanation": "An adjective describes a noun. 'Tall' describes the 'building'."
	  },
	  {
		"id": "q11",
		"type": "radio",
		"topicHeading": "English - Homophones",
		"question": "Choose the correct homophone: \"I need to (buy/by) some milk.\"",
		"options": {
		  "a": "buy",
		  "b": "by"
		},
		"correctAnswer": "a",
		"correctAnswerDisplay": "buy"
	  },
	  {
		"id": "q12",
		"type": "radio",
		"topicHeading": "English - Figurative Language (Idioms)",
		"question": "What does the idiom \"to bite the bullet\" mean?",
		"options": {
		  "a": "To literally bite a metal object.",
		  "b": "To face a difficult or unpleasant situation with courage and endurance.",
		  "c": "To quickly solve a problem.",
		  "d": "To give up easily."
		},
		"correctAnswer": "b",
		"correctAnswerDisplay": "To face a difficult or unpleasant situation with courage and endurance."
	  },
	  {
		"id": "q13",
		"type": "text",
		"topicHeading": "English - Spelling",
		"question": "Correct the spelling: \"necessery\"",
		"correctAnswer": "necessary",
		"explanation": "The correct spelling is 'necessary'."
	  },
	  {
		"id": "q14",
		"type": "text",
		"topicHeading": "English - Sentence Structure (Compound Sentences)",
		"question": "Form a compound sentence from: \"The sun was setting. The sky turned orange.\"",
		"correctAnswer": "The sun was setting, and the sky turned orange.",
		"explanation": "A compound sentence joins two independent clauses, often with a coordinating conjunction like 'and' or a semicolon."
	  },
	  {
		"id": "q15",
		"type": "radio",
		"topicHeading": "English - Word Usage (Affect vs. Effect)",
		"question": "Is \"affect\" or \"effect\" used correctly: \"The rain will (affect/effect) our plans.\"",
		"options": {
		  "a": "affect",
		  "b": "effect"
		},
		"correctAnswer": "a",
		"correctAnswerDisplay": "affect"
	  },
	  {
		"id": "q16",
		"type": "text",
		"topicHeading": "Mathematics - Algebra (Simplifying Expressions)",
		"question": "Simplify the expression: 3a + 5b - a + 2b",
		"correctAnswer": "2a + 7b",
		"explanation": "Combine like terms: (3a - a) + (5b + 2b) = 2a + 7b."
	  },
	  {
		"id": "q17",
		"type": "number",
		"topicHeading": "Mathematics - Algebra (Solving Equations)",
		"question": "Solve for x: 2x + 7 = 15",
		"correctAnswer": 4,
		"explanation": "Subtract 7 from both sides: 2x = 8. Divide by 2: x = 4."
	  },
	  {
		"id": "q18",
		"type": "number",
		"topicHeading": "Mathematics - Number (Powers/Exponents)",
		"question": "What is the value of 5³ (5 cubed)?",
		"correctAnswer": 125,
		"explanation": "5³ means 5 * 5 * 5 = 25 * 5 = 125."
	  },
	  {
		"id": "q19",
		"type": "number",
		"topicHeading": "Mathematics - Fractions",
		"question": "Calculate 3/5 of 100.",
		"correctAnswer": 60,
		"explanation": "(3/5) * 100 = (3 * 100) / 5 = 300 / 5 = 60."
	  },
	  {
		"id": "q20",
		"type": "text",
		"topicHeading": "Mathematics - Probability",
		"question": "If a bag contains 5 red balls, 3 blue balls, and 2 green balls, what is the probability of picking a blue ball?",
		"correctAnswer": "3/10",
		"explanation": "There are 3 blue balls and a total of 5 + 3 + 2 = 10 balls. Probability = (Number of favorable outcomes) / (Total number of outcomes) = 3/10."
	  },
	  {
		"id": "q21",
		"type": "number",
		"topicHeading": "Mathematics - Geometry (Area)",
		"question": "Find the area of a rectangle with length 8 cm and width 5 cm.",
		"correctAnswer": 40,
		"explanation": "Area of a rectangle = length × width. So, 8 cm * 5 cm = 40 cm²."
	  },
	  {
		"id": "q22",
		"type": "number",
		"topicHeading": "Mathematics - Decimals & Percentages",
		"question": "Convert 0.75 into a percentage.",
		"correctAnswer": 75,
		"explanation": "To convert a decimal to a percentage, multiply by 100. So, 0.75 * 100 = 75%."
	  },
	  {
		"id": "q23",
		"type": "number",
		"topicHeading": "Mathematics - Percentages (Discounts)",
		"question": "A jacket costs £60. If it has a 20% discount, what is its new price?",
		"correctAnswer": 48,
		"explanation": "A 20% discount means you pay 80% of the original price. 0.80 * £60 = £48."
	  },
	  {
		"id": "q24",
		"type": "number",
		"topicHeading": "Mathematics - Geometry (Angles/Polygons)",
		"question": "What is the size of each interior angle of a regular octagon?",
		"image": "images/octagon.png",
		"imageAlt": "Image of a regular octagon.",
		"correctAnswer": 135,
		"explanation": "The formula for the interior angle of a regular polygon is ((n-2) * 180) / n, where n is the number of sides. For an octagon, n=8. So, ((8-2) * 180) / 8 = (6 * 180) / 8 = 1080 / 8 = 135 degrees."
	  },
	  {
		"id": "q25",
		"type": "text",
		"topicHeading": "Mathematics - Algebra (Expanding & Simplifying)",
		"question": "Expand and simplify: 2(x + 3) + 4x",
		"correctAnswer": "6x + 6",
		"explanation": "Distribute the 2: 2x + 6 + 4x. Combine like terms: 6x + 6."
	  },
	  {
		"id": "q26",
		"type": "number",
		"topicHeading": "Mathematics - Number (Pi)",
		"question": "What is the value of pi (π) to two decimal places?",
		"correctAnswer": 3.14,
		"explanation": "Pi (π) is approximately 3.14159..., so to two decimal places, it is 3.14."
	  },
	  {
		"id": "q27",
		"type": "number",
		"topicHeading": "Mathematics - Ratio & Proportion (Scale)",
		"question": "A map has a scale of 1:1000. If a building is 5 cm long on the map, what is its real length in meters?",
		"correctAnswer": 50,
		"explanation": "The real length is 5 cm * 1000 = 5000 cm. Since 1 meter = 100 cm, 5000 cm = 50 meters."
	  },
	  {
		"id": "q28",
		"type": "number",
		"topicHeading": "Mathematics - Geometry (Volume)",
		"question": "Calculate the volume of a cuboid with length 4 cm, width 3 cm, and height 2 cm.",
		"correctAnswer": 24,
		"explanation": "Volume of a cuboid = length × width × height. So, 4 cm * 3 cm * 2 cm = 24 cm³."
	  },
	  {
		"id": "q29",
		"type": "number",
		"topicHeading": "Mathematics - Sequences",
		"question": "What is the next number in the sequence: 1, 4, 9, 16, ___?",
		"correctAnswer": 25,
		"explanation": "This sequence consists of perfect squares: 1²=1, 2²=4, 3²=9, 4²=16. The next number is 5²=25."
	  },
	  {
		"id": "q30",
		"type": "text",
		"topicHeading": "Mathematics - Algebra (Inequalities)",
		"question": "Solve the inequality: 3x - 5 < 10",
		"correctAnswer": "x < 5",
		"explanation": "Add 5 to both sides: 3x < 15. Divide by 3: x < 5."
	  }
	];

    let userAnswers = {};
    let currentQuestionIndex = 0;

    // --- Functions ---

    // Progress Indicator Update
    function updateProgressIndicator() {
        currentQNumSpan.textContent = currentQuestionIndex + 1;
        totalQNumSpan.textContent = questions.length;
    }

    // Format time for display
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Start Timer
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                assessmentSubmittedByTime = true;
                submitAssessment(); // Auto-submit when time runs out
            }
        }, 1000);
    }

    // Show a specific question
    function showQuestion(index) {
        questionsContainer.innerHTML = ''; // Clear previous question
        const q = questions[index];
        const questionBlock = document.createElement('div');
        questionBlock.className = 'question-block';
        questionBlock.id = q.id;

        let questionHtml = '';

        // Add passage if it exists for this question
        if (q.passage) {
            questionHtml += `<div class="passage"><p>${q.passage}</p></div>`;
        }

        // Display topic heading and then question text
        questionHtml += `<h3>Q${index + 1}. ${q.topicHeading}</h3>`;
        questionHtml += `<p class="question-text-content">${q.question}</p>`;


        // Add image if specified in question object
        if (q.image) {
            questionHtml += `<img src="${q.image}" alt="${q.imageAlt}" style="max-width: 150px; display: block; margin-bottom: 15px;">`; // Increased margin-bottom
        }

        if (q.type === 'radio') {
            for (const optionKey in q.options) {
                questionHtml += `
                    <div>
                        <label>
                            <input type="radio" name="${q.id}_answer" value="${optionKey}" ${userAnswers[q.id] === optionKey ? 'checked' : ''}>
                            ${optionKey}) ${q.options[optionKey]}
                        </label>
                    </div>
                `;
            }
        } else if (q.type === 'text') {
            questionHtml += `
                <input type="text" name="${q.id}_answer" placeholder="Enter your answer" value="${userAnswers[q.id] || ''}">
            `;
        } else if (q.type === 'number') {
            questionHtml += `
                <input type="number" name="${q.id}_answer" placeholder="Enter number" value="${userAnswers[q.id] || ''}">
            `;
        }
        questionBlock.innerHTML = questionHtml;
        questionsContainer.appendChild(questionBlock);

        // Update progress indicator
        updateProgressIndicator();

        // Manage button visibility
        if (currentQuestionIndex === questions.length - 1) {
            nextQuestionBtn.style.display = 'none';
            submitAssessmentBtn.style.display = 'block';
        } else {
            nextQuestionBtn.style.display = 'block';
            submitAssessmentBtn.style.display = 'none';
        }
    }

    // Handle moving to the next question
    function nextQuestion() {
        // Save current answer
        const currentQ = questions[currentQuestionIndex];
        let answerInput;
        if (currentQ.type === 'radio') {
            answerInput = document.querySelector(`input[name="${currentQ.id}_answer"]:checked`);
            userAnswers[currentQ.id] = answerInput ? answerInput.value : '';
        } else {
            answerInput = document.querySelector(`[name="${currentQ.id}_answer"]`);
            userAnswers[currentQ.id] = answerInput ? answerInput.value : '';
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(currentQuestionIndex);
        }
    }

    // Submit Assessment
    async function submitAssessment() {
        clearInterval(timerInterval); // Stop the timer

        // Save the answer for the last question
        const currentQ = questions[currentQuestionIndex];
        let answerInput;
        if (currentQ.type === 'radio') {
            answerInput = document.querySelector(`input[name="${currentQ.id}_answer"]:checked`);
            userAnswers[currentQ.id] = answerInput ? answerInput.value : '';
        } else {
            answerInput = document.querySelector(`[name="${currentQ.id}_answer"]`);
            userAnswers[currentQ.id] = answerInput ? answerInput.value : '';
        }

        assessmentSectionDiv.style.display = 'none';
        resultsDiv.style.display = 'block';

        let score = 0;
        let resultsHtmlEmailContent = ''; // This will store the detailed HTML for email
        let resultsTextContent = `Detailed Results:\n`;
        const scoreThresholds = {
            below: questions.length * 0.33, // Example: Below 33% is Below Expectations
            meets: questions.length * 0.66  // Example: 33-65% is Meets, >= 66% is Above
        };


        questions.forEach((q, index) => {
            const userAnswer = userAnswers[q.id];
            let isCorrect = false;
            let explanation = q.explanation || '';
            let userAnswerDisplay = userAnswer === '' ? 'No Answer' : userAnswer;
            let questionScore = 0; // 0 or 1 for each question

            if (q.type === 'radio') {
                isCorrect = userAnswer === q.correctAnswer;
                if (userAnswer && q.options[userAnswer]) {
                    userAnswerDisplay = q.options[userAnswer]; // Display the option text, not just the key
                }
            } else if (q.type === 'text') {
                // Specific custom validation for Q12 (Punctuation Commas from previous turn)
                if (q.id === 'q12') {
                    // Custom logic for Q12: Must start with a capital letter, contain 'blue', and end with a full stop (adjusted based on previous turn's file structure)
                    const trimmedAnswer = userAnswer.trim();
                    isCorrect = trimmedAnswer.length > 0 &&
                                trimmedAnswer[0] === trimmedAnswer[0].toUpperCase() &&
                                /[A-Z]/.test(trimmedAnswer[0]) && // Ensure the first char is an actual letter
                                trimmedAnswer.toLowerCase().includes('blue') &&
                                trimmedAnswer.endsWith('.');
                } else if (q.id === 'q15') { // Custom validation for Q15 (Question Mark Sentence from previous turn)
                    isCorrect = userAnswer.trim().length > 0 &&
                                userAnswer.trim().endsWith('?') &&
                                userAnswer.trim()[0] === userAnswer.trim()[0].toUpperCase();
                }
                else { // General text input comparison
                    isCorrect = userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
                }
            } else if (q.type === 'number') {
				// Fix: Use parseFloat for number comparisons to handle decimals correctly
                isCorrect = parseFloat(userAnswer) === q.correctAnswer;
            }

            if (isCorrect) {
                score++;
                questionScore = 1;
            }

            // Prepare HTML results (for email) based on the provided sample
            resultsHtmlEmailContent += `
                <div class="question-item">
                    <h4>Q${index + 1}. ${q.topicHeading}</h4>
                    <p>${q.question}</p> <p><strong>Your Answer:</strong> ${userAnswerDisplay}</p>
                    <p><strong>Correct Answer:</strong> ${q.correctAnswerDisplay || q.correctAnswer}</p>
                    <p><strong>Score:</strong> ${questionScore}/1</p>
                    <p><strong>Outcome:</strong> <span class="${isCorrect ? 'correct' : 'incorrect'}">${isCorrect ? 'Correct' : 'Incorrect'}</span></p>
                    ${explanation ? `<p>Explanation: ${explanation}</p>` : ''}
                </div>
            `;

            // Prepare Plain Text results (for email)
            resultsTextContent += `\nQuestion ${index + 1}: ${q.topicHeading} - ${q.question}\n`;
            resultsTextContent += `Your Answer: ${userAnswerDisplay} (${isCorrect ? 'Correct' : 'Incorrect'})\n`;
            resultsTextContent += `Correct Answer: ${q.correctAnswerDisplay || q.correctAnswer}\n`;
            if (explanation) {
                resultsTextContent += `Explanation: ${explanation}\n`;
            }
        });

        // ONLY SHOW SUMMARY ON RESULTS PAGE
        detailedResultsDiv.innerHTML = `<p>${CUSTOM_CONTENT.resultsEmailMessage}</p>`; // Display custom message
        overallScoreElement.textContent = `Overall Score: ${score}/${questions.length}`;

        let overallExpectations = '';
        let expectationsClass = ''; // To apply correct CSS class in email
        if (score < scoreThresholds.below) {
            overallExpectations = CUSTOM_CONTENT.expectationsBelow;
            expectationsClass = 'expectation-below';
        } else if (score >= scoreThresholds.meets) {
            overallExpectations = CUSTOM_CONTENT.expectationsAbove;
            expectationsClass = 'expectation-above';
        } else {
            overallExpectations = CUSTOM_CONTENT.expectationsMeets;
            expectationsClass = 'expectation-meets';
        }
        overallExpectationsElement.textContent = `Overall Performance: ${overallExpectations}`;

        // Add auto-submit message if applicable
        if (assessmentSubmittedByTime) {
            const autoSubmitMessage = document.createElement('p');
            autoSubmitMessage.textContent = CUSTOM_CONTENT.timeUpMessage;
            autoSubmitMessage.style.color = '#dc3545'; // Red for emphasis
            autoSubmitMessage.style.fontWeight = 'bold';
            overallScoreElement.parentNode.insertBefore(autoSubmitMessage, overallScoreElement.nextSibling);
        }

        // Store results for emailing
        assessmentTextResults = `
Child's Name: ${childName}
Parent's Name: ${parentName}
Parent's Email: ${parentEmail}

Overall Score: ${score}/${questions.length}
Overall Performance: ${overallExpectations}

${resultsTextContent}
        `;

        // Full HTML for email based on provided sample
        assessmentHtmlResults = `
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; }
    h2, h3, h4 { color: #0056b3; }
    .question-item { margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #eee; }
    .question-item:last-child { border-bottom: none; }
    .score-summary { text-align: center; margin-top: 25px; padding-top: 15px; border-top: 2px solid #007bff; }
    .correct { color: green; }
    .incorrect { color: red; }
    .expectation-meets { color: #28a745; font-weight: bold; }
    .expectation-below { color: #dc3545; font-weight: bold; }
    .expectation-above { color: #007bff; font-weight: bold; }
</style>
</head>
<body>
    <div class="container">
        <h2>${CURRENT_KEY_STAGE} Assessment Results for ${childName}</h2>
        <p><strong>Parent Name:</strong> ${parentName}</p>
        <p><strong>Parent Email:</strong> ${parentEmail}</p>
        <p><strong>Overall Score:</strong> ${score}/${questions.length}</p>
        <p><strong>Overall Performance:</strong> <span class="${expectationsClass}">${overallExpectations}</span></p>
        ${assessmentSubmittedByTime ? `<p style="color:#dc3545;font-weight:bold;">${CUSTOM_CONTENT.timeUpMessage}</p>` : ''}
        
        ${resultsHtmlEmailContent} <div class="score-summary">
            <h3>Overall Score: ${score}/${questions.length}</h3>
            <h3>Overall Outcome: <span class="${expectationsClass}">${overallExpectations}</span></h3>
        </div>
        <p>If you have any questions, please reply to this email.</p>
        <p>Best regards,<br>Mona Teaches</p>
    </div>
</body>
</html>
        `;

        // Immediately send results email and save to DB
        sendEmail(parentName, childName, parentEmail, assessmentTextResults, assessmentHtmlResults);
        saveSubmission(parentName, childName, parentEmail, score, overallExpectations, userAnswers);
    }

    // Send email function
    async function sendEmail(parentName, childName, parentEmail, resultsText, resultsHtml) {
        emailStatus.textContent = CUSTOM_CONTENT.emailSending;
        emailStatus.style.color = '#007bff'; // Blue for sending

        try {
            const response = await fetch('/.netlify/functions/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parentName: parentName,
                    childName: childName,
                    parentEmail: parentEmail,
                    resultsText: resultsText, // Pass plain text results
                    resultsHtml: resultsHtml,
                    keyStage: CURRENT_KEY_STAGE  // Pass HTML results
                }),
            });

            if (response.ok) {
                emailStatus.textContent = CUSTOM_CONTENT.emailSentSuccess;
                emailStatus.style.color = '#28a745'; // Green for success
            } else {
                const errorData = await response.json();
                console.error('Error sending email:', errorData.message);
                emailStatus.textContent = `${CUSTOM_CONTENT.emailFailed}: ${errorData.message || 'Server error'}`;
                emailStatus.style.color = '#dc3545'; // Red for error
            }
        } catch (error) {
            console.error('Network or unexpected error:', error);
            emailStatus.textContent = `${CUSTOM_CONTENT.networkError}`;
            emailStatus.style.color = '#dc3545'; // Red for error
        }
    }

    // Save submission to database function
	async function saveSubmission(parentName, childName, parentEmail, score, expectations, userAnswers) {
		const totalQuestions = questions.length; // Add this line
		try {
			const response = await fetch('/.netlify/functions/save-submission', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					parentName,
					childName,
					parentEmail,
					score,
					expectations,
					detailedResults: userAnswers,
					totalQuestions: totalQuestions // Add this line
				}),
			});
			// ... rest of your saveSubmission function
		} catch (error) {
			// ...
		}
	}

    // --- Event Listeners ---

    // Info Form Submission
    infoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Save user info
        parentName = document.getElementById('parentName').value;
        childName = document.getElementById('childName').value;
        parentEmail = document.getElementById('parentEmail').value;

        infoCollectionDiv.style.display = 'none';
        assessmentSectionDiv.style.display = 'block';

        showQuestion(currentQuestionIndex);
        startTimer();
    });

    // Cloudflare Turnstile Callback
    window.turnstileCallback = function(token) {
        // Verify token server-side (optional but recommended)
        fetch('/.netlify/functions/verify-turnstile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ turnstileToken: token })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                startAssessmentBtn.disabled = false;
            } else {
                startAssessmentBtn.disabled = true;
                console.error('Turnstile verification failed:', data.errors);
                alert('Security check failed. Please try again.');
            }
        })
        .catch(error => {
            startAssessmentBtn.disabled = true;
            console.error('Error verifying Turnstile:', error);
            alert('An error occurred during security verification. Please try again.');
        });
    };

    window.turnstileErrorCallback = function() {
        startAssessmentBtn.disabled = true;
        console.error('Turnstile widget encountered an error.');
        alert('There was an issue loading the security check. Please refresh the page.');
    };

    // New: Prevent unintended form submission on Enter key press within assessment questions
    assessmentForm.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const focusedElement = e.target;
            // Check if the focused element is a text or number input
            if (focusedElement.tagName.toLowerCase() === 'input' &&
                (focusedElement.type === 'text' || focusedElement.type === 'number')) {
                e.preventDefault(); // Stop the default form submission
                // Optionally, trigger the "Next Question" button click
                // This makes hitting enter move to the next question for text/number inputs
                nextQuestionBtn.click();
            }
        }
    });

    // Next Question Button
    nextQuestionBtn.addEventListener('click', nextQuestion);

    // Assessment Form Submission (for final submit button)
    assessmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitAssessment();
    });
});