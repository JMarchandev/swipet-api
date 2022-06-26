<div id="top"></div>


<!-- Badges -->
[![Contributors][contributors-shield]][contributors-url]
[![Maintenance][maintenance-shield]][maintenance-url]
[![Last-commit][last-commit-shield]][last-commit-url]
[![Pull-request][pull-request-shield]][pull-request-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
<!-- Badges -->

&nbsp;
&nbsp;

<!-- Header -->
<div align="center">
  <a href="#">
    <img src="https://user-images.githubusercontent.com/47782394/175833510-680eed3a-8c63-4952-8839-46964dba434a.png" alt="Logo" width="25%" height="auto">
  </a>
</div>
<!-- Header -->

&nbsp;
&nbsp;

# About The Project
## Context
This project was done for my school. Basically the functionality was limited and not very successful. Over time I continued to develop this API.

This api was made in Node.JS. The express, http, mongoose and bucket S3 libraries allowed me to manage the data part between the different endpoints and the databases.

Database management was managed by the ORM Mongoose and in no-SQL I used databases with Mongo.

<p align="right">(<a href="#top">back to top</a>)</p>
&nbsp;

## Build with

I like working with recent technologies for experimentation. Looking back I think a v2 would be a good idea.

* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/fr/)
* [http](https://nodejs.org/api/http.html)
* [Mongodb](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)
* [Bucket S3](https://aws.amazon.com/fr/s3/)

<p align="right">(<a href="#top">back to top</a>)</p>
&nbsp;

# Getting started

Configuration and installation of project "swipet-api"

## Required
* [Node.js](https://nodejs.org/en/)
* npm: &nbsp; `npm install npm@latest -g`

&nbsp;

## Configuration

We use bucket s3 for save image profile of users.

Bucket S3 :
1. Create [AWS account](https://portal.aws.amazon.com/billing/signup#/start/email)
2. Turn on the Bucket S3 service
3. Generate api key

&nbsp;

Mongodb :
1. Create [Mongo atlas account](https://account.mongodb.com/account/login)
2. Create new cluster
3. Get api key

&nbsp;

Add `.env` file :
```
    PORT=[port]
    MONGO_USER=
    MONGO_PASSWORD=
    MONGO_CLUSTER=

    // not required
    LOCAL_MONGO_CLUSTER= 

    //array of id of locahost ip for allow device developper 
    NODE_ORIGINS_LIST= 

    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    BUCKET_NAME=

    ENV= development | production
```

<p align="right">(<a href="#top">back to top</a>)</p>
&nbsp;

## Installation

1. Clone the repo
&nbsp;

   ```sh
    $ git clone https://github.com/JMarchandev/swipet-api.git
   ```
2. Clone the repo
&nbsp;

   ```sh
    $ npm install
   ```
3. Be sure to complete `.env`
4. Run project
&nbsp;

   ```sh
    $ npm run dev
   ```

<p align="right">(<a href="#top">back to top</a>)</p>
&nbsp;

## Contact

Jean-Marie Marchand - [Jmarchandev](https://www.jmarchand.dev) - j.marchand.dev@gmail.com

Project Link: [https://github.com/JMarchandev/swipet-api](https://github.com/JMarchandev/swipet-api)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- Imports Badges -->
[contributors-shield]: https://img.shields.io/github/contributors/JMarchandev/swipet-api?style=for-the-badge
[contributors-url]: https://github.com/JMarchandev/swipet-api/graphs/contributors

[maintenance-shield]: https://img.shields.io/badge/Maintenaned-no-red?style=for-the-badge
[maintenance-url]: https://github.com/JMarchandev/swipet-api/graphs/contributors

[last-commit-shield]: https://img.shields.io/github/last-commit/JMarchandev/swipet-api?style=for-the-badge
[last-commit-url]: https://github.com/JMarchandev/swipet-api/pulls?q=is%3Apr+is%3Aclosed

[pull-request-shield]: https://img.shields.io/github/issues-pr-closed/JMarchandev/swipet-api?style=for-the-badge
[pull-request-url]: https://github.com/JMarchandev/swipet-api/pulls?q=is%3Apr+is%3Aclosed

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/jean-marie-marchand-162931180/
<!-- Imports Badges -->

<!-- Example Badge -->
[x-shield]: https://img.shields.io/badge/Maintained%3F-no-red.svg
[x-url]: https://github.com/JMarchandev/swipet-api/...
<!-- Example Badge -->


<!--
<div>
  <img src="https://user-images.githubusercontent.com/47782394/175827271-96a75153-2968-4d3b-a4bb-8aec0677919c.PNG" alt="Logo" height="600">
  <img src="https://user-images.githubusercontent.com/47782394/175827268-df77f2a5-4285-4ecc-bef8-df979e9307df.PNG" alt="Logo" height="600">
  <img src="https://user-images.githubusercontent.com/47782394/175827274-4c29f78b-67c3-42a9-bebb-f0ee9a8aef72.PNG" alt="Logo" height="600">
</div>
-->
