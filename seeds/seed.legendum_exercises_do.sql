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
    (1, 5, 'Rhadamanthus: “Pergrātum te convenīre!”', false, null, 'multiple-choice', 'Fill in the blank: “Pergrātum te __________ convenīre, Rhadamanthe!”', 'pergrātum', 'Rhadamanthe', 'te', 'quoque', 'That word is already in the sentence; no need to repeat ourselves', 'That word is already in the sentence; no need to repeat ourselves', 'That word is already in the sentence; no need to repeat ourselves', false, false, null, null, 'https://lh3.googleusercontent.com/pw/ACtC-3fvaz8Ps1NRvzYfParxviqJbzZS2BJ6bmYuPp1TEdumAFmsq2QQqDNn4zg8BfGUpUhtRVKZ3rXOGc-9rdxF6I9kTYvhA0XV49LbfR297OWLj_vcV6_yO7HbzXT-nj0CatEivFaHgkte2RKXeG-d3VhW=w480-h600-no?authuser=2', 'A friendly looking man stands before you.', null);

COMMIT;