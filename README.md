# Legendum API

This API was designed for use with the application [Legendum](https://legendum.herokuapp.com/) ([GitHub repo](https://github.com/lkarper/legendum-proto)).  It functions independently of the app, however, and resides at the base url `https://legendum-server.herokuapp.com/api`, which is used for all API requests.

## Authorization `/auth`
Requests to endpoints that require authorization must include an `Authorization` header with a bearer token (e.g. `"Authorization": "bearer [token]"`).  Bearer tokens are obtained by appending a valid `user_name` and `password` to the body of a POST request sent to the `/auth/login` endpoint.  Tokens expire after fifteen minutes.  Tokens may be refreshed before expiry by making a POST request to `/auth/refresh` with an `Authorization` header that contains a valid bearer token. 

## Endpoints

### Users `/users`

#### `/` (`POST`)
A `POST` request sent to this endpoint will create a new user. The `POST` request body must contain the following fields:
* `password` (string) - Passwords must: be between 8 and 72 characters in length, not begin or end with a space, contain at least one lowercase letter, contain at least one uppercase letter, contain at least one number, contain at least one special character (e.g. !, @, #, $, etc.).
* `user_name` (string) - Usernames must be between 3 and 72 characters in length.
* `display_name` (string) - The name that will be displayed publicly to other users.

Usernames must be unique.  If a `user_name` is already linked to a user-account, the server will respond with `400`.

### Stories `/stories`

#### `/` (`GET`)

A `GET` request sent to this endpoint will return all stories.

#### `/` (`POST`) (admin privileges required)

A `POST` request sent to this endpoint will create a new story.  The `POST` request body must contain the following fields:
* `story_title` (string) - A title for the story.
* `chapter_number` (number) - The chapter number for the story. Chapter numbers must be unique.

#### `/:story_id` (`GET`)

A `GET` request sent to this endpoint will return the story with the `id` equal to the `story_id` parameter.

#### `/:story_id` (`DELETE`) (admin privileges required)

A `DELETE` request sent to this endpoint will delete the story with the `id` equal to the `story_id` parameter.

#### `/:story_id` (`PATCH`) (admin privileges required)

A `PATCH` request sent to this endpoint will update the story with the `id` equal to the `story_id` parameter.  The request body must contain at least one of the following fields:
* `story_title` (string) - A title for the story.
* `chapter_number` (number) - The chapter number for the story. Chapter numbers must be unique.

#### `/by-chapter/:chapter_number` (`GET`)

A `GET` request sent to this endpoint will return the story with a `chapter_number` equal to the `chapter_number` parameter.

### Dialogue `/dialogue`

#### `/` (`GET`)

A `GET` request sent to this endpoint will return all dialogue.

#### `/` (`POST`) (admin privileges required)

A `POST` request sent to this endpoint will create a new dialogue entry.  The `POST` request body must contain the following fields:
* `chapter_number` (number) - The number of the chapter in which the dialogue entry will appear.
* `page` (number) - A page number representing the order in which the dialogue lines will appear.
* `text` (string) - The dialogue to display on the app.

The following fields are optional:
* `image_url` (string) - A URL for the image to be displayed with the dialogue.
* `image_alt_text` (string) - The `alt` text for the image to be displayed with the dialogue.
* `choices` (string) - A single string representing two choices on how to respond to dialogue that are presented to the user, separated by `|`.  E.g. `“Choice 1”|“Choice 2”`.
* `responses_to_choices` (string) - A single string representing the responses to the choices presented to the user, separated by `|`.  E.g. `“Response to Choice 1”|“Response to Choice 2”`.
* `background_image_url` (string) - A URL for the background image to be displayed with the dialogue.
* `background_image_alt_text` (string) - The `alt` text for the background image to be displayed with the dialogue.

#### `/:dialogue_id` (`GET`)

A `GET` request sent to this endpoint will return the dialogue entry with the `id` equal to the `dialogue_id` parameter.

#### `/:dialogue_id` (`DELETE`) (admin privileges required)

A `DELETE` request sent to this endpoint will delete the dialogue entry with the `id` equal to the `dialogue_id` parameter.

#### `/:dialogue_id` (`PATCH`) (admin privileges required)

A `PATCH` request sent to this endpoint will update the dialogue entry with the `id` equal to the `dialogue_id` parameter.  The request body must contain at least one of the following fields:
* `chapter_number` (number) - The number of the chapter in which the dialogue entry will appear.
* `page` (number) - A page number representing the order in which the dialogue lines will appear.
* `text` (string) - The dialogue to display to the user.
* `image_url` (string) - A URL for the image to be displayed with the dialogue.
* `image_alt_text` (string) - The `alt` text for the image to be displayed with the dialogue.
* `choices` (string) - A single string representing two choices on how to respond to dialogue that are presented to the user, separated by `|`.  E.g. `“Choice 1”|“Choice 2”`.
* `responses_to_choices` (string) - A single string representing the responses to the choices presented to the user, separated by `|`.  E.g. `“Response to Choice 1”|“Response to Choice 2”`.
* `background_image_url` (string) - A URL for the background image to be displayed with the dialogue.
* `background_image_alt_text` (string) - The `alt` text for the background image to be displayed with the dialogue.

#### `/by-chapter/:chapter_number` (`GET`)

A `GET` request sent to this endpoint will return all dialogue with a `chapter_number` equal to the `chapter_number` parameter.

### Exercises `/exercises`

#### `/` (`GET`)

A `GET` request sent to this endpoint will return all exercises.

#### `/` (`POST`) (admin privileges required)

A `POST` request sent to this endpoint creates a new exercise.  The `POST` request body must contain the following fields:
* `chapter_number` (string) - The chapter number for the exercise. Chapter numbers must be unique.
* `exercise_title` (string) - The title for the exercise (in Latin).
* `exercise_translation` (string) - The English translation of the exercise title.

#### `/:exercise_id` (`GET`)

A `GET` request sent to this endpoint will return the exercise with the `id` equal to the `exercise_id` parameter.

#### `/:exercise_id` (`DELETE`) (admin privileges required)

A `DELETE` request sent to this endpoint will delete the exercise with the `id` equal to the `exercise_id` parameter.

#### `/:exercise_id` (`PATCH`) (admin privileges required)

A `PATCH` request sent to this endpoint will update the exercise with the `id` equal to the `exercise_id` parameter.  The request body must contain at least one of the following fields:
* `chapter_number` (string) - The chapter number for the exercise. Chapter numbers must be unique.
* `exercise_title` (string) - The title for the exercise (in Latin).
* `exercise_translation` (string) - The English translation of the exercise title.

#### `/:chapter_number/learn-pages` (`GET`)

A `GET` request sent to this endpoint will return all learn pages for the chapter with the `chapter_number` equal to the `chapter_number` parameter.

#### `/:chapter_number/learn-pages` (`POST`) (admin privileges required)

A `POST` request sent to this endpoint will create a new learn page for the chapter with the `chapter_number` equal to the `chapter_number` parameter.  The `POST` request body must contain the following fields:
* `page` (number) - A page number representing the order in which the learn pages will appear.
* `text` (string) - The text that will be displayed to users.
 
The following fields are optional:
* `image_url` (string) - A URL for the image to be displayed with the learn page text.
* `image_alt_text` (string) - The `alt` text for the image to be displayed with the learn page text.
* `background_image_url` (string) - A URL for the background image to be displayed with the learn page text.
* `background_image_alt_text` (string) - The `alt` text for the background image to be displayed with the learn page text.

#### `/:chapter_number/learn-pages/:page_id` (`GET`)

A `GET` request sent to this endpoint will return the learn page with the `id` equal to the `page_id` parameter, for the chapter with the `chapter_number` equal to the `chapter_number` parameter.

#### `/:chapter_number/learn-pages/:page_id` (`DELETE`) (admin privileges required)

A `DELETE` request sent to this endpoint will delete the learn page with the `id` equal to the `page_id` parameter, for the chapter with the `chapter_number` equal to the `chapter_number` parameter.

#### `/:chapter_number/learn-pages/:page_id` (`PATCH`) (admin privileges required)

A `PATCH` request sent to this endpoint will update the learn page with the `id` equal to the `page_id` parameter, for the chapter with the `chapter_number` equal to the `chapter_number` parameter.  The request body must contain at least one of the following fields:
* `page` (number) - A page number representing the order in which the learn pages will appear.
* `text` (string) - The text that will be displayed to users.
* `image_url` (string) - A URL for the image to be displayed with the learn page text.
* `image_alt_text` (string) - The `alt` text for the image to be displayed with the learn page text.
* `background_image_url` (string) - A URL for the background image to be displayed with the learn page text.
* `background_image_alt_text` (string) - The `alt` text for the background image to be displayed with the learn page text.

#### `/:chapter_number/learn-pages/:page_id/hints` (`GET`)

A `GET` request sent to this endpoint will return all hints for the learn page with the `id` equal to the `page_id` parameter, for the chapter with the `chapter_number` equal to the `chapter_number` parameter.

#### `/:chapter_number/learn-pages/:page_id/hints` (`POST`) (admin privileges required)

A `POST` request sent to this endpoint will create a new hint for the learn page with the `id` equal to the `page_id` parameter, for the chapter with the `chapter_number` equal to the `chapter_number` parameter.  The `POST` request body must contain the following fields:
* `hint_order_number` (number) - A number representing the order in which hints are to be arranged on a learn page.
* `hint` (string) - The text of the hint that is to be displayed to users.

#### `/:chapter_number/learn-pages/:page_id/hints/:hint_id` (`GET`)

A `GET` request sent to this endpoint will return the hint with the `id` equal to the `hint_id` parameter, for the learn page with the `id` equal to the `page_id` parameter, for the chapter with the `chapter_number` equal to the `chapter_number` parameter.

#### `/:chapter_number/learn-pages/:page_id/hints/:hint_id` (`DELETE`) (admin privileges required)

A `DELETE` request sent to this endpoint will delete the hint with the `id` equal to the `hint_id` parameter, for the learn page with the `id` equal to the `page_id` parameter, for the chapter with the `chapter_number` equal to the `chapter_number` parameter.

#### `/:chapter_number/learn-pages/:page_id/hints/:hint_id` (`PATCH`) (admin privileges required)

A `PATCH` request sent to this endpoint will update the hint with the `id` equal to the `hint_id` parameter, for the learn page with the `id` equal to the `page_id` parameter, for the chapter with the `chapter_number` equal to the `chapter_number` parameter.  The request body must contain at least one of the following fields:
* `hint_order_number` (number) - A number representing the order in which hints are to be arranged on a learn page.
* `hint` (string) - The text of the hint that is to be displayed to users.

#### `/:chapter_number/do-pages` (`GET`)

A `GET` request sent to this endpoint will return all do pages for the chapter with the `chapter_number` equal to the `chapter_number` parameter.

#### `/:chapter_number/do-pages` (`POST`) (admin privileges required)

A `POST` request sent to this endpoint will create a new do page for the chapter with the `chapter_number` equal to the `chapter_number` parameter.  The `POST` request body must contain the following fields:
* `page` (number) - A page number representing the order in which the do pages are presented to the user.
* `question_type` (string) - A string representing the type of question.  `question_type` must be one of the following: `multiple-choice`, `input`, `true/false`.
* `question` (string) - The question that the user is to be asked.

The following fields are optional: 
* `dialogue` (text) - Optional dialogue to be displayed with the question.
* `dialogue_look_back` (boolean) - A boolean value indicating whether the dialogue displays user input.
* `dialogue_to_look_for` (string) - A string representing the key for the property that is to be sought in saved user input and displayed in dialogue.
* `incorrect_response_option_1` (string) - A string representing the first incorrect option to be presented among response choices.
* `incorrect_response_option_2` (string) - A string representing the second incorrect option to be presented among response choices.
* `incorrect_response_option_3` (string) - A string representing a third incorrect option to be presented among response choices.
* `correct_response` (string) - A string representing the correct option to be presented among response choices.
* `response_if_incorrect_1` (string) - A string representing the response presented to a user if the first incorrect option is selected.
* `response_if_incorrect_2` (string) - A string representing the response presented to a user if the second incorrect option is selected.
* `response_if_incorrect_3` (string) - A string representing the response presented to a user if the third incorrect option is selected.
* `look_ahead` (boolean) - A boolean value representing whether the user's response is to be saved for future use.
* `look_back` (boolean) - A boolean value representing whether the question is to make use of saved user input.
* `property_to_save` (string) - A string respresenting the key under which user input is to be saved.
* `property_to_look_for` (string) - A string representing the key for the property that is to be sought in saved user input and used in the question. 
* `input_label` (string) - A string representing the label to be used for the question if the `question_type` equals `input`.
* `image_url` (string) - A URL for the image to be displayed with the do page question.
* `image_alt_text` (string) - The `alt` text for the image to be displayed with the do page question.
* `background_image_url` (string) - A URL for the background image to be displayed with the do page question.
* `background_image_alt_text` (string) - The `alt` text for the background image to be displayed with the do page question.

#### `/:chapter_number/do-pages/:page_id` (`GET`)

A `GET` request sent to this endpoint will return the do page with the `id` equal to the `page_id` parameter, for the chapter with the `chapter_number` equal to the `chapter_number` parameter.

#### `/:chapter_number/do-pages/:page_id` (`DELETE`) (admin privileges required)

A `DELETE` request sent to this endpoint will delete the do page with the `id` equal to the `page_id` parameter, for the chapter with the `chapter_number` equal to the `chapter_number` parameter.

#### `/:chapter_number/do-pages/:page_id` (`PATCH`) (admin privileges required)

A `PATCH` request sent to this endpoint will update the do page with the `id` equal to the `page_id` parameter, for the chapter with the `chapter_number` equal to the `chapter_number` parameter.  The request body must contain at least one of the following fields:
* `page` (number) - A page number representing the order in which the do pages are presented to the user.
* `question_type` (string) - A string representing the type of question.  `question_type` must be one of the following: `multiple-choice`, `input`, `true/false`.
* `question` (string) - The question that the user is to be asked.
* `dialogue` (text) - Optional dialogue to be displayed with the question.
* `dialogue_look_back` (boolean) - A boolean value indicating whether the dialogue displays user input.
* `dialogue_to_look_for` (string) - A string representing the key for the property that is to be sought in saved user input and displayed in dialogue.
* `incorrect_response_option_1` (string) - A string representing the first incorrect option to be presented among response choices.
* `incorrect_response_option_2` (string) - A string representing the second incorrect option to be presented among response choices.
* `incorrect_response_option_3` (string) - A string representing the third incorrect option to be presented among response choices.
* `correct_response` (string) - A string representing the correct option to be presented among response choices.
* `response_if_incorrect_1` (string) - A string representing the response presented to a user if the first incorrect option is selected.
* `response_if_incorrect_2` (string) - A string representing the response presented to a user if the second incorrect option is selected.
* `response_if_incorrect_3` (string) - A string representing the response presented to a user if the third incorrect option is selected.
* `look_ahead` (boolean) - A boolean value representing whether the user's response is to be saved for future use.
* `look_back` (boolean) - A boolean value representing whether the question is to make use of saved user input.
* `property_to_save` (string) - A string respresenting the key under which user input is to be saved.
* `property_to_look_for` (string) - A string representing the key for the property that is to be sought in saved user input and used in the question. 
* `input_label` (string) - A string representing the label to be used for the question if the `question_type` equals `input`.
* `image_url` (string) - A URL for the image to be displayed with the do page question.
* `image_alt_text` (string) - The `alt` text for the image to be displayed with the do page question.
* `background_image_url` (string) - A URL for the background image to be displayed with the do page question.
* `background_image_alt_text` (string) - The `alt` text for the background image to be displayed with the do page question.

### Notes `/notes`

#### `/` (`GET`) (authorization required)

A `GET` request sent to this endpoint will return the notes saved by the user whose information is contained in the `bearer` token appended to the `Authorization` header.

#### `/` (`POST`) (authorization required)

A `POST` request sent to this endpoint will create a new note for the user whose information is contained in the `bearer` token appended to the `Authorization` header.  The `POST` request body must contain the following fields:
* `hint_id` (number) - The `id` of the hint that is to be saved with the note. 

The following fields are optional:
* `custom_note` (string) - A custom note written by the user that is to be saved with the hint.

#### `/:note_id` (`GET`) (authorization required)

A `GET` request sent to this endpoint will return the saved note with the `id` equal to the `note_id` parameter, for the user whose information is contained in the `bearer` token appended to the `Authorization` header.

#### `/:note_id` (`DELETE`) (authorization required)

A `DELETE` request sent to this endpoint will delete the saved note with the `id` equal to the `note_id` parameter, for the user whose information is contained in the `bearer` token appended to the `Authorization` header.

#### `/:note_id` (`PATCH`) (authorization required)

A `PATCH` request sent to this endpoint will update the saved note with the `id` equal to the `note_id` parameter, for the user whose information is contained in the `bearer` token appended to the `Authorization` header.  The request body must contain at least one of the following fields:
* `hint_id` (number) - The `id` of the hint that is to be saved with the note. 
* `custom_note` (string) - A custom note written by the user that is to be saved with the hint.
* `date_modified` (string) - The date and time at which the note was modified (in JSON string format; e.g. `2020-07-31T19:35:31.457Z`).

### Progress `/progress`

#### `/` (`GET`) (authoriation required)

A `GET` request sent to this endpoint will return all progress entries for the user whose information is contained in the `bearer` token appended to the `Authorization` header.

#### `/` (`POST`) (authorization required)

A `POST` request sent to this endpoint will create a new progress entry for the user whose information is contained in the `bearer` token appended to the `Authorization` header.  The `POST` request body must contain the following fields:
* `chapter_number` (number) - The `chapter_number` for the chapter that has been completed.

#### '/:progress_id` (`GET`) (authorization required)

A `GET` request sent to this endpoint will return the progress entry with the `id` equal to the `progress_id` parameter, for the user whose information is contained in the `bearer` token appended to the `Authorization` header.

#### '/:progress_id` (`DELETE`) (authorization required)

A `DELETE` request sent to this endpoint will delete the progress entry with the `id` equal to the `progress_id` parameter, for the user whose information is contained in the `bearer` token appended to the `Authorization` header.
