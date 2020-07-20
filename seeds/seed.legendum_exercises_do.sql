BEGIN;

TRUNCATE
    legendum_exercises_do
    RESTART IDENTITY CASCADE;

SET CLIENT_ENCODING to 'utf8';
INSERT INTO legendum_exercises_do (
    exercise_id, 
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
    input_label
)
VALUES
    (1, 1, 'Rhadamanthus: “Salvē!”', false, null, 'multiple-choice', 'How do you greet Rhadamanthus?', 'Valē!', null, null, 'Salvē!', 'Don’t say farewell just yet...', null, null, false, false, null, null, 'https://lh3.googleusercontent.com/pw/ACtC-3cjJO1Gf8G40LEd-gRRWI0toggVvuIaHAcH_bjzZ_vSDjpXH6CsNUia2cZALMY7aLb_n0mQHz5c34kZszFXj7g-mTlEosiCCJm2BQpbc0FbaSp3D4FDtdGc8If0LyVLwg9YRop17FNvB1kDkjaZj2g=s600-no?authuser=2', 'A man waves at you.', null),
    (1, 2, 'Rhadamanthus: “Egō sum Rhadamanthus.”', false, null, 'multiple-choice', 'Quid est nōmen?', 'mihi', 'tibi', 'sum', 'Rhadamanthus', 'Not quite: that means ‘my’', 'Close, but that means ‘your’', 'that’s a verb and we need a noun', false, false, null, null, 'https://lh3.googleusercontent.com/pw/ACtC-3fvaz8Ps1NRvzYfParxviqJbzZS2BJ6bmYuPp1TEdumAFmsq2QQqDNn4zg8BfGUpUhtRVKZ3rXOGc-9rdxF6I9kTYvhA0XV49LbfR297OWLj_vcV6_yO7HbzXT-nj0CatEivFaHgkte2RKXeG-d3VhW=w480-h600-no?authuser=2', 'A friendly looking man stands before you.', null),
    (1, 3, 'Rhadamanthus: “Nōmen mihi est Rhadamanthus.”', false, null, 'input', '“Quid est nōmen tibi?”', null, null, null, null, null, null, null, true, false, 'user_name', null, 'https://lh3.googleusercontent.com/pw/ACtC-3fvaz8Ps1NRvzYfParxviqJbzZS2BJ6bmYuPp1TEdumAFmsq2QQqDNn4zg8BfGUpUhtRVKZ3rXOGc-9rdxF6I9kTYvhA0XV49LbfR297OWLj_vcV6_yO7HbzXT-nj0CatEivFaHgkte2RKXeG-d3VhW=w480-h600-no?authuser=2', 'A friendly looking man stands before you.', 'Nōmen mihi est...'),
    (1, 4, 'Rhadamanthus: “Nōmen tibi est |.”', true, 'user_name', 'true/false', 'True or False? (Vērum aut Falsum?)', 'False/Falsum', null, null, 'True/Vērum', 'What did you say your name is?', null, null, false, false, null, null, 'https://lh3.googleusercontent.com/pw/ACtC-3fvaz8Ps1NRvzYfParxviqJbzZS2BJ6bmYuPp1TEdumAFmsq2QQqDNn4zg8BfGUpUhtRVKZ3rXOGc-9rdxF6I9kTYvhA0XV49LbfR297OWLj_vcV6_yO7HbzXT-nj0CatEivFaHgkte2RKXeG-d3VhW=w480-h600-no?authuser=2', 'A friendly looking man stands before you.', null),
    (1, 5, 'Rhadamanthus: “Pergrātum te convenīre!”', false, null, 'multiple-choice', 'Fill in the blank: “Pergrātum te __________ convenīre, Rhadamanthe!”', 'pergrātum', 'Rhadamanthe', 'te', 'quoque', 'That word is already in the sentence; no need to repeat ourselves', 'That word is already in the sentence; no need to repeat ourselves', 'That word is already in the sentence; no need to repeat ourselves', false, false, null, null, 'https://lh3.googleusercontent.com/pw/ACtC-3fvaz8Ps1NRvzYfParxviqJbzZS2BJ6bmYuPp1TEdumAFmsq2QQqDNn4zg8BfGUpUhtRVKZ3rXOGc-9rdxF6I9kTYvhA0XV49LbfR297OWLj_vcV6_yO7HbzXT-nj0CatEivFaHgkte2RKXeG-d3VhW=w480-h600-no?authuser=2', 'A friendly looking man stands before you.', null),
    (2, 1, 'Enni: “Looks like we have to fill in the blank here.”', false, null, 'multiple-choice', 'Haec est _____ .', 'Graecia', 'Eurōpa', 'Aegyptus', 'Italia', 'Graecia is to the east.', 'This is only part of Eurōpa.', 'Aegyptus is in Africa, to the south-east.', false, false, null, null, 'https://lh3.googleusercontent.com/pw/ACtC-3fsJYc3Ci3wfb4z9vZ-4eMoWAiKJ1MGL2-YpvG_Kg9OJ74nbrCdE-R56aRrwQL-IoYxY75Eu3j4tFZk2As_7JhJwDXK8CIcmLprB_HsgrrllCiAPI9KvzeMv_dCqB-liGlr0XUYhCvOdEMhgPJuEXXT=w1114-h943-no?authuser=2', 'A map of Italy.', null),
    (2, 2, 'Enni: “This is a true/false question.”', false, null, 'true/false', 'Haec nōn est Rōma.',  'True/Vērum', null, null, 'False/Falsum', 'Remember that “nōn” negates the verb.', null, null, false, false, null, null, 'https://lh3.googleusercontent.com/pw/ACtC-3eHi7giCVrZicxNz4cSiEPHp_7eiVXed7XgPCNUFJ76NMmGzCw6ZNBUPNybhmy0iH99FYC9YgDP8HQCWeUo83OhNAyTfoZ2ndYvmLSU1EsLiMcEfkDtnYOyeIXRr0Ph5FFcbetEfl9fOcKgwNKQHdYD=w937-h849-no?authuser=2', 'A map with Rome circled.', null),
    (2, 3, 'Enni: “Hmm, another fill in the blank question.”', false, null, 'input', 'Haec _____ Hispānia.', null, null, null, 'est', 'We’re looking for a verb here. What verbs have we learned so far?  Note that “Haec” will be the subject and “Hispānia” will be a predicate nominative.', null, null, false, false, null, null, 'https://lh3.googleusercontent.com/pw/ACtC-3dvI6qpKOy0C6UKf2zJju4xUC0u0ZvormQwufhT_aEJ91D_PELM6j4wvjVux5PhWvbgXrEddOOSHyINKzf7T0gmqbJjlxMK9uuG1WHMBNpYlAMEwAtcNgU6OuuNKAcFhm8fCUog1WraseYOFxJ2cLqR=w1043-h849-no?authuser=2', 'A map with Spain circled.', 'Fill in the blank'),
    (2, 4, 'Enni: “Great job on that last question. This question is similar.”', false, null, 'input', 'Hispānia et Italia et Graecia in Eurōpā _____.', null, null, null, 'sunt', 'We need a verb. Make sure that you understand what the subjects of the verb are. The verb is related to “est”, but is not “est”. We need the plural form.', null, null, false, false, null, null, 'https://lh3.googleusercontent.com/pw/ACtC-3eQNxEUfEVmHEeerDIwVx-KkQPNq-3GkR36dw-XeWeAo4M-8pmLMCbLy2UuSLSaayiOANksMALh5a8OKfdeWEpjux0FGEoncwf1u7cGDOz-8SOufKHNYsc0CsTLOmmpInzUg3Zo_KWfx3A2yFZuGkAB=w1184-h849-no?authuser=2', 'A map with Spain, Italy, and Greece circled.', 'Fill in the blank'),
    (2, 5, 'Enni: “A fill in the blank, but it looks like we have some options to choose from.”', false, null, 'multiple-choice', 'Aegyptus est in _____.', 'Āfrica', 'Eurōpā', 'Eurōpa', 'Āfricā', 'You have the right idea, but is the case of the word correct? Remember what we learned about the nominative and ablative cases.', 'You’re right that we need a noun in the ablative case, but is Egypt in Europe?', 'Double check the map: is Egypt in Europe?', false, false, null, null, 'https://lh3.googleusercontent.com/pw/ACtC-3fn8a4MadW40d4nXXASh6-DwQ37UmKHtF2q7lTklNovmrjqWINJxSC3UvbMCI8vDWlrGE3QxECG3a62lMReriPGQrWsQ7Minanl44nqnrkO6X-dwz_4vLmwll6WJCGDfPJyniyPDTQFaiG65rCS-rqC=w1343-h849-no?authuser=2', 'A map with Egypt circled.', null),
    (2, 6, 'Enni: “Good thing we went over a few basic conjunctions; you’ll need them here.”', false, null, 'multiple-choice', 'Gallia nōn in Āfricā _____ in Eurōpā est.', 'aut', null, null, 'sed', '“aut” is a conjunction, but it means “or”; Gallia in Eurōpā est… so what conjunction do we need to complete the sentence?', null, null, false, false, null, null, 'https://lh3.googleusercontent.com/pw/ACtC-3fF-9cOhH3zRAP71yQudTwGT-sqo1pt9G0iUkCLyGxCasvID8w0qGRx-95wkcP8i7J_Dmp-N0MiItlgScf_nvvXeBt5I78dHQN5sUUQvm8yqdkfTxTueu8r_cAAhV2NqLJDPklfPenSpmaul7YYzRo5=w1110-h849-no?authuser=2', 'A map with Gallia circled.', null),
    (2, 7, 'Enni: “Great job so far with conjunctions. We need another one here.”', false, null, 'input', 'Syria et Arabia nōn in Eurōpā _____ in Āfricā sed in Asiā sunt.', null, null, null, 'aut', 'We need a conjunction that means “or”.', null, null, false, false, null, null, 'https://lh3.googleusercontent.com/pw/ACtC-3fWHl-ksrOPATWo-ovVePpvCsLHyGKvU12feH-zRIuvffmwmTeF8F6fXBEjAp7GUJsps0t1DIgmzwgpCQioIftPZbJyU8F6dd5px3Fiv8bz5C4LKsQ26hCuLHTv5Ng5XVDUL3TG6DXepEGoSDVdToZj=w959-h603-no?authuser=2', 'A map with Arabia and Syria circled.', 'Fill in the blank')    
    ;

COMMIT;