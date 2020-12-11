CREATE TABLE public.user
(
    userId SERIAL NOT NULL PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    zipCode INT NOT NULL,
    userEmail VARCHAR(100) NOT NULL,
	userPassword VARCHAR(100) NOT NULL
);

CREATE TABLE public.clothing
(
    clothingId SERIAL NOT NULL PRIMARY KEY,
    clothingType VARCHAR(100) NOT NULL,
    clothingColor VARCHAR(100) NOT NULL,
    warmRating INT NOT NULL,
    casualRating INT NOT NULL,
    clothingImage VARCHAR(200) NOT NULL,
    userId INT NOT NULL REFERENCES public.user(userId)
);