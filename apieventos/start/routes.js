"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "API no Ar" };
});

//User
Route.post("users", "UserController.store").validator("user");
Route.put("users", "UserController.update")
  .validator("userUpdatePassword")
  .middleware("auth");

//session
Route.post("sessions", "SessionController.store").validator("session");

//evento

Route.post("evento", "MeetAppController.store").middleware("auth");

Route.put("evento/:id", "MeetAppController.update")
  // .validator("userUpdatePassword")
  .middleware("auth");

Route.delete("evento/:id", "MeetAppController.destroy")
  // .validator("userUpdatePassword")
  .middleware("auth");

Route.get("evento/showAll", "MeetAppController.showAll")
  // .validator("userUpdatePassword")
  .middleware("auth");

//inscrição

Route.post("inscricao", "RegisterMeetController.store").middleware("auth");
