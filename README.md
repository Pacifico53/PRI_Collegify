# PRI_Collegify
Trabalho final de PRI, 2020/2021

1

```
npm install
```

2

```
npm start
```

ou

```
nodemon
```

## Rotas da API
 * GET /
 * GET /login
 * GET /signup
 * GET /main

#### Auth
 * GET /auth/google
 * GET /auth/google/callback
 * GET /auth/facebook
 * GET /auth/facebook/callback

#### Users
 * GET /users
 * GET /users/logout
 * POST /users/login
 * POST /users/signup
 * POST /users/delete/:idUser
 * POST /users/update/:idUser
 * GET /users/profilePage
 * GET /users/:uname/favs
 * GET /users/:uname

#### Posts
 * GET /posts
 * GET /posts/tag/:tag
 * GET /posts/:idPost/delete
 * GET /posts/upload
 * POST /posts/upload
 * GET /posts/download/:filename
 * POST /posts/comment/:idPost
 * POST /posts/fav/:idPost
 * POST /posts/like/:idPost
 * POST /posts/likeComment/:index/:idPost
 * GET /posts/:idPost

 #### Cursos
 * GET /cursos
 * GET /cursos/:idCurso/ano/:ano/semestre/:sem
 * GET /cursos/:idCurso/ano/:ano/semestre/:sem/uc/:uc
 * GET /cursos/:idCurso/ano/:ano
 * GET /cursos/:idCurso