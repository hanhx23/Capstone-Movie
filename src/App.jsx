import { Route, Routes } from "react-router";
import { RegisterPage } from "@/features/register";
import { PRIVATE_PATH, PUBLIC_PATH } from "@/constant";
import { MainLayout } from "./layout/MainLayout";
import { AdminLayout } from "./layout/AdminLayout";

import { UserProfilePage } from "./features/user-profile";
import {
  UserManagementPage,
  FilmManagementPage,
  ShowtimePage,
} from "./features/admin";

import { SignInPage } from "./features/sign-in";
import { Home, MovieDetail } from "./features/home";
import { Booking } from "./features/booking";

import { AddFilmPage } from "./features/admin/components/AddFilmPage";
import { AddUserPage } from "./features/admin/components/AddUserPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={PUBLIC_PATH.HOME} element={<Home />} />
        <Route path={PUBLIC_PATH.MOVIE_DETAIL} element={<MovieDetail />} />
        <Route path={PUBLIC_PATH.BOOKING} element={<Booking />} />
        <Route path={PUBLIC_PATH.SIGN_IN} element={<SignInPage />} />
        <Route path={PUBLIC_PATH.REGISTER} element={<RegisterPage />} />
        <Route path={PRIVATE_PATH.USER_PROFILE} element={<UserProfilePage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="users" element={<UserManagementPage />} />
        <Route path="users/add" element={<AddUserPage />} />

        <Route path="films" element={<FilmManagementPage />} />
        <Route path="films/add" element={<AddFilmPage />} />
        <Route path="films/showtime/:idFilm" element={<ShowtimePage />} />
      </Route>
    </Routes>
  );
}

export default App;