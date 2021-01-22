# What I'd improve if I had more time

I'll start with the big one... I haven't managed to get any automated tests set up. I generally work within a webpack environment where it is much easier to write modular and testable code. I kept running into CORS issues when trying to convert my code to modules, even when using a local server, and after wasting about 30 minutes on it I abandoned getting testing setup altogether for fear of wasting any more time.

I've manually tested the rest of my code and think it's working.

I've done some very minimal styling to identify when an input has a validation error, but haven't added any additional hinting to help the user.

I'd normally comment my code more but have run out of time... I hope it is still readable.

The validation on inputs is really basic - it checks for empty inputs and checks that the content entered is either a string, email, or phone number respectively. With the phone validation I've set the RegExp up to check for a 0 followed by either 9 or 10 digits which covers most UK phone numbers.

In the past I've used libraries such as Yup for more comprehensive validation.