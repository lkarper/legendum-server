BEGIN;

TRUNCATE
    legendum_exercises_do
    RESTART IDENTITY CASCADE;

SET CLIENT_ENCODING to 'utf8';
INSERT INTO legendum_exercises_do (
    chapter_number, 
    page, 
    dialogue,
    dialogue_look_back,
    dialogue_to_look_for,
    question_type, 
    question,
    incorrect_response_option_1,
    incorrect_response_option_2,
    incorrect_response_option_3,
    correct_response,
    response_if_incorrect_1,
    response_if_incorrect_2,
    response_if_incorrect_3,
    look_ahead,
    look_back,
    property_to_save,
    property_to_look_for,
    image_url,
    image_alt_text,
    input_label,
    background_image_url,
    background_image_alt_text
)
VALUES
    (1, 1, 'Rhadamanthus: “Salvē!”', false, null, 'multiple-choice', 'How do you greet Rhadamanthus?', 'Valē!', null, null, 'Salvē!', 'Don’t say farewell just yet...', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251514/rhadamanthus_wave4_tlr1gz.gif', 'A man waves at you.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 2, 'Rhadamanthus: “Egō sum Rhadamanthus.”', false, null, 'multiple-choice', 'Quid est nōmen?', 'mihi', 'tibi', 'sum', 'Rhadamanthus', 'Not quite: that means ‘my’', 'Close, but that means ‘your’', 'that’s a verb and we need a noun', false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'A friendly looking man stands before you.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 3, 'Rhadamanthus: “Nōmen mihi est Rhadamanthus.”', false, null, 'input', '“Quid est nōmen tibi?”', null, null, null, null, null, null, null, true, false, 'user_name', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'A friendly looking man stands before you.', 'Nōmen mihi est...', 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 4, 'Rhadamanthus: “Nōmen tibi est |.”', true, 'user_name', 'true/false', 'True or False? (Vērum aut Falsum?)', 'False/Falsum', null, null, 'True/Vērum', 'What did you say your name is?', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'A friendly looking man stands before you.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (1, 5, 'Rhadamanthus: “Pergrātum te convenīre!”', false, null, 'multiple-choice', 'Fill in the blank: “Pergrātum te __________ convenīre, Rhadamanthe!”', 'pergrātum', 'Rhadamanthe', 'te', 'quoque', 'That word is already in the sentence; no need to repeat ourselves', 'That word is already in the sentence; no need to repeat ourselves', 'That word is already in the sentence; no need to repeat ourselves', false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/rhadamanthus1_c8w2hn.png', 'A friendly looking man stands before you.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251513/Cave_small_odtkji.jpg', 'You are in a cave with a river running through the background.'),
    (2, 1, 'Enni: “Looks like we have to fill in the blank here.”', false, null, 'multiple-choice', 'Haec est _____ .', 'Graecia', 'Eurōpa', 'Aegyptus', 'Italia', 'Graecia is to the east.', 'This is only part of Eurōpa.', 'Aegyptus is in Africa, to the south-east.', false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251590/Chapter%202%20Do%20Images/Italia_do_cletxm.png', 'A map of Italy.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 2, 'Enni: “This is a true/false question.”', false, null, 'true/false', 'Haec nōn est Rōma.',  'True/Vērum', null, null, 'False/Falsum', 'Remember that “nōn” negates the verb.', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251590/Chapter%202%20Do%20Images/Roma_pbdvft.png', 'A map with Rome circled.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 3, 'Enni: “Hmm, another fill in the blank question.”', false, null, 'input', 'Haec _____ Hispānia.', null, null, null, 'est', 'We’re looking for a verb here. What verbs have we learned so far?  Note that “Haec” will be the subject and “Hispānia” will be a predicate nominative.', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Hispania_rku1ai.png', 'A map with Spain circled.', 'Fill in the blank', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 4, 'Enni: “Great job on that last question. This question is similar.”', false, null, 'input', 'Hispānia et Italia et Graecia in Eurōpā _____.', null, null, null, 'sunt', 'We need a verb. Make sure that you understand what the subjects of the verb are. The verb is related to “est”, but is not “est”. We need the plural form.', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Hispania_Italia_Graecia_ya5xj8.png', 'A map with Spain, Italy, and Greece circled.', 'Fill in the blank', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 5, 'Enni: “A fill in the blank, but it looks like we have some options to choose from.”', false, null, 'multiple-choice', 'Aegyptus est in _____.', 'Āfrica', 'Eurōpā', 'Eurōpa', 'Āfricā', 'You have the right idea, but is the case of the word correct? Remember what we learned about the nominative and ablative cases.', 'You’re right that we need a noun in the ablative case, but is Egypt in Europe?', 'Double check the map: is Egypt in Europe?', false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Aegyptus_rlovgz.png', 'A map with Egypt circled.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 6, 'Enni: “Good thing we went over a few basic conjunctions; you’ll need them here.”', false, null, 'multiple-choice', 'Gallia nōn in Āfricā _____ in Eurōpā est.', 'aut', null, null, 'sed', '“aut” is a conjunction, but it means “or”; Gallia in Eurōpā est… so what conjunction do we need to complete the sentence?', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251589/Chapter%202%20Do%20Images/Gallia_gytp24.png', 'A map with Gallia circled.', null, 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.'),
    (2, 7, 'Enni: “Great job so far with conjunctions. We need another one here.”', false, null, 'input', 'Syria et Arabia nōn in Eurōpā _____ in Āfricā sed in Asiā sunt.', null, null, null, 'aut', 'We need a conjunction that means “or”.', null, null, false, false, null, null, 'https://res.cloudinary.com/legendum/image/upload/v1602251590/Chapter%202%20Do%20Images/Syria_Arabia_vx1t1q.png', 'A map with Arabia and Syria circled.', 'Fill in the blank', 'https://res.cloudinary.com/legendum/image/upload/v1602251515/Room1_small_pcyxdp.jpg', 'You are in a typical Roman room with a decorated floor and painted walls.')    
    ;

COMMIT;