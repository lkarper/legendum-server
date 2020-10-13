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
        (10, 1, '“Exit” is a verb.  It means “goes away” or “departs”.'),
        (12, 1, '“Haec” means “This”.  It’s what we call a demonstrative.  Demonstratives “demonstrate” or “point out” things.  In Latin, they often act as pronouns and adjectives.'),
        (12, 2, '“est” is a verb.  It means “is”.'),
        (12, 3, '“Rōma” is Rome.'),
        (13, 1, '“Italia” is Italy.'),
        (14, 1, '“Eurōpā” is Europe.'),
        (14, 2, '“in” means “in” or “on”, depending on the context.'),
        (14, 3, 'Note the long mark over the final “a” in “Eurōpā”.  This is called a macron.  This is a modern invention, used to aid us in pronunciation, and the ancient Romans did not use macra (the plural of “macron”).'),
        (14, 4, 'The final “a” in “Eurōpā” is long because “Eurōpā” is in the ablative case.  Latin is a heavily inflected language, which means that forms of words change to indicate how they function in a sentence grammatically.  We do this in English.  “He”, for example, is used to indicate that the pronoun acts as the subject of a sentence or clause.  “Him”, meanwhile, indicates that the pronoun is acting as a direct object or the object of a preposition.  English generally relies on word order to indicate meaning.  For example “Mike gives the book to Tom” and “Tom gives the book to Mike” mean different things, even though “Mike” and “Tom” take the same form in each sentence.  We know which is the subject of each sentence and which is the object of the preposition “to” because of word order.  Latin nouns, however, indicate their function by changing their form.  We call this form “case”.  We have seen two cases: the nominative and the ablative.  While each has various uses, so far, we have seen that the nominative case is used to indicate that a noun is the subject of a verb (“Italia” above) and that the ablative is used as the object of a preposition, when that preposition indicates location without movement (“in” paired with “Eurōpā” above).'),
        (15, 1, '“Rōma” is in the nominative case; we know this because the final “a” is short (it has no macron above it).'),
        (15, 2, '“Italiā” is in the ablative case; we know this because the final “ā” is long (it has a macron above it).'),
        (16, 1, '“Hispānia” is Spain.'),
        (17, 1, '“Hispānia” is in the nominative case.'),
        (17, 2, '“Eurōpā” is in the ablative case.'),
        (18, 1, '“Graecia” is Greece.'),
        (19, 1, '“Graecia” is in the nominative case.'),
        (19, 2, '“Eurōpā” is in the ablative case.'),
        (19, 3, 'Recall that “quoque” means “also”.'),
        (20, 1, '“et” is a conjunction that means “and”.'),
        (20, 2, '“sunt” is the plural of “est”; it means “are”.  The subjects of the verb are “Hispānia”, “Italia”, and “Graecia”.  All three nouns are in the nominative case; we know this because the final -a in each word does NOT have a macron above it (and is, therefore, short).'),
        (20, 3, '“Eurōpā” is in the ablative case.  We know this because the final -ā is long (note the macron above it).  “Eurōpā” is the object of the preposition “in”, and this is why the noun is in the ablative case.'),
        (21, 1, '“Hīc” is also a demonstrative that means “this”.'),
        (21, 2, '“Aegyptus” is Egypt.'),
        (21, 3, '“Hīc” takes a different form than “haec” (which we saw above) because of the grammatical gender of “Aegyptus”.  Latin adjectives agree with the words they modify in gender, number, and case.  We’ve already spoken about case.  Number simply means “singular” or “plural”.  Gender refers to grammatical gender.  Latin nouns, pronouns, and adjectives have what we call grammatical gender.  There are three genders in Latin: masculine, feminine, and neuter.  This grammatical gender should not be confused with other notions of gender (although they do sometimes overlap: for example, the Latin word for dog (“canis”) can be either masculine or feminine, depending on whether the dog in question is a male or female).  Often, the grammatical gender of a word appears to be arbitrary.  For example, the Latin words “mare” (neuter), “pontus” (masculine) and “aqua” (feminine) all refer to water and, depending on the context, can all be translated as “sea”.  It is best to memorize the gender of a noun when you learn it, although you can sometimes infer a word’s gender based on the declension to which a noun belongs.'),
        (21, 4, 'Latin nouns and adjectives are grouped into what we call “declensions”.  Declensions share common endings that are used to differentiate case.  This is why “Italia”, “Hispania”, “Graecia” and “Eurōpa” all end in “a”: they all belong to the first declension.  First declension nouns are usually feminine, although this is not always true. “Aegyptus” is a nominative noun that belongs to the second declension.  Second declension nouns are usually masculine.  We can say that the word “Aegyptus” is a second declension, singular, masculine noun in the nominative case.'),
        (21, 5, '“Aegyptus” is in the nominative case here because it is what we call a “predicate nominative”.  “Predicate nominative” is a fancy term for a word that renames or further explains the subject of a sentence.  Predicate nominatives are often found with “copulatives”, that is, “linking verbs”, such as “is”, “are”, “am”, etc.  The subject of the verb “est” is the demonstrative pronoun “hīc”, which is also in the nominative case.  We have now seen the two main uses for the nominative case: subjects of verbs and predicate nominatives.'),
        (22, 1, 'Note that the position of the word “est” is malleable.  Word order in Latin is a lot looser than in English, because Latin words are so heavily inflected.  You know that “Aegyptus” is the subject of “est” because it is in the nominative case and “Āfricā” is in the ablative case.  You could place “est” anywhere in the above sentence, and the meaning would remain the same.  Because of this, word order in Latin is often used for emphasis and effect.  Placing a word or phrase first–or last–in a clause changes the impact of the sentence.'),
        (23, 1, '“Gallia” is the ancient Gaul, which included modern France, Belgium, Switzerland, and (originally) parts of northern Italy.  Later, northern Italy was included by the Romans in “Italia”.'),
        (24, 1, '“Nōn” is an adverb that negates verbs.  We can translate it as “not”.'),
        (24, 2, '“sed” is a conjunction; it means “but”.'),
        (25, 1, '“aut” is a conjunction; it means “or”.'),
        (25, 2, '“sunt” is the plural of “est”; it means “are”.  The subjects of the verb “sunt” are “Syria” and “Arabia”, which are both first declension feminine singular nouns in the nominative case.');

COMMIT;
