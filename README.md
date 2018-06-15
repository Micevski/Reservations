# Reservations
The main idea in this application is to help all users to make reservation in their favorite bar or club.
Secondly, users can browse throw our database and find a perfect local in their area, make reseravtions, and of course have some fun 
with their friends.
## API ##
Using Spring Boot we build a RESTful API to provide our client with needed content. 
All data in our database is stored using Spiring JPA with PostgreSQL. 
All tables are generated automaticly using ``spring.jpa.generate-ddl=true``.
This app has two type of users: 
- Owner
- User
### Owners ###
Owners can add all their places and monitor them for number of reservations, total number of guest and search by date.
The data we keep for owenrs are prity same as regular users exept foreign keys for there companies.
When new owner is register he has to provide following info:
- First Name
- Surname
- Email
- Password

After succesfull registration owenrs can now add their places. This is prity straightforward just add all information about it
and this company is added as yours.
### Users ###
All users can search throw database and take a look at places in their interest, only authenticated user are able to make reseravtion.

### Authenticated Users ###

Anyone who would like to make reservations has to be authenticated. To become authenticated user you must to register using register form.
When new user is registering he has to provide the same infomratio as Owners.

All password are stored crypted, using ``org.springframework.security.crypto.password`` - ``PasswordEncoder``.

> Note that this app is in stil develop.
