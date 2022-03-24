# Projects List Application

A simple web application with which we can view the projects in the project table after logging in.

# Steps to run the project

install mysql v8+ & node v16+.
create "projects" DB.
If needed modify the Connection details in connection.js file

To run : npm run dev (development mode only)

# Technical description

## Tables

Projects(project_id,user_id-fk,c_id-fk,title ), Users (user_id-pk,username,password), Categories (c_id-pk,category_name).

## Features

Login, Initial Static Data migration , Fetch API for the Projects table (view, sort, pagination),

Tech stack - Backend - express, mysql; Frontend - HTML, JS, CSS;

# API List

## /

would render the UI

## GET /api/category/

API to get the list of categories in the DB > category table

## GET /api/project

Sample REq: GET /project/?orderBy=username&listOrder=DESC&limit=4&page=1
Query - orderBy(project, created, username, catergory), listOrder(ASC, DESC), limit(int), page(int)
Header - authorization: Bearer token;

## POST /api/user/register

API to register a new user

## POST /api/user/login

API to login and get the access token

## GET /api/user/verifytoken

API to verify if the token is a valid one or not
