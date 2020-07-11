BEGIN;

TRUNCATE
    legendum_exercises_learn_hints
    RESTART IDENTITY CASCADE;

SET CLIENT_ENCODING TO 'utf8';
INSERT INTO legendum_exercises_learn_hints (exercise_page_id, hints)
    VALUES
        (1, '“Salvē” is a greeting like “Hello”.  It is how you greet one person.'),
        (2, '“Egō” is a pronoun.  It means “I”.|“sum” is a verb.  It means “I am”.'),
        (3, '“Nōmen” is a noun.  It means “name”.|“mihi” is a personal pronoun.  It literally means “for me”, but we can translate it like an adjective here and say “my”.|“est” is a verb.  It means “is”.'),
        (4, '“Lūcī” is in the vocative case.  That’s a fancy way of saying that you use this form of the word “Lūcīus” to address directly someone named Lūcīus.'),
        (5, '“Quid” is an interrogative pronoun.  It means “what”.|“tibi” is a personal pronoun.  It literally means “for you”, but we can translate it like an adjective here and say “your”.'),
        (7, '“Pergrātum tē convenīre!” literally means “it is pleasing to meet you!”, but we can simply translate: “pleased to meet you!”.'),
        (8, '“Quoque” is a conjunction.  It means “also” or “as well”.'),
        (9, '“Valē” is a command.  It literally means “be well”, but it acts like the English “farewell”.  It’s how you say goodbye to one person in Latin.'),
        (10, '“Exit” is a verb.  It means “goes away” or “departs”.');

COMMIT;