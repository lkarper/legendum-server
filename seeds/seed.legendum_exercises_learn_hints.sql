BEGIN;

TRUNCATE
    legendum_exercises_learn_hints
    RESTART IDENTITY CASCADE;

SET CLIENT_ENCODING TO 'utf8';
INSERT INTO legendum_exercises_learn_hints (exercise_page_id, hint_order_number, hint)
    VALUES
        (1, 1, '“Salvē” is a greeting like “Hello”.  It is how you greet one person.'),
        (2, 1, '“Egō” is a pronoun.  It means “I”.'),
        (2, 2, '“sum” is a verb.  It means “I am”.'),
        (3, 1, '“Nōmen” is a noun.  It means “name”'),
        (3, 2, '“mihi” is a personal pronoun.  It literally means “for me”, but we can translate it like an adjective here and say “my”.'),
        (3, 3, '“est” is a verb.  It means “is”.'),
        (4, 1, '“Lūcī” is in the vocative case.  That’s a fancy way of saying that you use this form of the word “Lūcīus” to address directly someone named Lūcīus.'),
        (5, 1, '“Quid” is an interrogative pronoun.  It means “what”.'),
        (5, 2, '“tibi” is a personal pronoun.  It literally means “for you”, but we can translate it like an adjective here and say “your”.'),
        (7, 1, '“Pergrātum tē convenīre!” literally means “it is pleasing to meet you!”, but we can simply translate: “pleased to meet you!”.'),
        (8, 1, '“Quoque” is a conjunction.  It means “also” or “as well”.'),
        (9, 1, '“Valē” is a command.  It literally means “be well”, but it acts like the English “farewell”.  It’s how you say goodbye to one person in Latin.'),
        (10, 1, '“Exit” is a verb.  It means “goes away” or “departs”.');

COMMIT;